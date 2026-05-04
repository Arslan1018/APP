'use client';
import { useState } from 'react';

const DEMO_ORDERS = [
  { id: 'ORD-A1B2C', customer: 'John Smith', table: '5', items: ['Fish Ball Soup x1', 'Taiwan Beer x2'], total: 360, status: 'PENDING', time: '2 min ago' },
  { id: 'ORD-D3E4F', customer: 'Maria Chen', table: '3', items: ['Crispy Chips x2', 'Shrimp Dumpling x1'], total: 320, status: 'CONFIRMED', time: '8 min ago' },
  { id: 'ORD-G5H6I', customer: 'David Lee', table: '7', items: ['Seafood Combo x1'], total: 280, status: 'PREPARING', time: '15 min ago' },
  { id: 'ORD-J7K8L', customer: 'Sara Wong', table: '2', items: ['Full Combo x2'], total: 640, status: 'READY', time: '22 min ago' },
  { id: 'ORD-M9N0O', customer: 'Alex Park', table: '9', items: ['Taiwan Beer x3', 'Chips x1'], total: 440, status: 'DELIVERED', time: '45 min ago' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; next?: string; nextLabel?: string }> = {
  PENDING: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100', next: 'CONFIRMED', nextLabel: 'Confirm' },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100', next: 'PREPARING', nextLabel: 'Start Preparing' },
  PREPARING: { label: 'Preparing', color: 'text-purple-700', bg: 'bg-purple-100', next: 'READY', nextLabel: 'Mark Ready' },
  READY: { label: 'Ready', color: 'text-green-700', bg: 'bg-green-100', next: 'DELIVERED', nextLabel: 'Mark Delivered' },
  DELIVERED: { label: 'Delivered', color: 'text-gray-700', bg: 'bg-gray-100' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [filter, setFilter] = useState<string>('ALL');

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const cfg = STATUS_CONFIG[o.status];
        return cfg.next ? { ...o, status: cfg.next } : o;
      })
    );
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage incoming orders in real time</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === s
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            {s === 'ALL' ? 'All Orders' : STATUS_CONFIG[s]?.label}
            {s !== 'ALL' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${order.status === 'PENDING' ? 'ring-2 ring-yellow-400/50' : ''}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-gray-900">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{order.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {order.customer} · Table {order.table}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.join(', ')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">TWD {order.total}</p>
                  {cfg.next && (
                    <button
                      onClick={() => advance(order.id)}
                      className="mt-2 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      {cfg.nextLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No orders in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
