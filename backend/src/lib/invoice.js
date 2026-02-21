import PDFDocument from "pdfkit";
// import logo from "./logoSilver.png";
import dotenv from "dotenv";

dotenv.config();


export const generateInvoicePDF = (order, stream) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(stream);

  const storeName = "REVAKALP";
  const currency = "₹";
  const pageWidth = doc.page.width;
  const leftX = 50; // left margin
const halfWidth = (doc.page.width - 100) / 2; // page width minus margins, divided by 2

  /* ================= HEADER ================= */
  doc
    .rect(0, 0, pageWidth, 120)
    // .fill("#111827");
    .fill("#c9487c");

  doc.image("./logoSilver.png", pageWidth - 240, 35, { width: 150 });
  doc
    .fillColor("#ffffff")
    .fontSize(26)
    .font("Helvetica-Bold")
    .text("INVOICE", 50, 45);

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(`Order ID: ${order._id}`, 50, 80)
    .text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      pageWidth - 200,
      80
    );

  doc.moveDown(4);
  doc.fillColor("#000000");

  /* ================= SHIPPING ================= */
  const topOfShipping = doc.y;
  doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("Shipping Details", leftX, doc.y, {
    width: halfWidth
  });

doc.moveDown(0.5);
const yOfShippingBody = doc.y;
  const addr = order.shippingAddress;
  doc
  .font("Helvetica")
  .fontSize(11)
  .text(
`Shipping Details
Address: ${addr.street}
${addr.city}, ${addr.state}, ${addr.country}
(${addr.zip})
Phone: ${addr.phone}`,
    leftX,
    yOfShippingBody,
    {
      width: halfWidth,
      lineGap: 4,
      align: "left"
    }
  );
  const shippingHeight = doc.y;

  doc.font("Helvetica-Bold").fontSize(13).text("Billed To", leftX + halfWidth, topOfShipping, { width: halfWidth, align: "left" });
  doc.moveDown(0.5);
  const userName = order.userId ? `${order.userId.fullName}\n${order.userId.email}` : "N/A";
  doc.font("Helvetica").fontSize(11).text(userName, leftX + halfWidth, yOfShippingBody, { width: halfWidth, lineGap: 4, align: "left" });
  const userHeight = doc.y;

  doc.y = Math.max(shippingHeight, userHeight);

  doc.moveDown(1.5);

  /* ================= ITEMS TABLE ================= */
  const tableTop = doc.y;
  const itemX = 50;
  const qtyX = 280;
  const priceX = 350;
  const totalX = 450;

  // Table Header Background
  doc
    .rect(50, tableTop - 5, pageWidth - 100, 25)
    .fill("#f3f4f6");

  doc.fillColor("#000000").font("Helvetica-Bold").fontSize(10);
  doc.text("Item", itemX, tableTop);
  doc.text("Qty", qtyX, tableTop);
  doc.text("Price", priceX, tableTop);
  doc.text("Total", totalX, tableTop, { align: "right" });

  doc.font("Helvetica").fontSize(10);

  let y = tableTop + 25;

  order.items.forEach((item) => {
    if (y > 720) {
      doc.addPage();
      y = 50;
    }

    doc.text(item.name, itemX, y);
    doc.text(String(item.quantity), qtyX, y);
    doc.text(`Rs ${item.price.toFixed(2)}`, priceX, y);
    doc.text(
      `Rs ${(item.quantity * item.price).toFixed(2)}`,
      totalX,
      y,
      { align: "right" }
    );

    y += 22;
  });

  doc.moveDown(2);

  /* ================= TOTAL SUMMARY BOX ================= */
  const boxY = doc.y;
  doc
    .rect(300, boxY, pageWidth - 350, 120)
    .stroke("#e5e7eb");

  let rowY = boxY + 15;

  doc.fontSize(11);
  doc.text("Subtotal:", 320, rowY);
  doc.text(`Rs ${order.subtotal.toFixed(2)}`, 450, rowY);

  rowY += 20;
  doc.text("Discount:", 320, rowY);
  doc.text(`Rs ${order.discount.toFixed(2)}`, 450, rowY);

  rowY += 20;
  doc.text("Delivery Fee:", 320, rowY);
  doc.text(`Rs ${order.deliveryFee.toFixed(2)}`, 450, rowY);

  rowY += 25;
  doc.font("Helvetica-Bold").fontSize(13);
  doc.text("TOTAL:", 320, rowY);
  doc.text(`Rs ${order.total.toFixed(2)}`, 450, rowY);

  doc.moveDown(4);

  /* ================= FOOTER ================= */
  doc
    .fontSize(9)
    .fillColor("#6b7280")
    .text(
      "Thank you for shopping with us.\nThis is a system-generated invoice and does not require a signature.",
      50,
      doc.page.height - 80,
      { align: "center", width: pageWidth - 100 }
    );

  doc.end();
};
