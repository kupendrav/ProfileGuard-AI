import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AlertTriangle, ShieldAlert, FileWarning, CheckCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';

const suspensionData = [
  { name: 'Verification', value: 42, color: '#ef4444' },
  { name: 'Name Issues', value: 28, color: '#f97316' },
  { name: 'Reviews', value: 17, color: '#eab308' },
  { name: 'Other', value: 13, color: '#64748b' },
];

const trendData = [
  { name: '2019', suspensions: 4000 },
  { name: '2020', suspensions: 4500 },
  { name: '2021', suspensions: 8000 },
  { name: '2022', suspensions: 18000 },
  { name: '2023', suspensions: 32000 },
  { name: '2024', suspensions: 58000 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Global Suspensions" 
          value="+80%" 
          change="Year over Year Increase" 
          icon={ShieldAlert} 
          color="bg-red-500" 
        />
        <StatsCard 
          title="Fake Profiles Removed" 
          value="20M+" 
          change="In 2022 Alone" 
          icon={FileWarning} 
          color="bg-orange-500" 
        />
        <StatsCard 
          title="Avg. Reinstatement" 
          value="14 Days" 
          change="Without Optimization" 
          icon={AlertTriangle} 
          color="bg-yellow-500" 
        />
        <StatsCard 
          title="ProfileGuard Success" 
          value="94%" 
          change="Recovery Rate" 
          icon={CheckCircle} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspension Reasons Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Suspension Triggers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={suspensionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {suspensionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm mt-4 flex-wrap">
            {suspensionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Suspension Surge (Global)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="suspensions" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Automated enforcement has increased exponentially, catching legitimate businesses in the crossfire.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Protect Your Business Asset</h2>
          <p className="max-w-xl text-brand-100 mb-6">
            Don't let a technicality erase your digital storefront. Use the Compliance Scanner to preemptively fix issues before Google flags them.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
          <ShieldAlert className="w-full h-full -mr-10 -mt-10 transform rotate-12" />
        </div>
      </div>
    </div>
  );
};