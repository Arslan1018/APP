'use client';
import { useState } from 'react';

const DEMO_QR = [
  { id: '1', itemName: 'Fish Ball Soup', code: 'abc-123', scans: 342, generated: '2026-04-20', active: true },
  { id: '2', itemName: 'Crispy Chips', code: 'def-456', scans: 218, generated: '2026-04-20', active: true },
  { id: '3', itemName: 'Seafood Combo', code: 'ghi-789', scans: 156, generated: '2026-04-18', active: true },
  { id: '4', itemName: 'Taiwan Beer', code: 'jkl-012', scans: 89, generated: '2026-04-15', active: false },
];

export default function QRCodesPage() {
  const [qrCodes] = useState(DEMO_QR);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">QR Codes</h1>
          <p className="text-gray-500 mt-1">Generate and manage QR codes for your AR menu items</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p className="text-sm font-medium text-brand-800">How to use QR codes</p>
          <p className="text-sm text-brand-700 mt-0.5">
            Print these QR codes on your physical menus, table cards, or posters. When customers scan them,
            they'll see your dish in augmented reality on their phone!
          </p>
        </div>
      </div>

      {/* QR list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All QR Codes</h2>
          <span className="text-sm text-gray-400">{qrCodes.length} codes</span>
        </div>
        <div className="divide-y divide-gray-50">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              {/* QR visual placeholder */}
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-mono text-center leading-tight p-1">
                QR
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{qr.itemName}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">/ar/{qr.code}</p>
              </div>

              <div className="text-center hidden sm:block">
                <p className="text-lg font-bold text-gray-900">{qr.scans}</p>
                <p className="text-xs text-gray-400">scans</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-medium hidden sm:block ${
                qr.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {qr.active ? 'Active' : 'Inactive'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(qr.id)}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Download
                </button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Scans', value: qrCodes.reduce((s, q) => s + q.scans, 0).toLocaleString(), icon: '👁️' },
          { label: 'Active Codes', value: qrCodes.filter((q) => q.active).length, icon: '✅' },
          { label: 'Items with AR', value: qrCodes.length, icon: '✨' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
