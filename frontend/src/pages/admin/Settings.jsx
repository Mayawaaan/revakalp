import React, { useState, useEffect } from "react";
import {
  Store,
  Truck,
  CreditCard,
  Bell,
  Shield,
  Save,
  Loader2,
} from "lucide-react";
import useStore from "../../store/store";

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
    // stripeEnabled: false,
    emailNotifications: true,
    admin2FA: false,
    maintenanceMode: false,
    storeDescription: "",
    phone: "",
    address: "",
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
        razorpayEnabled: settings.razorpayEnabled !== undefined ? settings.razorpayEnabled : false,
        upiEnabled: settings.upiEnabled !== undefined ? settings.upiEnabled : false,
        // stripeEnabled: settings.stripeEnabled !== undefined ? settings.stripeEnabled : false,
        emailNotifications: settings.emailNotifications !== undefined ? settings.emailNotifications : true,
        admin2FA: settings.admin2FA !== undefined ? settings.admin2FA : false,
        maintenanceMode: settings.maintenanceMode !== undefined ? settings.maintenanceMode : false,
        storeDescription: settings.storeDescription || "",
        phone: settings.phone || "",
        address: settings.address || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      showToast("Settings saved successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save settings",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage global store configuration and preferences
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage global store configuration and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Store Settings */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Store className="text-gray-700" />
            <h2 className="text-lg font-semibold">Store Settings</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Store Name"
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Email
            </label>
            <input
              name="supportEmail"
              type="email"
              value={formData.supportEmail}
              onChange={handleChange}
              placeholder="Support Email"
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Description
            </label>
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              placeholder="Store description"
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              disabled={settingsLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contact phone"
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Store address"
              className="w-full border rounded-md px-3 py-2"
              rows={2}
              disabled={settingsLoading}
            />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Truck className="text-gray-700" />
            <h2 className="text-lg font-semibold">Shipping</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Shipping Threshold
            </label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={formData.freeShippingThreshold}
              onChange={handleChange}
              placeholder="Free shipping above"
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Orders above this amount qualify for free shipping
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Fee
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleChange}
              placeholder="Default delivery fee"
              className="w-full border rounded-md px-3 py-2"
              disabled={settingsLoading}
            />
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <CreditCard className="text-gray-700" />
            <h2 className="text-lg font-semibold">Payments</h2>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="codEnabled"
              checked={formData.codEnabled}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable Cash on Delivery
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="razorpayEnabled"
              checked={formData.razorpayEnabled}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable Razorpay Payments
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="upiEnabled"
              checked={formData.upiEnabled}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable UPI Payments
          </label>

          {/* <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="stripeEnabled"
              checked={formData.stripeEnabled}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable Stripe Payments
          </label> */}
        </div>

        {/* Notifications */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Bell className="text-gray-700" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Email alerts for new orders
          </label>
        </div>

        {/* Security */}
        <div className="bg-white border rounded-xl p-6 space-y-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Shield className="text-gray-700" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="admin2FA"
              checked={formData.admin2FA}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable 2-Factor Authentication for Admin
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
              disabled={settingsLoading}
            />
            Enable Maintenance Mode
          </label>
        </div>

      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={settingsLoading || saving}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default Settings;
