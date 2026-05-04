'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from 'recharts';

const dailyData = [
  { date: 'Apr 5', scans: 28 }, { date: 'Apr 8', scans: 45 },
  { date: 'Apr 11', scans: 38 }, { date: 'Apr 14', scans: 72 },
  { date: 'Apr 17', scans: 55 }, { date: 'Apr 20', scans: 90 },
  { date: 'Apr 23', scans: 67 }, { date: 'Apr 26', scans: 110 },
  { date: 'Apr 29', scans: 95 }, { date: 'May 2', scans: 130 },
];

const topItems = [
  { name: 'Fish Ball Soup', scans: 342 },
  { name: 'Crispy Chips', scans: 218 },
  { name: 'Seafood Combo', scans: 156 },
  { name: 'Taiwan Beer', scans: 89 },
  { name: 'Shrimp Dumpling', scans: 67 },
];

const deviceData = [
  { name: 'Mobile', value: 84, color: '#f97316' },
  { name: 'Desktop', value: 12, color: '#6366f1' },
  { name: 'Tablet', value: 4, color: '#22c55e' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track your AR menu performance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: '1,284', change: '+18%', up: true },
          { label: 'Conversion Rate', value: '26.6%', change: '+3.2%', up: true },
          { label: 'Avg Order Value', value: 'TWD 286', change: '+TWD 22', up: true },
          { label: 'AR Sessions', value: '1,071', change: '-2%', up: false },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">{k.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
            <p className={`text-xs font-medium mt-1 ${k.up ? 'text-green-600' : 'text-red-500'}`}>
              {k.up ? '↑' : '↓'} {k.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Scan trend */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-6">QR Scan Trend (30 days)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="scans" stroke="#f97316" strokeWidth={2.5} fill="url(#scanGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top items */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-6">Top Items by Scans</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="scans" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-6">Device Breakdown</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {deviceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {deviceData.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-sm text-gray-700">{d.name}</span>
                  <span className="text-sm font-bold text-gray-900 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            84% of scans come from mobile — AR is mobile-first! 📱
          </p>
        </div>
      </div>
    </div>
  );
}
