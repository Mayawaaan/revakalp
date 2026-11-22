import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.resolve(__dirname, "../ml/sentiment-manifest.json");
const WEIGHTS_PATH = path.resolve(__dirname, "../ml/sentiment-weights.bin");

const VALID_SENTIMENTS = new Set(["negative", "neutral", "positive"]);

let cachedEngine = null;

function round4(value) {
  return Math.round(Number(value) * 10000) / 10000;
}

function escapeRegexChar(ch) {
  return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function loadEmbeddedEngine() {
  if (cachedEngine) return cachedEngine;

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const rawBuffer = fs.readFileSync(WEIGHTS_PATH);

  // Copy into a cleanly aligned ArrayBuffer so Float32Array views are always 4-byte aligned
  const alignedBuffer = new ArrayBuffer(rawBuffer.byteLength);
  new Uint8Array(alignedBuffer).set(rawBuffer);

  const weights = {};
  for (const [name, meta] of Object.entries(manifest.tensors)) {
    weights[name] = new Float32Array(alignedBuffer, meta.offset, meta.length);
  }

  const wordIndex = new Map(
    Object.entries(manifest.wordIndex || {}).map(([k, v]) => [k, Number(v)])
  );

  const filterChars = Array.from(new Set(String(manifest.filters || "").split("")))
    .map(escapeRegexChar)
    .join("");
  const filterRegex = filterChars ? new RegExp(`[${filterChars}]`, "g") : null;

  cachedEngine = {
    manifest,
    weights,
    wordIndex,
    filterRegex,
    embDim: manifest.tensors.embedding.shape[1],
    lstmUnits: manifest.tensors.forwardRecurrent.shape[0],
    dense1Units: manifest.tensors.dense1Kernel.shape[1],
    numClasses: manifest.labels.length,
  };

  return cachedEngine;
}

function tokenizeAndPad(text, engine) {
  const { manifest, wordIndex, filterRegex } = engine;
  let cleaned = String(text || "");
  if (manifest.lower) cleaned = cleaned.toLowerCase();
  if (filterRegex) cleaned = cleaned.replace(filterRegex, " ");

  const tokens = cleaned.trim().split(/\s+/).filter(Boolean);
  const maxLen = manifest.maxLen;
  const oovIndex = manifest.oovIndex || 1;
  const ids = new Int32Array(maxLen);

  const limit = Math.min(tokens.length, maxLen);
  for (let i = 0; i < limit; i++) {
    const mapped = wordIndex.get(tokens[i]);
    ids[i] = mapped !== undefined ? mapped : oovIndex;
  }
  return ids;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function runLstm(tokenIds, engine, kernel, recurrent, bias, reverse) {
  const { weights, embDim, lstmUnits, manifest } = engine;
  const maxLen = manifest.maxLen;
  const emb = weights.embedding;
  const gateStride = 4 * lstmUnits;

  const h = new Float32Array(lstmUnits);
  const c = new Float32Array(lstmUnits);
  const z = new Float64Array(gateStride);

  for (let step = 0; step < maxLen; step++) {
    const t = reverse ? maxLen - 1 - step : step;
    const tokenId = tokenIds[t];
    const xBase =
      tokenId >= 0 && tokenId < manifest.vocabRows
        ? tokenId * embDim
        : (manifest.oovIndex || 1) * embDim;

    for (let j = 0; j < gateStride; j++) {
      z[j] = bias[j];
    }

    for (let k = 0; k < embDim; k++) {
      const xVal = emb[xBase + k];
      const kRow = k * gateStride;
      for (let j = 0; j < gateStride; j++) {
        z[j] += xVal * kernel[kRow + j];
      }
    }

    for (let u = 0; u < lstmUnits; u++) {
      const hVal = h[u];
      const rRow = u * gateStride;
      for (let j = 0; j < gateStride; j++) {
        z[j] += hVal * recurrent[rRow + j];
      }
    }

    for (let j = 0; j < lstmUnits; j++) {
      const iGate = sigmoid(z[j]);
      const fGate = sigmoid(z[lstmUnits + j]);
      const gGate = Math.tanh(z[2 * lstmUnits + j]);
      const oGate = sigmoid(z[3 * lstmUnits + j]);

      const nextC = fGate * c[j] + iGate * gGate;
      c[j] = nextC;
      h[j] = oGate * Math.tanh(nextC);
    }
  }

  return h;
}

export function predictEmbedded(text) {
  const rawText = String(text || "");
  const trimmed = rawText.trim();
  if (!trimmed) {
    return {
      text: rawText,
      sentiment: "neutral",
      confidence: 0,
      probabilities: { negative: 0, neutral: 1, positive: 0 },
      source: "embedded-bilstm-20lakh",
    };
  }

  const engine = loadEmbeddedEngine();
  const { manifest, weights, embDim, lstmUnits, dense1Units, numClasses } = engine;

  const tokenIds = tokenizeAndPad(trimmed, engine);
  const hFwd = runLstm(
    tokenIds,
    engine,
    weights.forwardKernel,
    weights.forwardRecurrent,
    weights.forwardBias,
    false
  );
  const hBwd = runLstm(
    tokenIds,
    engine,
    weights.backwardKernel,
    weights.backwardRecurrent,
    weights.backwardBias,
    true
  );

  const hCatDim = 2 * lstmUnits;
  const hCat = new Float32Array(hCatDim);
  hCat.set(hFwd, 0);
  hCat.set(hBwd, lstmUnits);

  const dense1 = new Float64Array(dense1Units);
  for (let j = 0; j < dense1Units; j++) {
    let sum = weights.dense1Bias[j];
    for (let k = 0; k < hCatDim; k++) {
      sum += hCat[k] * weights.dense1Kernel[k * dense1Units + j];
    }
    dense1[j] = sum > 0 ? sum : 0;
  }

  const logits = new Float64Array(numClasses);
  let maxLogit = -Infinity;
  for (let j = 0; j < numClasses; j++) {
    let sum = weights.dense2Bias[j];
    for (let k = 0; k < dense1Units; k++) {
      sum += dense1[k] * weights.dense2Kernel[k * numClasses + j];
    }
    logits[j] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  const probs = new Float64Array(numClasses);
  let expSum = 0;
  for (let j = 0; j < numClasses; j++) {
    const val = Math.exp(logits[j] - maxLogit);
    probs[j] = val;
    expSum += val;
  }

  let bestIdx = 0;
  let bestProb = -1;
  for (let j = 0; j < numClasses; j++) {
    probs[j] /= expSum;
    if (probs[j] > bestProb) {
      bestProb = probs[j];
      bestIdx = j;
    }
  }

  void embDim;

  return {
    text: rawText,
    sentiment: manifest.labels[bestIdx],
    confidence: round4(bestProb),
    probabilities: {
      negative: round4(probs[0]),
      neutral: round4(probs[1]),
      positive: round4(probs[2]),
    },
    source: "embedded-bilstm-20lakh",
  };
}

export function predictEmbeddedBatch(texts = []) {
  const list = Array.isArray(texts) ? texts.slice(0, 5000) : [];
  return list.map((t) => predictEmbedded(t));
}

function getConfiguredMlUrl() {
  return String(process.env.ML_SERVICE_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

function normalizeRemotePrediction(raw, fallbackText) {
  if (!raw || !VALID_SENTIMENTS.has(raw.sentiment)) return null;
  const probs = raw.probabilities || {};
  return {
    text: typeof raw.text === "string" ? raw.text : String(fallbackText || ""),
    sentiment: raw.sentiment,
    confidence: Number.isFinite(Number(raw.confidence))
      ? round4(Number(raw.confidence))
      : 0,
    probabilities: {
      negative: round4(Number(probs.negative || 0)),
      neutral: round4(Number(probs.neutral || 0)),
      positive: round4(Number(probs.positive || 0)),
    },
    source: "python-ml-service",
  };
}

export async function analyzeSentiment(text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return predictEmbedded("");

  const mlUrl = getConfiguredMlUrl();
  if (mlUrl) {
    try {
      const { data } = await axios.post(
        `${mlUrl}/predict`,
        { text: cleanText },
        { timeout: 2500 }
      );
      const normalized = normalizeRemotePrediction(data, cleanText);
      if (normalized) return normalized;
    } catch {
      // Fall through cleanly to embedded BiLSTM inference
    }
  }

  return predictEmbedded(cleanText);
}

export async function analyzeSentimentBatch(texts = []) {
  const list = Array.isArray(texts) ? texts.slice(0, 5000) : [];
  if (list.length === 0) return [];

  const mlUrl = getConfiguredMlUrl();
  if (mlUrl) {
    try {
      const { data } = await axios.post(
        `${mlUrl}/predict-batch`,
        { texts: list },
        { timeout: 4000 }
      );
      if (
        Array.isArray(data?.results) &&
        data.results.length === list.length
      ) {
        const normalized = data.results.map((item, idx) =>
          normalizeRemotePrediction(item, list[idx])
        );
        if (normalized.every(Boolean)) return normalized;
      }
    } catch {
      // Fall through cleanly to embedded BiLSTM batch inference
    }
  }

  return predictEmbeddedBatch(list);
}

export async function getMlStatus() {
  const engine = loadEmbeddedEngine();
  const mlUrl = getConfiguredMlUrl();
  let externalReachable = false;

  if (mlUrl) {
    try {
      const res = await axios.get(`${mlUrl}/health`, { timeout: 1500 });
      externalReachable = res?.status === 200;
    } catch {
      externalReachable = false;
    }
  }

  return {
    ready: true,
    modelName: engine.manifest.modelName,
    architecture: engine.manifest.architecture,
    maxLen: engine.manifest.maxLen,
    vocabSize: engine.manifest.vocabSize,
    activeEngine: externalReachable
      ? "python-ml-service"
      : "embedded-bilstm-20lakh",
    externalService: {
      configured: Boolean(mlUrl),
      reachable: externalReachable,
    },
  };
}
