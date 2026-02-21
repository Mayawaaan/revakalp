import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { generateInvoicePDF } from "./invoice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleOrder = {
    _id: "ORDER12345",
    createdAt: new Date().toISOString(),
    userId: {
        fullName: "John Doe",
        email: "john.doe@example.com"
    },
    shippingAddress: {
        street: "123 Sample St",
        city: "Sampleville",
        state: "Testland",
        country: "Fakeland",
        zip: "12345",
        phone: "555-555-5555"
    },
    items: [
        { name: "Elegant Silk Saree", quantity: 1, price: 4999.50 },
        { name: "Handwoven Cotton Kurta", quantity: 2, price: 1299.00 },
        { name: "Designer Bridal Lehenga", quantity: 1, price: 24999.00 },
    ],
    subtotal: 0, // will be calculated
    discount: 2000.00,
    deliveryFee: 150.00,
    total: 0 // will be calculated
};

// Calculate totals
sampleOrder.subtotal = sampleOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
sampleOrder.total = sampleOrder.subtotal - sampleOrder.discount + sampleOrder.deliveryFee;


const outputFilePath = path.join(__dirname, 'sample_invoice.pdf');
const stream = fs.createWriteStream(outputFilePath);

generateInvoicePDF(sampleOrder, stream);

stream.on('finish', () => {
    console.log(`Sample invoice generated: ${outputFilePath}`);
});

console.log('Generating sample invoice...');
