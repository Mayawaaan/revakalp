import React, { useState, useEffect } from "react";
import {
  Store,
  Truck,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import useStore from "../../store/store";

const SectionCard = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <div className="bg-white border border-[#38131E]/12 rounded-2xl p-6 space-y-5 shadow-xs">
      <div className="flex items-center gap-3 pb-3 border-b border-[#38131E]/10">
        <div className="w-8 h-8 rounded-lg bg-[#F7F1E5] border border-[#D4AF63]/40 flex items-center justify-center">
          <Icon size={16} className="text-[#38131E]" />
        </div>
        <h2 className="font-serif text-xl text-[#38131E]">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#38131E]/75 font-semibold mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-[#1A1718]/55 mt-1">{hint}</p>}
  </div>
);

const inputCls =
  "w-full border border-[#38131E]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] bg-white placeholder-[#1A1718]/40";

const Toggle = ({ name, checked, onChange, disabled, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none group">
    <div className="relative">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#38131E]" : "bg-[#38131E]/20"
        }`}
      />
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </div>
    <span className="text-sm text-[#1A1718] group-hover:text-[#38131E] transition-colors">
      {label}
    </span>
  </label>
);

const Settings = () => {
  const { settings, settingsLoading, fetchSettings, updateSettings, showToast } =
    useStore();

  const [formData, setFormData] = useState({
    storeName: "",
    supportEmail: "",
    currency: "INR",
    freeShippingThreshold: 500,
    deliveryFee: 50,
    codEnabled: true,
    razorpayEnabled: false,
    upiEnabled: false,
    emailNotifications: true,
    admin2FA: false,
    maintenanceMode: false,
    storeDescription: "",
    phone: "",
    address: "",
    legalEntityName: "Revakalp",
    gstin: "",
    grievanceOfficerName: "Anjali Katare",
    grievanceOfficerDesignation: "Founder & Grievance Redressal Officer",
    grievanceOfficerEmail: "contact@revakalp.com",
    grievanceOfficerPhone: "+91 91096-76562",
    countryOfOriginDefault: "India",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "",
        supportEmail: settings.supportEmail || "",
        currency: settings.currency || "INR",
        freeShippingThreshold: settings.freeShippingThreshold || 500,
        deliveryFee: settings.deliveryFee || 50,
        codEnabled: settings.codEnabled !== undefined ? settings.codEnabled : true,
        razorpayEnabled:
          settings.razorpayEnabled !== undefined ? settings.razorpayEnabled : false,
        upiEnabled: settings.upiEnabled !== undefined ? settings.upiEnabled : false,
        emailNotifications:
          settings.emailNotifications !== undefined ? settings.emailNotifications : true,
        admin2FA: settings.admin2FA !== undefined ? settings.admin2FA : false,
        maintenanceMode:
          settings.maintenanceMode !== undefined ? settings.maintenanceMode : false,
        storeDescription: settings.storeDescription || "",
        phone: settings.phone || "",
        address: settings.address || "",
        legalEntityName: settings.legalEntityName || "Revakalp",
        gstin: settings.gstin || "",
        grievanceOfficerName: settings.grievanceOfficerName || "Anjali Katare",
        grievanceOfficerDesignation:
          settings.grievanceOfficerDesignation ||
          "Founder & Grievance Redressal Officer",
        grievanceOfficerEmail:
          settings.grievanceOfficerEmail ||
          settings.supportEmail ||
          "contact@revakalp.com",
        grievanceOfficerPhone:
          settings.grievanceOfficerPhone ||
          settings.phone ||
          "+91 91096-76562",
        countryOfOriginDefault: settings.countryOfOriginDefault || "India",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      showToast("Settings saved successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const PageHeader = () => (
    <div>
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
        Configuration
      </p>
      <h1 className="text-3xl font-serif text-[#38131E]">Settings</h1>
      <p className="text-[#1A1718]/70 text-sm mt-1">
        Manage global store configuration and Indian statutory disclosures
      </p>
    </div>
  );

  if (settingsLoading) {
    return (
      <div className="space-y-8">
        <PageHeader />
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#38131E]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard icon={Store} title="Store Settings">
          <Field label="Store Name">
            <input
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Revakalp"
              className={inputCls}
              disabled={settingsLoading}
            />
          </Field>
          <Field label="Support Email">
            <input
              name="supportEmail"
              type="email"
              value={formData.supportEmail}
              onChange={handleChange}
              placeholder="contact@revakalp.com"
              className={inputCls}
              disabled={settingsLoading}
            />
          </Field>
          <Field label="Currency">
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={inputCls}
              disabled={settingsLoading}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </Field>
          <Field label="Store Description">
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              placeholder="Short description of your store"
              className={inputCls}
              rows={3}
              disabled={settingsLoading}
            />
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 91096-76562"
              className={inputCls}
              disabled={settingsLoading}
            />
          </Field>
          <Field label="Address">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Store address"
              className={inputCls}
              rows={2}
              disabled={settingsLoading}
            />
          </Field>
        </SectionCard>

        <SectionCard icon={Truck} title="Shipping">
          <Field
            label="Free Shipping Threshold"
            hint="Orders above this amount qualify for free shipping"
          >
            <input
              type="number"
              name="freeShippingThreshold"
              value={formData.freeShippingThreshold}
              onChange={handleChange}
              placeholder="500"
              className={inputCls}
              disabled={settingsLoading}
            />
          </Field>
          <Field label="Default Delivery Fee">
            <input
              type="number"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleChange}
              placeholder="50"
              className={inputCls}
              disabled={settingsLoading}
            />
          </Field>
        </SectionCard>

        <SectionCard icon={CreditCard} title="Payments">
          <Toggle
            name="codEnabled"
            checked={formData.codEnabled}
            onChange={handleChange}
            disabled={settingsLoading}
            label="Enable Cash on Delivery"
          />
          <Toggle
            name="razorpayEnabled"
            checked={formData.razorpayEnabled}
            onChange={handleChange}
            disabled={settingsLoading}
            label="Enable Razorpay Payments"
          />
          <Toggle
            name="upiEnabled"
            checked={formData.upiEnabled}
            onChange={handleChange}
            disabled={settingsLoading}
            label="Enable UPI Payments"
          />
        </SectionCard>

        <SectionCard icon={Bell} title="Notifications">
          <Toggle
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
            disabled={settingsLoading}
            label="Email alerts for new orders"
          />
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard icon={FileText} title="Legal & Indian Compliance Details">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Legal Business / Trade Name">
                <input
                  name="legalEntityName"
                  value={formData.legalEntityName}
                  onChange={handleChange}
                  placeholder="Revakalp"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field
                label="GSTIN"
                hint="Leave blank if not displayed publicly; only shown when entered"
              >
                <input
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="Optional 15-character GSTIN"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field label="Grievance Officer Name">
                <input
                  name="grievanceOfficerName"
                  value={formData.grievanceOfficerName}
                  onChange={handleChange}
                  placeholder="Anjali Katare"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field label="Grievance Officer Designation">
                <input
                  name="grievanceOfficerDesignation"
                  value={formData.grievanceOfficerDesignation}
                  onChange={handleChange}
                  placeholder="Founder & Grievance Redressal Officer"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field label="Grievance Officer Email">
                <input
                  type="email"
                  name="grievanceOfficerEmail"
                  value={formData.grievanceOfficerEmail}
                  onChange={handleChange}
                  placeholder="contact@revakalp.com"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field label="Grievance Officer Phone">
                <input
                  name="grievanceOfficerPhone"
                  value={formData.grievanceOfficerPhone}
                  onChange={handleChange}
                  placeholder="+91 91096-76562"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
              <Field label="Default Country of Origin">
                <input
                  name="countryOfOriginDefault"
                  value={formData.countryOfOriginDefault}
                  onChange={handleChange}
                  placeholder="India"
                  className={inputCls}
                  disabled={settingsLoading}
                />
              </Field>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2">
          <SectionCard icon={Shield} title="Security">
            <div className="grid sm:grid-cols-2 gap-5">
              <Toggle
                name="admin2FA"
                checked={formData.admin2FA}
                onChange={handleChange}
                disabled={settingsLoading}
                label="Enable 2-Factor Authentication for Admin"
              />
              <Toggle
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                disabled={settingsLoading}
                label="Enable Maintenance Mode"
              />
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={settingsLoading || saving}
          className="rk-btn-primary"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={15} /> Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
