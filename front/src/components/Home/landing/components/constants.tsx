import React from 'react';
import {
  ShieldCheck,
  Clock,
  FileText,
  Bell,
  Smartphone,
  Lock,
  UserCircle,
  CheckCircle,
  BookOpen,
  Coffee,
  Home,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { FeatureItem, NavLink, ProcessStep, UserRole } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: 'home' },
  { name: 'Features', href: 'features' },
  { name: 'Process', href: 'process' },
  { name: 'How It Works', href: 'how-it-works' },
];

export const FEATURES: FeatureItem[] = [
  {
    id: 1,
    title: 'Role-Based Access',
    description: 'Customized interfaces and permissions for students, staff, and administrators.',
    icon: 'ShieldCheck',
  },
  {
    id: 2,
    title: 'Real-Time Updates',
    description: 'Instantly track the status of your clearance requests as they move through departments.',
    icon: 'Clock',
  },
  {
    id: 3,
    title: 'Fully Paperless',
    description: 'Eliminate physical forms and long queues with a digital-first clearance process.',
    icon: 'FileText',
  },
  {
    id: 4,
    title: 'Instant Notifications',
    description: 'Receive email and in-app alerts whenever your status is updated or requires action.',
    icon: 'Bell',
  },
  {
    id: 5,
    title: 'Mobile First',
    description: 'Manage your clearance on the go with our fully responsive mobile design.',
    icon: 'Smartphone',
  },
  {
    id: 6,
    title: 'Secure & Auditable',
    description: 'Full history of approvals with secure timestamps and digital signatures.',
    icon: 'Lock',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Submit Request',
    description: 'Student initiates clearance from their personalized dashboard.',
  },
  {
    id: 2,
    title: 'Department Review',
    description: 'Academic departments verify student standing and equipment returns.',
  },
  {
    id: 3,
    title: 'Campus Units',
    description: 'Library, proctor, and cafeteria confirm no outstanding balances.',
  },
  {
    id: 4,
    title: 'Final Approval',
    description: 'Registrar reviews the consolidated dossier for final sign-off.',
  },
  {
    id: 5,
    title: 'Done!',
    description: 'Students receive their digital certificate instantly.',
  },
];

/* Added missing admin role to satisfy Record<UserRole, ...> constraint */
export const ROLE_CONFIG: Record<UserRole, { label: string; path: string; color: string }> = {
  student: {
    label: 'Go to Student Dashboard',
    path: '/student',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  department_head: {
    label: 'Go to Department Panel',
    path: '/staff/department_head',
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  library_staff: {
    label: 'Go to Library Panel',
    path: '/staff/library_staff',
    color: 'bg-emerald-600 hover:bg-emerald-700',
  },
  registrar: {
    label: 'Go to Registrar Panel',
    path: '/staff/registrar',
    color: 'bg-indigo-600 hover:bg-indigo-700',
  },
  proctor: {
    label: 'Go to Dorm Proctor Panel',
    path: '/staff/proctor',
    color: 'bg-orange-600 hover:bg-orange-700',
  },
  cafeteria: {
    label: 'Go to Cafeteria Panel',
    path: '/staff/cafeteria',
    color: 'bg-rose-600 hover:bg-rose-700',
  },
  admin: {
    label: 'Go to Admin Dashboard',
    path: '/admin',
    color: 'bg-slate-800 hover:bg-slate-900',
  },
};

export const IconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Clock,
  FileText,
  Bell,
  Smartphone,
  Lock,
  UserCircle,
  CheckCircle,
  BookOpen,
  Coffee,
  Home,
  ChevronRight,
  ClipboardList
};
