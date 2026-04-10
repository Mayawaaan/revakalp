import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { generateInvoicePDF } from "./invoice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleOrder = {
    _id: "ORDER-000103",
    createdAt: new Date().toISOString(),
    userId: {
        fullName: "",
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
        { name: "Sider Lengha", quantity: 1, price: 1799.00 },
        { name: "Bridal Lengha", quantity: 1, price: 2499.00 },
    ],
    subtotal: 0, // will be calculated
    discount: 698.00,
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
