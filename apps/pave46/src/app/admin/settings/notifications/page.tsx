'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Phone, Save, Plus, X } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    emailAddresses: [''],
    smsEnabled: false,
    phoneNumbers: [''],
    notifyCatering: true,
    notifyContact: true,
    notifyOrders: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/notifications');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/admin/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const addEmailAddress = () => {
    setSettings({
      ...settings,
      emailAddresses: [...settings.emailAddresses, ''],
    });
  };

  const removeEmailAddress = (index: number) => {
    setSettings({
      ...settings,
      emailAddresses: settings.emailAddresses.filter((_, i) => i !== index),
    });
  };

  const updateEmailAddress = (index: number, value: string) => {
    const newAddresses = [...settings.emailAddresses];
    newAddresses[index] = value;
    setSettings({ ...settings, emailAddresses: newAddresses });
  };

  const addPhoneNumber = () => {
    setSettings({
      ...settings,
      phoneNumbers: [...settings.phoneNumbers, ''],
    });
  };

  const removePhoneNumber = (index: number) => {
    setSettings({
      ...settings,
      phoneNumbers: settings.phoneNumbers.filter((_, i) => i !== index),
    });
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const newNumbers = [...settings.phoneNumbers];
    newNumbers[index] = value;
    setSettings({ ...settings, phoneNumbers: newNumbers });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notification Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Configure how you receive notifications for new inquiries and orders
          </p>
        </div>

        {saveStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">Settings saved successfully!</p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Failed to save settings. Please try again.</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.emailEnabled}
                  onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            </div>

            {settings.emailEnabled && (
              <div className="space-y-3">
                {settings.emailAddresses.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmailAddress(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {settings.emailAddresses.length > 1 && (
                      <button
                        onClick={() => removeEmailAddress(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addEmailAddress}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add another email
                </button>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">SMS Notifications</h2>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.smsEnabled}
                  onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            </div>

            {settings.smsEnabled && (
              <div className="space-y-3">
                {settings.phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => updatePhoneNumber(index, e.target.value)}
                      placeholder="Enter phone number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {settings.phoneNumbers.length > 1 && (
                      <button
                        onClick={() => removePhoneNumber(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addPhoneNumber}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add another phone number
                </button>
              </div>
            )}
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Types</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyCatering}
                  onChange={(e) => setSettings({ ...settings, notifyCatering: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Catering Inquiries</span>
                  <p className="text-sm text-gray-600">Receive notifications for new catering requests</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyContact}
                  onChange={(e) => setSettings({ ...settings, notifyContact: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Contact Form</span>
                  <p className="text-sm text-gray-600">Receive notifications for contact form submissions</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyOrders}
                  onChange={(e) => setSettings({ ...settings, notifyOrders: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Online Orders</span>
                  <p className="text-sm text-gray-600">Receive notifications for new online orders</p>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}