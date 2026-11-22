import json
import os
import h5py
import numpy as np


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ML_DIR = os.path.join(ROOT_DIR, "backend", "src", "ml")

H5_PATH = os.path.join(ML_DIR, "sentiment_model_20_lakh.h5")
TOKENIZER_PATH = os.path.join(ML_DIR, "tokenizer_20_lakh.json")
WEIGHTS_BIN_PATH = os.path.join(BACKEND_ML_DIR, "sentiment-weights.bin")
MANIFEST_PATH = os.path.join(BACKEND_ML_DIR, "sentiment-manifest.json")

MAX_LEN = 30
LABELS = ["negative", "neutral", "positive"]


def export():
    if not os.path.exists(H5_PATH):
        raise FileNotFoundError(f"Missing trained H5 model at {H5_PATH}")
    if not os.path.exists(TOKENIZER_PATH):
        raise FileNotFoundError(f"Missing tokenizer JSON at {TOKENIZER_PATH}")

    with open(TOKENIZER_PATH, "r", encoding="utf-8") as f:
        tok_raw = json.load(f)

    tok_cfg = tok_raw.get("config", {})
    word_index_raw = tok_cfg.get("word_index", "{}")
    word_index = (
        json.loads(word_index_raw)
        if isinstance(word_index_raw, str)
        else dict(word_index_raw)
    )
    oov_token = tok_cfg.get("oov_token", "<OOV>")
    oov_index = int(word_index.get(oov_token, 1))
    vocab_rows = max((int(v) for v in word_index.values()), default=0) + 1

    with h5py.File(H5_PATH, "r") as h5f:
        embedding_full = h5f[
            "model_weights/embedding/sequential/embedding/embeddings"
        ][:]
        if vocab_rows > embedding_full.shape[0]:
            raise ValueError(
                f"Tokenizer index {vocab_rows} exceeds embedding rows {embedding_full.shape[0]}"
            )

        raw_tensors = [
            ("embedding", embedding_full[:vocab_rows]),
            (
                "forwardKernel",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/kernel"
                ][:],
            ),
            (
                "forwardRecurrent",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/recurrent_kernel"
                ][:],
            ),
            (
                "forwardBias",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/forward_lstm/lstm_cell/bias"
                ][:],
            ),
            (
                "backwardKernel",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/kernel"
                ][:],
            ),
            (
                "backwardRecurrent",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/recurrent_kernel"
                ][:],
            ),
            (
                "backwardBias",
                h5f[
                    "model_weights/bidirectional/sequential/bidirectional/backward_lstm/lstm_cell/bias"
                ][:],
            ),
            (
                "dense1Kernel",
                h5f["model_weights/dense/sequential/dense/kernel"][:],
            ),
            ("dense1Bias", h5f["model_weights/dense/sequential/dense/bias"][:]),
            (
                "dense2Kernel",
                h5f["model_weights/dense_1/sequential/dense_1/kernel"][:],
            ),
            (
                "dense2Bias",
                h5f["model_weights/dense_1/sequential/dense_1/bias"][:],
            ),
        ]

    os.makedirs(BACKEND_ML_DIR, exist_ok=True)

    tensors_meta = {}
    byte_offset = 0

    with open(WEIGHTS_BIN_PATH, "wb") as bin_file:
        for name, arr in raw_tensors:
            f32 = np.ascontiguousarray(arr, dtype="<f4")
            raw_bytes = f32.tobytes()
            bin_file.write(raw_bytes)
            tensors_meta[name] = {
                "offset": byte_offset,
                "length": int(f32.size),
                "shape": [int(dim) for dim in f32.shape],
            }
            byte_offset += len(raw_bytes)

    manifest = {
        "modelName": "sentiment_model_20_lakh",
        "architecture": "Embedding(128) -> BiLSTM(64) -> Dense(64, relu) -> Dense(3, softmax)",
        "maxLen": MAX_LEN,
        "labels": LABELS,
        "oovIndex": oov_index,
        "vocabRows": vocab_rows,
        "vocabSize": len(word_index),
        "filters": tok_cfg.get(
            "filters", "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n"
        ),
        "lower": bool(tok_cfg.get("lower", True)),
        "wordIndex": {str(k): int(v) for k, v in word_index.items()},
        "weightsBytes": byte_offset,
        "tensors": tensors_meta,
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, separators=(",", ":"))

    print(
        f"Exported {len(raw_tensors)} float32 tensors ({byte_offset} bytes) "
        f"to {WEIGHTS_BIN_PATH} and {MANIFEST_PATH}"
    )


if __name__ == "__main__":
    export()
