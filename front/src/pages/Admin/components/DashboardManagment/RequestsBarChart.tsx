import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Totals, DepartmentStat, MonthStat } from '../../../../types/dashboard';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#F59E0B', '#10B981', '#14B8A6', '#0EA5E9'];

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);
  return isDark;
};

export const RequestsBarChart: React.FC<{ data?: Totals }> = ({ data }) => {
  const isDark = useIsDarkMode();
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  const chartData = [
    { name: 'Approved', value: data?.approved || 0, fill: '#10B981' },
    { name: 'Pending', value: data?.pending || 0, fill: '#F59E0B' },
    { name: 'Rejected', value: data?.rejected || 0, fill: '#EF4444' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-all hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exit Velocity</h2>
        <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded tracking-tighter uppercase">Clearance Volume</span>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: textColor }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: textColor }} />
            <Tooltip 
              cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', radius: 12 }}
              contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} 
            />
            <Bar dataKey="value" radius={[10, 10, 4, 4]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DepartmentPieChart: React.FC<{ data?: DepartmentStat[] }> = ({ data }) => {
  const isDark = useIsDarkMode();
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-all hover:border-violet-500/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit Mapping</h2>
        <span className="text-[9px] font-black text-violet-500 bg-violet-50 px-2 py-0.5 rounded tracking-tighter uppercase">Active Depts</span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={8}
              dataKey="total"
              nameKey="department"
              stroke="none"
            >
              {data?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: '9px',
                fontWeight: 800,
                paddingTop: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: '1.4',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MonthlyTrendsChart: React.FC<{ data?: MonthStat[] }> = ({ data }) => {
  const isDark = useIsDarkMode();
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  const formattedData = data?.map(d => ({
    ...d,
    monthName: new Date(d.month).toLocaleString('default', { month: 'short' })
  }));

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-all hover:border-indigo-500/20">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Cycle Trends</h2>
          <p className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Monthly Clearance Throughput</p>
        </div>
        <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <button className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">6 Months</button>
          <button className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">12 Months</button>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={isDark ? 0.4 : 0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: textColor }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: textColor }} />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
