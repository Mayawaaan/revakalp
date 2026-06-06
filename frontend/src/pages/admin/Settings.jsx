import React, { useState, useEffect } from "react";
import {
  Store, Truck, CreditCard, Bell, Shield, Save, Loader2,
} from "lucide-react";
import useStore from "../../store/store";

/* ── Reusable themed components ── */
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl p-6 space-y-5 shadow-sm">
    <div className="flex items-center gap-3 pb-3 border-b border-pink-100">
      <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
        <Icon size={16} className="text-[#c9487c]" />
      </div>
      <h2 className="font-serif text-lg text-pink-900">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-wider text-pink-500 font-semibold mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-pink-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = "w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 placeholder-pink-300";

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
      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#c9487c]" : "bg-pink-200"}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
    </div>
    <span className="text-sm text-pink-800 group-hover:text-pink-900 transition-colors">{label}</span>
  </label>
);

const Settings = () => {
  const { settings, settingsLoading, fetchSettings, updateSettings, showToast } = useStore();

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
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName:              settings.storeName || "",
        supportEmail:           settings.supportEmail || "",
        currency:               settings.currency || "INR",
        freeShippingThreshold:  settings.freeShippingThreshold || 500,
        deliveryFee:            settings.deliveryFee || 50,
        codEnabled:             settings.codEnabled !== undefined ? settings.codEnabled : true,
        razorpayEnabled:        settings.razorpayEnabled !== undefined ? settings.razorpayEnabled : false,
        upiEnabled:             settings.upiEnabled !== undefined ? settings.upiEnabled : false,
        emailNotifications:     settings.emailNotifications !== undefined ? settings.emailNotifications : true,
        admin2FA:               settings.admin2FA !== undefined ? settings.admin2FA : false,
        maintenanceMode:        settings.maintenanceMode !== undefined ? settings.maintenanceMode : false,
        storeDescription:       settings.storeDescription || "",
        phone:                  settings.phone || "",
        address:                settings.address || "",
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
      <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Configuration</p>
      <h1 className="text-3xl font-serif text-pink-900">Settings</h1>
      <p className="text-pink-600 text-sm mt-1">Manage global store configuration and preferences</p>
    </div>
  );

  if (settingsLoading) {
    return (
      <div className="space-y-8">
        <PageHeader />
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#c9487c]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Store */}
        <SectionCard icon={Store} title="Store Settings">
          <Field label="Store Name">
            <input name="storeName" value={formData.storeName} onChange={handleChange}
              placeholder="Revakalp" className={inputCls} disabled={settingsLoading} />
          </Field>
          <Field label="Support Email">
            <input name="supportEmail" type="email" value={formData.supportEmail}
              onChange={handleChange} placeholder="support@example.com"
              className={inputCls} disabled={settingsLoading} />
          </Field>
          <Field label="Currency">
            <select name="currency" value={formData.currency} onChange={handleChange}
              className={inputCls} disabled={settingsLoading}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </Field>
          <Field label="Store Description">
            <textarea name="storeDescription" value={formData.storeDescription}
              onChange={handleChange} placeholder="Short description of your store"
              className={inputCls} rows={3} disabled={settingsLoading} />
          </Field>
          <Field label="Phone">
            <input name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+91 99999 99999" className={inputCls} disabled={settingsLoading} />
          </Field>
          <Field label="Address">
            <textarea name="address" value={formData.address} onChange={handleChange}
              placeholder="Store address" className={inputCls} rows={2} disabled={settingsLoading} />
          </Field>
        </SectionCard>

        {/* Shipping */}
        <SectionCard icon={Truck} title="Shipping">
          <Field label="Free Shipping Threshold" hint="Orders above this amount qualify for free shipping">
            <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold}
              onChange={handleChange} placeholder="500" className={inputCls} disabled={settingsLoading} />
          </Field>
          <Field label="Default Delivery Fee">
            <input type="number" name="deliveryFee" value={formData.deliveryFee}
              onChange={handleChange} placeholder="50" className={inputCls} disabled={settingsLoading} />
          </Field>
        </SectionCard>

        {/* Payments */}
        <SectionCard icon={CreditCard} title="Payments">
          <Toggle name="codEnabled"       checked={formData.codEnabled}       onChange={handleChange} disabled={settingsLoading} label="Enable Cash on Delivery" />
          <Toggle name="razorpayEnabled"  checked={formData.razorpayEnabled}  onChange={handleChange} disabled={settingsLoading} label="Enable Razorpay Payments" />
          <Toggle name="upiEnabled"       checked={formData.upiEnabled}       onChange={handleChange} disabled={settingsLoading} label="Enable UPI Payments" />
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notifications">
          <Toggle name="emailNotifications" checked={formData.emailNotifications}
            onChange={handleChange} disabled={settingsLoading} label="Email alerts for new orders" />
        </SectionCard>

        {/* Security — full width */}
        <div className="lg:col-span-2">
          <SectionCard icon={Shield} title="Security">
            <div className="grid sm:grid-cols-2 gap-5">
              <Toggle name="admin2FA" checked={formData.admin2FA}
                onChange={handleChange} disabled={settingsLoading} label="Enable 2-Factor Authentication for Admin" />
              <Toggle name="maintenanceMode" checked={formData.maintenanceMode}
                onChange={handleChange} disabled={settingsLoading} label="Enable Maintenance Mode" />
            </div>
          </SectionCard>
        </div>

      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={settingsLoading || saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : (
            <><Save size={15} /> Save Settings</>
          )}
        </button>
      </div>

    </div>
  );
};

export default Settings;
