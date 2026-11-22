import json
import os
from typing import List

import h5py
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------
# Config & Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKENIZER_PATH = os.path.join(BASE_DIR, "tokenizer_20_lakh.json")
MODEL_PATH = os.path.join(BASE_DIR, "sentiment_model_20_lakh.h5")

MAX_LEN = 30  # Matches trained Sequential InputLayer batch_shape [null, 30]
SENTIMENTS = ["negative", "neutral", "positive"]


def _parse_cors_origins() -> List[str]:
    raw = os.getenv("CORS_ORIGIN", "")
    parsed = [origin.strip() for origin in raw.split(",") if origin.strip()]
    if parsed:
        return parsed
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
    ]


# -----------------------------
# Load Tokenizer Config
# -----------------------------
with open(TOKENIZER_PATH, "r", encoding="utf-8") as f:
    _tok_raw = json.load(f)

_tok_cfg = _tok_raw.get("config", {})
_word_index_raw = _tok_cfg.get("word_index", "{}")
WORD_INDEX = (
    json.loads(_word_index_raw)
    if isinstance(_word_index_raw, str)
    else dict(_word_index_raw)
)
OOV_INDEX = int(WORD_INDEX.get(_tok_cfg.get("oov_token", "<OOV>"), 1))
LOWERCASE = bool(_tok_cfg.get("lower", True))
FILTERS = _tok_cfg.get("filters", "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n")
FILTER_TRANS = str.maketrans({ch: " " for ch in FILTERS})


def _tokenize_and_pad(texts: List[str]) -> np.ndarray:
    matrix = np.zeros((len(texts), MAX_LEN), dtype=np.int32)
    for row_idx, raw_text in enumerate(texts):
        cleaned = raw_text.lower() if LOWERCASE else raw_text
        cleaned = cleaned.translate(FILTER_TRANS)
        tokens = cleaned.split()
        for col_idx, token in enumerate(tokens[:MAX_LEN]):
            matrix[row_idx, col_idx] = int(WORD_INDEX.get(token, OOV_INDEX))
    return matrix


# -----------------------------
# Load Inference Backend
# -----------------------------
RUNTIME_BACKEND = "numpy-h5"
_keras_model = None
_keras_pad_sequences = None
_keras_tokenizer = None

try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    from tensorflow.keras.preprocessing.text import tokenizer_from_json

    _keras_tokenizer = tokenizer_from_json(json.dumps(_tok_raw))
    _keras_pad_sequences = pad_sequences
    _keras_model = tf.keras.models.load_model(MODEL_PATH)
    RUNTIME_BACKEND = "tensorflow-keras"
except Exception:
    with h5py.File(MODEL_PATH, "r") as _h5f:
        _EMB = np.array(
            _h5f["model_weights/embedding/sequential/embedding/embeddings"][:],
            dtype=np.float32,
        )
        _FK = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/kernel"
            ][:],
            dtype=np.float32,
        )
        _FR = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/recurrent_kernel"
            ][:],
            dtype=np.float32,
        )
        _FB = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/bias"
            ][:],
            dtype=np.float32,
        )
        _BK = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/kernel"
            ][:],
            dtype=np.float32,
        )
        _BR = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/recurrent_kernel"
            ][:],
            dtype=np.float32,
        )
        _BB = np.array(
            _h5f[
                "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/bias"
            ][:],
            dtype=np.float32,
        )
        _D1K = np.array(
            _h5f["model_weights/dense/sequential/dense/kernel"][:],
            dtype=np.float32,
        )
        _D1B = np.array(
            _h5f["model_weights/dense/sequential/dense/bias"][:],
            dtype=np.float32,
        )
        _D2K = np.array(
            _h5f["model_weights/dense_1/sequential/dense_1/kernel"][:],
            dtype=np.float32,
        )
        _D2B = np.array(
            _h5f["model_weights/dense_1/sequential/dense_1/bias"][:],
            dtype=np.float32,
        )


