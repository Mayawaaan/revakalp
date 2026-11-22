import express from "express";
import Product from "../models/product.model.js";

const router = express.Router();

const STATIC_PATHS = [
  "/",
  "/shop",
  "/shop/saree",
  "/shop/saree/all",
  "/shop/lehenga/all",
  "/shop/indo-western/all",
  "/shop/printed-tees/all",
  "/heritage",
  "/textile-atlas",
  "/past-editions",
  "/about",
  "/contact",
  "/faq",
  "/delivery-information",
  "/shipping-policy",
  "/returns-exchanges",
  "/cancellation-refund-policy",
  "/privacy-policy",
  "/terms-conditions",
  "/cookie-policy",
  "/grievance-redressal",
  "/legal-compliance",
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl =
      process.env.STOREFRONT_URL ||
      `${req.protocol}://${req.get("host")}`;

    const products = await Product.find({ status: { $ne: "draft" } })
      .select("_id updatedAt")
      .lean();

    const urls = [
      ...STATIC_PATHS.map((p) => `<url><loc>${baseUrl}${p}</loc></url>`),
      ...products.map(
        (p) =>
          `<url><loc>${baseUrl}/product/${p._id}</loc>${
            p.updatedAt
              ? `<lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>`
              : ""
          }</url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
      "\n"
    )}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(xml);
  } catch {
    return res.status(500).send("Unable to generate sitemap");
  }
});

export default router;
