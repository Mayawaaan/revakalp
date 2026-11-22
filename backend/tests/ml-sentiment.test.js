import test, { describe } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import {
  analyzeSentiment,
  getMlStatus,
  predictEmbedded,
  predictEmbeddedBatch,
} from "../src/services/sentiment.service.js";
import Product from "../src/models/product.model.js";
import Review from "../src/models/review.model.js";
import { createReview } from "../src/controllers/review.controller.js";

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("Embedded 20-Lakh BiLSTM Sentiment Engine", () => {
  test("loads trained binary weights and manifest with maxLen 30 and full vocab", async () => {
    const prevUrl = process.env.ML_SERVICE_URL;
    delete process.env.ML_SERVICE_URL;

    try {
      const status = await getMlStatus();
      assert.equal(status.ready, true);
      assert.equal(status.modelName, "sentiment_model_20_lakh");
      assert.equal(status.maxLen, 30);
      assert.ok(status.vocabSize >= 349);
      assert.equal(status.activeEngine, "embedded-bilstm-20lakh");
    } finally {
      if (prevUrl !== undefined) process.env.ML_SERVICE_URL = prevUrl;
    }
  });

  test("accurately classifies positive, neutral, and negative reviews with high confidence", () => {
    const pos = predictEmbedded("this saree is amazing quality loved it");
    assert.equal(pos.sentiment, "positive");
    assert.ok(pos.confidence > 0.85, `Expected confidence > 0.85, got ${pos.confidence}`);
    assert.equal(pos.source, "embedded-bilstm-20lakh");

    const neg = predictEmbedded("waste of money poor fabric terrible");
    assert.equal(neg.sentiment, "negative");
    assert.ok(neg.confidence > 0.85, `Expected confidence > 0.85, got ${neg.confidence}`);

    const neu = predictEmbedded("okay product average quality fine");
    assert.equal(neu.sentiment, "neutral");
    assert.ok(neu.confidence > 0.85, `Expected confidence > 0.85, got ${neu.confidence}`);

    for (const r of [pos, neg, neu]) {
      const sum =
        r.probabilities.negative +
        r.probabilities.neutral +
        r.probabilities.positive;
      assert.ok(Math.abs(sum - 1) < 0.01, `Probabilities should sum to ~1, got ${sum}`);
    }
  });

  test("handles batch inference, ordering, empty strings, and out-of-vocabulary tokens", () => {
    const inputs = [
      "beautiful paithani silk saree very comfortable",
      "",
      "xyzunseenword123 anotherunknownword456",
      "damaged on arrival very disappointed",
    ];
    const results = predictEmbeddedBatch(inputs);
    assert.equal(results.length, 4);
    assert.equal(results[0].sentiment, "positive");
    assert.equal(results[1].sentiment, "neutral");
    assert.equal(results[1].confidence, 0);
    assert.ok(["negative", "neutral", "positive"].includes(results[2].sentiment));
    assert.equal(results[3].sentiment, "negative");
  });

  test("falls back seamlessly to embedded BiLSTM when ML_SERVICE_URL is unreachable", async () => {
    const prevUrl = process.env.ML_SERVICE_URL;
    process.env.ML_SERVICE_URL = "http://127.0.0.1:19999";

    try {
      const result = await analyzeSentiment(
        "excellent craftsmanship and very happy with quality"
      );
      assert.equal(result.sentiment, "positive");
      assert.ok(result.confidence > 0.8);
      assert.equal(result.source, "embedded-bilstm-20lakh");
    } finally {
      if (prevUrl === undefined) delete process.env.ML_SERVICE_URL;
      else process.env.ML_SERVICE_URL = prevUrl;
    }
  });
});

describe("Review controller ML integration", () => {
  test("stores ML sentiment, confidence, probabilities, and source when creating a review", async (t) => {
    const prevUrl = process.env.ML_SERVICE_URL;
    delete process.env.ML_SERVICE_URL;

    const validProductId = new mongoose.Types.ObjectId().toString();
    const userId = new mongoose.Types.ObjectId().toString();
    const createdPayloads = [];

    t.mock.method(Product, "findById", async () => ({
      _id: validProductId,
      name: "Maheshwari Silk Saree",
    }));
    t.mock.method(Review, "findOne", async () => null);
    t.mock.method(Review, "create", async (payload) => {
      createdPayloads.push(payload);
      return {
        _id: new mongoose.Types.ObjectId().toString(),
        ...payload,
        populate: async () => ({}),
      };
    });

    try {
      const res = createMockRes();
      await createReview(
        {
          user: { _id: userId },
          body: {
            productId: validProductId,
            rating: 5,
            reviewText: "This saree is amazing quality and very comfortable",
          },
        },
        res
      );

      assert.equal(res.statusCode, 201);
      assert.equal(createdPayloads.length, 1);
      assert.equal(createdPayloads[0].sentiment, "positive");
      assert.ok(createdPayloads[0].sentimentConfidence > 0.85);
      assert.equal(createdPayloads[0].sentimentSource, "embedded-bilstm-20lakh");
      assert.ok(
        createdPayloads[0].sentimentProbabilities.positive >
          createdPayloads[0].sentimentProbabilities.negative
      );
    } finally {
      if (prevUrl !== undefined) process.env.ML_SERVICE_URL = prevUrl;
    }
  });
});
