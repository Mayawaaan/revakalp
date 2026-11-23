import crypto from "crypto";
import Grievance from "../models/grievance.model.js";
import Settings from "../models/settings.model.js";
import { isValidEmail, normalizeEmail } from "../lib/security.js";
import { sendEmail } from "../lib/sendEmail.js";

const ALLOWED_CATEGORIES = new Set([
  "order_delivery",
  "return_refund",
  "payment_billing",
  "product_quality",
  "privacy_dpdpa",
  "other",
]);

function formatDateTag(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export const submitGrievance = async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim().slice(0, 30);
    const orderNumber = String(req.body?.orderNumber || "").trim().slice(0, 64);
    const rawCategory = String(req.body?.category || "other").trim();
    const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : "other";
    const subject = String(req.body?.subject || "").trim();
    const description = String(req.body?.description || "").trim();

    if (!fullName || !email || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and complaint details are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (subject.length > 200 || description.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Subject or complaint description exceeds allowed character limits.",
      });
    }

    const ticketId = `GRV-${formatDateTag()}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;

    const grievance = await Grievance.create({
      ticketId,
      fullName,
      email,
      phone,
      orderNumber,
      category,
      subject,
      description,
      status: "open",
      acknowledgedAt: new Date(),
      ...(req.user?._id ? { userId: req.user._id } : {}),
    });

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_EMAIL &&
      process.env.SMTP_PASSWORD
    ) {
      try {
        const settings = await Settings.getSettings().catch(() => null);
        const officerEmail =
          settings?.grievanceOfficerEmail ||
          settings?.supportEmail ||
          process.env.SMTP_EMAIL;

        await sendEmail({
          email: officerEmail,
          subject: `[Grievance ${ticketId}] ${subject}`,
          message: `Ticket ID: ${ticketId}\nCategory: ${category}\nCustomer: ${fullName} (${email})\nPhone: ${phone || "N/A"}\nOrder: ${orderNumber || "N/A"}\n\n${description}`,
        });
      } catch (emailErr) {
        console.warn("Grievance notification email skipped:", emailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      ticketId: grievance.ticketId,
      sla: {
        acknowledgmentHours: 48,
        resolutionDays: 30,
      },
      message:
        "Your grievance has been logged. Our Grievance Officer will acknowledge it within 48 hours.",
    });
  } catch (error) {
    console.error("submitGrievance error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to record grievance right now. Please email contact@revakalp.com.",
    });
  }
};

export const getPublicComplianceInfo = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    return res.status(200).json({
      storeName: settings.storeName || "Revakalp",
      legalEntityName: settings.legalEntityName || "Revakalp",
      gstin: settings.gstin || "",
      address:
        settings.address ||
        "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012",
      supportEmail: settings.supportEmail || "contact@revakalp.com",
      phone: settings.phone || "+91 91096-76562",
      grievanceOfficerName: settings.grievanceOfficerName || "Anjali Katare",
      grievanceOfficerDesignation:
        settings.grievanceOfficerDesignation ||
        "Founder & Grievance Redressal Officer",
      grievanceOfficerEmail:
        settings.grievanceOfficerEmail ||
        settings.supportEmail ||
        "contact@revakalp.com",
      grievanceOfficerPhone:
        settings.grievanceOfficerPhone || settings.phone || "+91 91096-76562",
      countryOfOriginDefault: settings.countryOfOriginDefault || "India",
    });
  } catch (error) {
    console.error("getPublicComplianceInfo error:", error.message);
    return res.status(500).json({ message: "Unable to load compliance information" });
  }
};

export const adminGetGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({})
      .sort({ createdAt: -1 })
      .limit(200);
    return res.status(200).json(grievances);
  } catch (error) {
    console.error("adminGetGrievances error:", error.message);
    return res.status(500).json({ message: "Unable to fetch grievances" });
  }
};

export const adminUpdateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body || {};
    const validStatuses = new Set(["open", "acknowledged", "in_progress", "resolved"]);

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (status !== undefined) {
      if (!validStatuses.has(status)) {
        return res.status(400).json({ message: "Invalid grievance status" });
      }
      grievance.status = status;
      if (status === "resolved" && !grievance.resolvedAt) {
        grievance.resolvedAt = new Date();
      }
    }

    if (adminNote !== undefined) {
      grievance.adminNote = String(adminNote).trim().slice(0, 1000);
    }

    await grievance.save();
    return res.status(200).json(grievance);
  } catch (error) {
    console.error("adminUpdateGrievance error:", error.message);
    return res.status(500).json({ message: "Unable to update grievance" });
  }
};
