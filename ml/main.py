from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
from typing import List

# -----------------------------
# App Init
# -----------------------------
app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TOKENIZER_PATH = os.path.join(BASE_DIR, "tokenizer_20_lakh.json")
MODEL_PATH = os.path.join(BASE_DIR, "sentiment_model_20_lakh.h5")

MAX_LEN = 20  # MUST match training

# -----------------------------
# Load Tokenizer
# -----------------------------
with open(TOKENIZER_PATH, "r", encoding="utf-8") as f:
    tokenizer = tokenizer_from_json(f.read())

# -----------------------------
# Load Model
# -----------------------------
model = tf.keras.models.load_model(MODEL_PATH)

sentiments = ["negative", "neutral", "positive"]

# -----------------------------
# Request Schemas
# -----------------------------
class Review(BaseModel):
    text: str

class BatchReview(BaseModel):
    texts: List[str]

# -----------------------------
# Prediction Logic (Single)
# -----------------------------
def predict_single(text: str):
    seq = tokenizer.texts_to_sequences([text])
    pad = pad_sequences(seq, maxlen=MAX_LEN, padding="post", truncating="post")

    pred = model.predict(pad, verbose=0)[0]
    idx = int(np.argmax(pred))

    return {
        "text": text,
        "sentiment": sentiments[idx],
        "confidence": round(float(np.max(pred)), 4),
        "probabilities": {
            "negative": round(float(pred[0]), 4),
            "neutral": round(float(pred[1]), 4),
            "positive": round(float(pred[2]), 4),
        }
    }

# -----------------------------
# Prediction Logic (Batch)
# -----------------------------
def predict_batch(texts: List[str]):
    seqs = tokenizer.texts_to_sequences(texts)
    pad = pad_sequences(seqs, maxlen=MAX_LEN, padding="post", truncating="post")

    preds = model.predict(pad, batch_size=256, verbose=0)

    results = []
    for text, pred in zip(texts, preds):
        idx = int(np.argmax(pred))
        results.append({
            "text": text,
            "sentiment": sentiments[idx],
            "confidence": round(float(np.max(pred)), 4),
            "probabilities": {
                "negative": round(float(pred[0]), 4),
                "neutral": round(float(pred[1]), 4),
                "positive": round(float(pred[2]), 4),
            }
        })
    return results

# -----------------------------
# Routes
# -----------------------------
@app.post("/predict")
def predict(review: Review):
    return predict_single(review.text)

@app.post("/predict-batch")
def predict_batch_endpoint(batch: BatchReview):
    if len(batch.texts) > 5000:
        return {"error": "Maximum 5000 texts per request"}

    return {
        "count": len(batch.texts),
        "results": predict_batch(batch.texts)
    }

@app.get("/")
def root():
    return {"status": "Sentiment Analysis API running (20 Lakh Model)"}