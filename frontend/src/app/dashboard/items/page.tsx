'use client';
import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  hasAR: boolean;
  imageUrl?: string;
  scanCount?: number;
}

const DEMO_ITEMS: MenuItem[] = [
  { id: '1', name: 'Fish Ball Soup', price: 120, category: 'MAIN_COURSE', isAvailable: true, hasAR: true, scanCount: 342 },
  { id: '2', name: 'Crispy Chips', price: 80, category: 'SIDE', isAvailable: true, hasAR: true, scanCount: 218 },
  { id: '3', name: 'Taiwan Beer', price: 120, category: 'BEVERAGE', isAvailable: true, hasAR: false, scanCount: 0 },
  { id: '4', name: 'Seafood Combo', price: 280, category: 'SPECIAL', isAvailable: false, hasAR: true, scanCount: 156 },
];

export default function ItemsPage() {
  const [items, setItems] = useState<MenuItem[]>(DEMO_ITEMS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-500 mt-1">Manage your dishes and AR models</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-all hover:scale-105"
        >
          <span>+</span> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
      </div>

      {/* Items grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-5xl">
              {item.category === 'BEVERAGE' ? '🍺' : item.category === 'SIDE' ? '🍟' : '🍲'}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-400">{item.category.replace('_', ' ')}</span>
                </div>
                <span className="text-lg font-bold text-brand-600">TWD {item.price}</span>
              </div>

              {/* AR badge */}
              <div className="flex items-center gap-2 mb-3">
                {item.hasAR ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    ✨ AR Model
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                    No AR Model
                  </span>
                )}
                {item.scanCount !== undefined && item.scanCount > 0 && (
                  <span className="text-xs text-gray-400">👁 {item.scanCount} scans</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
                </button>
                <button className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors">
                  Edit
                </button>
                <button className="px-3 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs font-medium transition-colors">
                  QR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Add New Item</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="e.g. Fish Ball Soup" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (TWD) *</label>
                  <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white">
                    <option>MAIN_COURSE</option>
                    <option>APPETIZER</option>
                    <option>DESSERT</option>
                    <option>BEVERAGE</option>
                    <option>SIDE</option>
                    <option>SPECIAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none" placeholder="Describe this dish..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3D Model (GLB)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer">
                  <p className="text-2xl mb-1">🧊</p>
                  <p className="text-sm text-gray-500">Upload .glb or .gltf file</p>
                  <p className="text-xs text-gray-400 mt-1">Max 50MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors">
                Create Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
