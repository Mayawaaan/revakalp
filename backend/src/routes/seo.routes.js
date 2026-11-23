import express from "express";
import Product from "../models/product.model.js";

const router = express.Router();

const STATIC_PATHS = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.95" },
  { path: "/shop/saree", changefreq: "daily", priority: "0.95" },
  { path: "/shop/saree/all", changefreq: "daily", priority: "0.9" },
  { path: "/shop/lehenga/all", changefreq: "daily", priority: "0.9" },
  { path: "/shop/indo-western/all", changefreq: "daily", priority: "0.85" },
  { path: "/shop/printed-tees/all", changefreq: "weekly", priority: "0.8" },
  { path: "/heritage", changefreq: "weekly", priority: "0.9" },
  { path: "/textile-atlas", changefreq: "weekly", priority: "0.7" },
  { path: "/past-editions", changefreq: "weekly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.75" },
  { path: "/delivery-information", changefreq: "monthly", priority: "0.6" },
  { path: "/returns-exchanges", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.4" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/grievance-redressal", changefreq: "yearly", priority: "0.5" },
  { path: "/legal-compliance", changefreq: "yearly", priority: "0.5" },
];

const HERITAGE_SLUGS = [
  "andhra-pradesh",
  "arunachal-pradesh",
  "assam",
  "bandhani-leheriya",
  "bihar",
  "goa",
  "gujarat",
  "haryana",
  "himachal-pradesh",
  "jharkhand",
  "kanjivaram",
  "karnataka",
  "kerala",
  "kosa-silk",
  "maheshwari",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "paithani",
  "pashmina",
  "punjab",
  "sikkim",
  "telangana",
  "tripura",
  "uttarakhand",
  "uttar-pradesh",
  "west-bengal",
];

const getBaseUrl = (req) =>
  (process.env.STOREFRONT_URL || `${req.protocol}://${req.get("host")}`).replace(
    /\/+$/,
    ""
  );

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);

    const products = await Product.find({ status: { $ne: "draft" } })
      .select("_id updatedAt")
      .lean();

    const urls = [
      ...STATIC_PATHS.map(
        (entry) =>
          `<url><loc>${baseUrl}${entry.path}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
      ),
      ...HERITAGE_SLUGS.map(
        (slug) =>
          `<url><loc>${baseUrl}/heritage/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
      ),
      ...products.map(
        (p) =>
          `<url><loc>${baseUrl}/product/${p._id}</loc>${
            p.updatedAt
              ? `<lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>`
              : ""
          }<changefreq>daily</changefreq><priority>0.85</priority></url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
      "\n"
    )}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(xml);
  } catch {
    return res.status(500).send("Unable to generate sitemap");
  }
});

router.get("/robots.txt", (req, res) => {
  const baseUrl = getBaseUrl(req);
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /cart",
    "Disallow: /place-order",
    "Disallow: /order-success",
    "Disallow: /my-profile",
    "Disallow: /orders",
    "Disallow: /wishlist",
    "Disallow: /login",
    "Disallow: /signup",
    "Disallow: /forgot-password",
    "Disallow: /reset-password",
    "Disallow: /track/",
    "Disallow: /*?*sort=",
    "Disallow: /*?*maxPrice=",
    "Disallow: /*?*inStock=",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "Allow: /llms.txt",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "Allow: /llms.txt",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "Allow: /llms.txt",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(body);
});

router.get("/llms.txt", (req, res) => {
  const baseUrl = getBaseUrl(req);
  const body = [
    "# REVAKALP",
    "",
    "> Curated regional Indian handloom sarees, bridal lehengas, Indo-Western wear, and everyday printed tees from Indore, Madhya Pradesh (est. 2014).",
    "",
    `- Storefront: ${baseUrl}/`,
    `- Collections: ${baseUrl}/shop`,
    `- Sarees: ${baseUrl}/shop/saree`,
    `- 29-State Heritage Atlas: ${baseUrl}/heritage`,
    `- FAQ: ${baseUrl}/faq`,
    `- About: ${baseUrl}/about`,
    `- Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  return res.status(200).send(body);
});

export default router;