def _sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def _run_lstm(
    seq_embeddings: np.ndarray,
    kernel: np.ndarray,
    recurrent: np.ndarray,
    bias: np.ndarray,
    reverse: bool = False,
) -> np.ndarray:
    units = recurrent.shape[0]
    h = np.zeros(units, dtype=np.float32)
    c = np.zeros(units, dtype=np.float32)
    steps = seq_embeddings[::-1] if reverse else seq_embeddings
    for step_vec in steps:
        z = step_vec @ kernel + h @ recurrent + bias
        i_gate = _sigmoid(z[:units])
        f_gate = _sigmoid(z[units : 2 * units])
        g_gate = np.tanh(z[2 * units : 3 * units])
        o_gate = _sigmoid(z[3 * units :])
        c = f_gate * c + i_gate * g_gate
        h = o_gate * np.tanh(c)
    return h


def _predict_numpy_matrix(token_matrix: np.ndarray) -> np.ndarray:
    probs_out = np.zeros((token_matrix.shape[0], len(SENTIMENTS)), dtype=np.float32)
    for row_idx, token_ids in enumerate(token_matrix):
        emb = _EMB[token_ids]
        h_fwd = _run_lstm(emb, _FK, _FR, _FB, reverse=False)
        h_bwd = _run_lstm(emb, _BK, _BR, _BB, reverse=True)
        h_cat = np.concatenate([h_fwd, h_bwd])
        dense1 = np.maximum(0.0, h_cat @ _D1K + _D1B)
        logits = dense1 @ _D2K + _D2B
        shifted = logits - np.max(logits)
        exp_scores = np.exp(shifted)
        probs_out[row_idx] = exp_scores / np.sum(exp_scores)
    return probs_out


def _run_model_batch(texts: List[str]) -> np.ndarray:
    if _keras_model is not None and _keras_tokenizer is not None:
        seqs = _keras_tokenizer.texts_to_sequences(texts)
        pad = _keras_pad_sequences(
            seqs, maxlen=MAX_LEN, padding="post", truncating="post"
        )
        return _keras_model.predict(pad, batch_size=256, verbose=0)

    token_matrix = _tokenize_and_pad(texts)
    return _predict_numpy_matrix(token_matrix)


# -----------------------------
# App Init
# -----------------------------
app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_cors_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# -----------------------------
# Request Schemas
# -----------------------------
class Review(BaseModel):
    text: str


class BatchReview(BaseModel):
    texts: List[str]


def _format_prediction(text: str, pred: np.ndarray) -> dict:
    idx = int(np.argmax(pred))
    return {
        "text": text,
        "sentiment": SENTIMENTS[idx],
        "confidence": round(float(np.max(pred)), 4),
        "probabilities": {
            "negative": round(float(pred[0]), 4),
            "neutral": round(float(pred[1]), 4),
            "positive": round(float(pred[2]), 4),
        },
    }


def predict_single(text: str) -> dict:
    preds = _run_model_batch([text])
    return _format_prediction(text, preds[0])


def predict_batch(texts: List[str]) -> List[dict]:
    preds = _run_model_batch(texts)
    return [_format_prediction(text, pred) for text, pred in zip(texts, preds)]


# -----------------------------
# Routes
# -----------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "sentiment_model_20_lakh",
        "backend": RUNTIME_BACKEND,
        "max_len": MAX_LEN,
        "vocab_size": len(WORD_INDEX),
    }


@app.post("/predict")
def predict(review: Review):
    text = (review.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Review text must not be empty")
    return predict_single(text)


@app.post("/predict-batch")
def predict_batch_endpoint(batch: BatchReview):
    cleaned = [str(t or "").strip() for t in batch.texts if str(t or "").strip()]
    if not cleaned:
        raise HTTPException(
            status_code=400, detail="At least one non-empty text is required"
        )
    if len(cleaned) > 5000:
        raise HTTPException(status_code=400, detail="Maximum 5000 texts per request")

    return {
        "count": len(cleaned),
        "results": predict_batch(cleaned),
    }


@app.get("/")
def root():
    return {
        "status": f"Sentiment Analysis API running (20 Lakh Model, {RUNTIME_BACKEND})"
    }
