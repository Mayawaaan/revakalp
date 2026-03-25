import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { generateInvoicePDF } from "./invoice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleOrder = {
    _id: "ORDER-000101",
    createdAt: new Date().toISOString(),
    userId: {
        fullName: "Ashmita Saxena",
        email: ""
    },
    shippingAddress: {
        street: "",
        city: "Indore",
        state: "Madhya Pradesh",
        country: "India",
        zip: "452012",
        phone: ""
    },
    items: [
        { name: "Chunri Saree", quantity: 1, price: 749.00 },
    ],
    subtotal: 0, // will be calculated
    discount: 150.00,
    deliveryFee: 0.00,
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
