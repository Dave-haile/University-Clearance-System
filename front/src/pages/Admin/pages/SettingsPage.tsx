
import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Lock,
  Save,
  RotateCcw,
  Database,
  Smartphone,
  Mail,
  Monitor,
  Cpu,
  Cloud,
  AlertTriangle,
  Loader2,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';
import { useToast } from '../hooks/Toast';

type SettingsTab = 'general' | 'academic' | 'security' | 'notifications' | 'system';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({
        type: 'success',
        title: 'Settings Synchronized',
        message: 'Platform preferences have been updated successfully.'
      });
    }, 1500);
  };

  const handleColdSync = () => {
    addToast({
      type: 'warning',
      title: 'Initializing Cold Sync',
      message: 'This may temporarily impact registry responsiveness.',
      duration: 3000
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'academic', label: 'Academic', icon: Calendar },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'system', label: 'System', icon: Cpu },
  ];

  const SectionHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-8">
      <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{description}</p>
    </div>
  );

  const Toggle = ({ enabled, label, description }: { enabled: boolean; label: string; description?: string }) => {
    const [isOn, setIsOn] = useState(enabled);
    return (
      <div className="flex items-center justify-between py-4">
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
          {description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
        </div>
        <button
          onClick={() => setIsOn(!isOn)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isOn ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">System Configuration</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">Manage institutional policies, security protocols, and platform behavior.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { }}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2.5 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-black shadow-xl shadow-slate-200 dark:shadow-none hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 min-w-[160px] justify-center"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Preferences</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 border-2 ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}

          <div className="mt-10 p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Storage Status</p>
              <h4 className="text-lg font-black tracking-tight">84.2 GB Used</h4>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-indigo-500 rounded-full w-[65%]" />
            </div>
            <p className="text-[10px] text-white/40 font-medium relative z-10">Auto-backup synchronized: 12 mins ago</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm p-10 lg:p-14 min-h-[600px] transition-all">

            {activeTab === 'general' && (
              <div className="space-y-12 animate-fade-in">
                <SectionHeader
                  title="Platform Experience"
                  description="Customize the fundamental visual and structural behavior of the administrative interface."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Alias</label>
                    <div className="relative">
                      <Monitor className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="AdminPro Console"
                        defaultValue="AdminPro University Dashboard"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Regional Locale</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer">
                        <option>English (United States)</option>
                        <option>Amharic (Ethiopia)</option>
                        <option>French (International)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 dark:border-slate-800 space-y-4">
                  <Toggle enabled={true} label="Maintenance Mode" description="Temporarily restrict access to students while performing system updates." />
                  <Toggle enabled={false} label="Live Analytics Stream" description="Enable real-time WebSocket connection for dashboard telemetry." />
                  <Toggle enabled={true} label="Dark Mode Priority" description="Automatically toggle interface based on OS preferences." />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-12 animate-fade-in">
                <SectionHeader
                  title="Academic Lifecycle"
                  description="Control the clearance windows and institutional periods."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Year</label>
                    <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none">
                      <option>2024/2025</option>
                      <option>2023/2024</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester Phase</label>
                    <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none">
                      <option>First Semester</option>
                      <option>Second Semester</option>
                      <option>Summer Term</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance Window</label>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                      <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Open</button>
                      <button className="flex-1 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest">Closed</button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-amber-50 dark:bg-amber-950/20 rounded-[32px] border border-amber-100 dark:border-amber-900/40 flex items-start gap-5">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-amber-900 dark:text-amber-200">Institutional Transition Warning</p>
                    <p className="text-xs text-amber-700/70 dark:text-amber-400/70 font-medium leading-relaxed">
                      Changing the active academic year will archive current clearance queues. Ensure all departments have finalized their vetting processes before committing.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                  <Toggle enabled={true} label="Auto-Archive Cycle" description="Automatically archive requests 30 days after the semester concludes." />
                  <Toggle enabled={false} label="Cross-Departmental Vetting" description="Allow students to bypass certain department approvals based on major." />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12 animate-fade-in">
                <SectionHeader
                  title="Security Architecture"
                  description="Hardened protocols for institutional data protection and identity management."
                />

                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Multi-Factor Authentication</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Enforced for Admin Roles</p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90">Configure</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Password Policy
                      </h4>
                      <div className="space-y-3">
                        <Toggle enabled={true} label="Complex Strings" />
                        <Toggle enabled={true} label="Expiry (90 Days)" />
                      </div>
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap className="w-3 h-3" /> API Access
                      </h4>
                      <div className="space-y-3">
                        <Toggle enabled={false} label="Public Registry API" />
                        <Toggle enabled={true} label="Bearer Tokens" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Session Inactivity Timeout</p>
                      <p className="text-xs text-slate-400 font-medium">Automatic sign-out for idle administrative sessions.</p>
                    </div>
                    <select className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-12 animate-fade-in">
                <SectionHeader
                  title="Communication Matrix"
                  description="Manage automated alerting across various institutional channels."
                />

                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Mail className="w-5 h-5" />
                      <h4 className="text-sm font-black uppercase tracking-widest">Email Alert Configuration</h4>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <Toggle enabled={true} label="New Submission Alert" description="Notify department heads on student clearance requests." />
                      <Toggle enabled={true} label="Decision Notification" description="Notify students when their status is updated." />
                      <Toggle enabled={false} label="Weekly Operations Digest" description="Summary report of clearance throughput." />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 space-y-4">
                    <div className="flex items-center gap-3 text-violet-600">
                      <Layers className="w-5 h-5" />
                      <h4 className="text-sm font-black uppercase tracking-widest">System Broadcasts</h4>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <Toggle enabled={true} label="Platform Downtime Alerts" description="Global banner for scheduled maintenance." />
                      <Toggle enabled={true} label="Deadlines Approaching" description="Reminder for students 7 days before cycle closure." />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-12 animate-fade-in">
                <SectionHeader
                  title="Core Infrastructure"
                  description="Low-level system maintenance and diagnostic controls."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Database className="w-24 h-24" /></div>
                    <h4 className="text-lg font-black tracking-tight">Registry Backup</h4>
                    <p className="text-xs text-white/50 font-medium">Capture a full snapshot of all institutional clearance data.</p>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Execute Backup Now</button>
                  </div>
                  <div className="p-8 bg-indigo-600 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Cloud className="w-24 h-24" /></div>
                    <h4 className="text-lg font-black tracking-tight">Sync Engine</h4>
                    <p className="text-xs text-white/50 font-medium">Re-index departmental relationships and record integrity.</p>
                    <button
                      onClick={handleColdSync}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                    >
                      Initialize Cold Sync
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-2xl text-rose-500 border border-rose-100 dark:border-rose-900/30">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">System Factory Reset</p>
                      <p className="text-xs text-slate-400 font-medium">Wipe all non-academic configuration and restore defaults.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast({ type: 'error', title: 'Action Restricted', message: 'Registry wipes must be authorized by the Institutional Board.' })}
                    className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 dark:shadow-none"
                  >
                    Reset Cluster
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
