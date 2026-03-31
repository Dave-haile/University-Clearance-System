import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  LifeBuoy,
  ChevronRight,
  Zap,
  Shield,
  Users,
  FileCheck,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      count: 12,
      description:
        "Learn the fundamentals of AdminPro and clearance workflows.",
    },
    {
      title: "User Management",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      count: 8,
      description: "Handling student enrollments and staff operational roles.",
    },
    {
      title: "Clearance Logic",
      icon: FileCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      count: 15,
      description: "Deep dive into the vetting steps and institutional phases.",
    },
    {
      title: "Structural Matrix",
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      count: 6,
      description:
        "Configuring colleges, units, and departmental relationships.",
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      count: 10,
      description: "Protocols for data integrity and identity verification.",
    },
    {
      title: "Resources",
      icon: BookOpen,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/40",
      count: 20,
      description: "Downloadable guides and institutional policy artifacts.",
    },
  ];

  const faqs = [
    {
      question:
        "How do I initiate a global archive for the current academic cycle?",
      answer:
        "To perform a global archive, navigate to the 'Clearance Requests' page and select the 'Archive Cycle' button in the header. Note that this requires Super Admin privileges and will transition all current vetting queues into historical read-only modes.",
    },
    {
      question:
        "What happens if a department head rejects a clearance request?",
      answer:
        "A rejection immediately halts the workflow. The student is notified via the platform alert system. The staff member must provide a reason for rejection which appears in the student's audit trail. After resolving the issue, the student must re-initiate the request.",
    },
    {
      question: "Can I customize the order of the clearance steps?",
      answer:
        "Yes, clearance steps can be reconfigured within the System Settings > Academic Lifecycle tab. However, institutional policy typically mandates a 'Department Head -> Library -> Registrar' sequence for legal compliance.",
    },
    {
      question: "How do I recover student credentials if they lose access?",
      answer:
        "Navigate to the User Management page, search for the student, enter their profile detail, and use the 'Reset Credentials' action. This will rotate their password and provide you with a temporary secret to relay securely.",
    },
  ];

  return (
    <div className="max-w-[1320px] mx-auto space-y-10 animate-fade-in pb-16">
      {/* Hero Header Section */}
      <div className="relative rounded-[36px] overflow-hidden bg-slate-900 dark:bg-slate-900 min-h-[340px] flex items-center justify-center p-6">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-violet-600/30 pointer-events-none" />

        {/* Floating circles for aesthetic */}
        <div className="absolute top-1/4 left-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-8 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 text-center max-w-xl space-y-7">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-white/5">
              <LifeBuoy className="w-3.5 h-3.5" /> Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              How can we assist?
            </h1>
            <p className="text-slate-400 font-medium text-base">
              Search the comprehensive guide to clearance operations and
              management.
            </p>
          </div>

          <div className="relative group max-w-lg mx-auto">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Query documents, FAQs, or workflows..."
              className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[24px] text-sm text-white placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Support Clusters
          </h2>
          <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1.5">
            Explore All Artifacts <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-7 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all group cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-[18px] ${cat.bg} ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                    {cat.title}
                  </h3>
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md uppercase">
                    {cat.count} Guides
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs Accordion */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight px-1 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-indigo-600" /> Operational FAQ
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 pr-6 leading-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-180 bg-indigo-50 text-indigo-600" : ""}`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? "max-h-96" : "max-h-0"}`}
                >
                  <div className="px-6 pb-6 pt-1">
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-7 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-7">
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Direct Support
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                Available MON-FRI / 9AM-5PM
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none transition-transform group-hover:scale-105">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none">
                    Live Console Chat
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Typical response: 2 mins
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none transition-transform group-hover:scale-105">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none">
                    Institutional Ticketing
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Support@university.edu
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shadow-inner transition-transform group-hover:scale-105">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none">
                    Crisis Hotline
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    +251 112 345 678
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95">
              Initialize Remote Sync
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-7 rounded-[28px] text-white space-y-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
              <Zap className="w-24 h-24" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">
                Update Version 2.4.0
              </p>
              <h4 className="text-lg font-black tracking-tight leading-tight">
                Read the latest Release Protocols
              </h4>
            </div>
            <p className="text-[11px] text-white/60 font-medium relative z-10 leading-relaxed">
              Discover improved filtering logic for college affiliations and
              optimized database query speeds.
            </p>
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg border border-white/10 transition-all relative z-10">
              Read Manifesto <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
