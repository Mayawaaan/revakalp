import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, stream) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(stream);

  // Header
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();

  // Order Details
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Order Date: ${order.createdAt.toLocaleDateString()}`);
  doc.text(`Total: $${order.total.toFixed(2)}`);
  doc.moveDown();

  // Shipping Information
  doc.fontSize(14).text('Shipping Information', { underline: true });
  doc.fontSize(12).text(`
    ${order.shippingAddress.street},
    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
    ${order.shippingAddress.country}
    Phone: ${order.shippingAddress.phone}
  `);
  doc.moveDown();

  // Items Table
  doc.fontSize(14).text('Items', { underline: true });
  doc.moveDown();

  const tableTop = doc.y;
  const itemX = 50;
  const quantityX = 250;
  const priceX = 350;
  const totalX = 450;

  doc.fontSize(10).text('Item', itemX, tableTop);
  doc.text('Quantity', quantityX, tableTop);
  doc.text('Price', priceX, tableTop);
  doc.text('Total', totalX, tableTop, { align: 'right' });

  let y = tableTop + 25;
  order.items.forEach(item => {
    doc.fontSize(10).text(item.name, itemX, y);
    doc.text(item.quantity.toString(), quantityX, y);
    doc.text(`$${item.price.toFixed(2)}`, priceX, y);
    doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 0, y, { align: 'right' });
    y += 25;
  });

  doc.moveDown(2);

  // Totals
  const totalY = doc.y;
  doc.fontSize(12).text('Subtotal:', 350, totalY);
  doc.text(`$${order.subtotal.toFixed(2)}`, 450, totalY);
  doc.text('Discount:', 350, totalY + 20);
  doc.text(`$${order.discount.toFixed(2)}`, 450, totalY + 20);
  doc.text('Delivery Fee:', 350, totalY + 40);
  doc.text(`$${order.deliveryFee.toFixed(2)}`, 450, totalY + 40);
  doc.fontSize(14).text('Total:', 350, totalY + 60);
  doc.text(`$${order.total.toFixed(2)}`, 450, totalY + 60);

  doc.end();
};
