import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // replace
  port: 587,
  secure: false,
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password",
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <yourgmail@gmail.com>`,
      to: "receiveremail@gmail.com",
      subject: "SMTP Test",
      text: "If you received this, SMTP is working.",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error:", error);
  }
}

testEmail();