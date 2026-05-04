'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Placeholder stats for demo
const demoStats = {
  totalScans: 1284,
  scansLast7Days: 247,
  scansLast30Days: 892,
  totalOrders: 341,
  ordersLast30Days: 128,
  totalRevenue: 45320,
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your AR menu.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total QR Scans', value: demoStats.totalScans.toLocaleString(), sub: `+${demoStats.scansLast7Days} this week`, icon: '👁️', color: 'bg-blue-50 text-blue-700' },
          { label: 'Orders (30d)', value: demoStats.ordersLast30Days.toLocaleString(), sub: `${demoStats.totalOrders} total`, icon: '🛒', color: 'bg-green-50 text-green-700' },
          { label: 'Revenue', value: `TWD ${demoStats.totalRevenue.toLocaleString()}`, sub: 'All time', icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'AR Views (30d)', value: demoStats.scansLast30Days.toLocaleString(), sub: 'From QR codes', icon: '✨', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex px-2 py-1 rounded-lg text-lg mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/items/new', icon: '➕', title: 'Add Menu Item', desc: 'Add a new dish with 3D model', color: 'bg-brand-500' },
            { href: '/dashboard/qr-codes', icon: '🔲', title: 'Generate QR Codes', desc: 'Create QR codes for your items', color: 'bg-indigo-500' },
            { href: '/dashboard/orders', icon: '📋', title: 'View Orders', desc: 'Check incoming orders', color: 'bg-green-500' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-xl`}>
                {action.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{action.title}</p>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-brand-500 hover:text-brand-700">View all →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Order</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Items</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: 'ORD-A1B2C', items: 'Fish Ball Soup, Beer', total: 'TWD 320', status: 'CONFIRMED', statusColor: 'bg-green-100 text-green-700' },
                { id: 'ORD-D3E4F', items: 'Chips & Dip', total: 'TWD 180', status: 'PENDING', statusColor: 'bg-yellow-100 text-yellow-700' },
                { id: 'ORD-G5H6I', items: 'Full Combo x2', total: 'TWD 640', status: 'PREPARING', statusColor: 'bg-blue-100 text-blue-700' },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-4 text-gray-600">{order.items}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{order.total}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
