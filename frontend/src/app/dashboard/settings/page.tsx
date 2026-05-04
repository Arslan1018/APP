'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    restaurantName: 'My Restaurant',
    description: 'The best food in town',
    address: '123 Main Street',
    city: 'Taipei',
    phone: '+886 2 1234 5678',
    email: 'info@restaurant.com',
    currency: 'TWD',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your restaurant profile and preferences</p>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Restaurant Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
            <input
              value={form.restaurantName}
              onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="TWD">TWD — Taiwan Dollar</option>
                <option value="USD">USD — US Dollar</option>
                <option value="JPY">JPY — Japanese Yen</option>
                <option value="PKR">PKR — Pakistani Rupee</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Logo upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Branding</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-3xl flex-shrink-0">
            🍽️
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Restaurant Logo</p>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Upload Logo
            </button>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <h2 className="font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">Permanently delete your restaurant and all associated data.</p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
          Delete Restaurant
        </button>
      </div>

      <button
        onClick={handleSave}
        className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
          saved ? 'bg-green-500 scale-95' : 'bg-brand-500 hover:bg-brand-600 hover:scale-[1.02]'
        }`}
      >
        {saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
