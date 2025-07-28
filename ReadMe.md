# 🎓 University Clearance Management System

A full-stack web application built to digitize the manual clearance process in universities. This system enables students to request clearance from various departments (Library, Registrar, Department Head, Proctor, and Cafeteria), while staff members can review and process these requests based on their roles.

---

## 🚀 Features

- Role-based login and redirection (Student, Department Head, Registrar, Library, Proctor, Cafeteria)
- Student clearance request submission
- Staff dashboard to approve/deny requests
- Track clearance status in real-time
- Token-based authentication with protected routes
- Responsive and accessible UI

---

## 🛠️ Tech Stack

### Frontend
- **React** (with TypeScript)
- **Tailwind CSS**
- **Vite** for fast development
- **Shadcn/ui** for component styling

### Backend
- **Laravel 11**
- **Inertia.js** (for future compatibility)
- **PostgreSQL** as database
- **Axios** for API communication

---

## 🔐 Roles & Permissions

- **Student:** Can submit clearance requests and track progress.
- **Registrar:** Can view all student requests and close clearance.
- **Department Head:** Approves academic clearance.
- **Library Staff:** Clears if no books are due.
- **Cafeteria Staff:** Checks for unpaid dues.
- **Dormitory Proctor:** Verifies dorm-related issues.

---

## 📷 Landing Page Overview

- **Hero Section:** Introduction to the system with a CTA.
- **Features Section:** Explains why this system is beneficial.
- **How It Works:** Shows the step-by-step process.
- **Login Redirect:** Users are redirected to dashboards based on their roles after login.

---

## 📦 Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/YourUsername/clearance-system.git
cd clearance-system