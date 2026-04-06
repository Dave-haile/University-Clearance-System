# 🎓 University Clearance Management System (Version 2)

A **completely redesigned** full-stack web application that digitizes and streamlines the university clearance process with enhanced user experience, modern UI/UX, and improved functionality. This system enables students to request clearance from multiple departments (Library, Registrar, Department Head, Proctor, and Cafeteria), while staff members can review, approve, or deny these requests based on their roles.

---

## 🚀 Features

- 🔑 **Enhanced role-based login and redirection** with improved authentication flow (Student, Admin, Registrar, Department Head, Library, Proctor, Cafeteria)
- 📝 **Streamlined student clearance request submission** with intuitive form design
- 📊 **Redesigned staff dashboards** with better data visualization and management tools
- ⏱️ **Real-time clearance status tracking** with live updates
- 🔒 **Improved token-based authentication** with enhanced security measures
- 📱 **Completely responsive and modern UI** with better accessibility and user experience

---

## � What's New in Version 2

- 🎨 **Complete UI/UX redesign** with modern design patterns and improved user flow
- 📱 **Enhanced mobile responsiveness** and better cross-device compatibility
- 🔧 **Improved backend architecture** with optimized database queries and API performance
- 🎯 **Better user onboarding** with clearer navigation and instructions
- 🛡️ **Enhanced security measures** and improved authentication system
- 📊 **Advanced dashboard analytics** with better data visualization
- ⚡ **Performance optimizations** for faster load times and smoother interactions

---

## �🛠️ Tech Stack

### Frontend

- ⚛️ **React (TypeScript)**
- 🎨 **Tailwind CSS**
- ⚡ **Vite** (fast development build tool)
- 🧩 **Shadcn/ui** (modern UI components)

### Backend

- 🐘 **Laravel 11**
- 🗄️ **PostgreSQL** (database)
- 🔗 **Axios** (API communication)

---

## 🔐 Roles & Permissions

- **Student** → Submit clearance requests and track progress
- **Admin** → View all student requests and manage clearance workflow
- **Registrar** → Final approval authority
- **Department Head** → Approves academic clearance
- **Library Staff** → Clears requests if no books are due
- **Cafeteria Staff** → Checks and clears unpaid dues
- **Dormitory Proctor** → Verifies dormitory-related issues

---

## 📷 Landing Page Overview

- **Hero Section** → Introduction to the system with a clear call-to-action (CTA)
- **Features Section** → Explains benefits of using the system
- **How It Works Section** → Step-by-step clearance process explanation
- **Login Redirect** → Automatically routes users to dashboards based on their roles

---

## 📦 Installation Guide

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/University-clearance-system.git
cd University-clearance-system
```

### 2. Setup the Frontend (React + Vite)

Open a new terminal and run:

```bash
cd front
npm install
npm run dev
```

👉 The frontend will be available at: `http://localhost:5173`

### 3. Setup the Backend (Laravel 11 + PostgreSQL)

In another separate terminal, run:

```bash
cd back
composer install
```

Copy environment file and configure database:

```bash
cp .env.example .env
```

Edit `.env` and update these lines with your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clearance_db
DB_USERNAME=your_pg_username
DB_PASSWORD=your_pg_password
```

Then run the following commands:

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed

# Start backend server
php artisan serve
```

👉 The backend will be available at: `http://localhost:8000`
👉 The frontend will be available at: `http://localhost:5173`

🌐 **Live Demo**: View the live application at [https://university-clearance-system.vercel.app](https://university-clearance-system.vercel.app)

# Login as Admin using

username "admin@university.com"
password "adminpass"

# Create any user by going to the Users tab

✅ Quick Test
Run both frontend and backend servers.

Open the frontend in your browser → http://localhost:5173

Login with a test user (from seeded database if available).

Explore role-based dashboards:

# Landing Page

![Landing-Page](docs/images/Screenshot%202026-04-06%20115732.png)

# Admin Dashboard

![Admin-Dashboard-1](docs/images/Screenshot%202026-04-06%20115753.png)
![Admin-Dashboard-2](docs/images/Screenshot%202026-04-06%20115805.png)
![Admin-Dashboard-3](docs/images/Screenshot%202026-04-06%20115813.png)
![Admin-Dashboard-4](docs/images/Screenshot%202026-04-06%20115819.png)
![Admin-Dashboard-5](docs/images/Screenshot%202026-04-06%20115833.png)

# Student Dashboard

![Student-Dashboard-1](docs/images/Screenshot%202026-04-06%20120532.png)
![Student-Dashboard-2](docs/images/Screenshot%202026-04-06%20120541.png)
![Student-Dashboard-2](docs/images/Screenshot%202026-04-06%20120547.png)
![Student-Dashboard-2](docs/images/Screenshot%202026-04-06%20120559.png)

# Department Head Panel

![Department-Head-1](docs/images/Screenshot%202026-04-06%20120331.png)
![Department-Head-2](docs/images/Screenshot%202026-04-06%20120339.png)
![Department-Head-3](docs/images/Screenshot%202026-04-06%20120345.png)

Registrar Panel

![Registrar-1](docs/images/Screenshot%202026-04-06%20130026.png)
![Registrar-2](docs/images/Screenshot%202026-04-06%20130040.png)

Library Panel

![Library-1](docs/images/Screenshot%202026-04-06%20121138.png)
![Library-2](docs/images/Screenshot%202026-04-06%20121146.png)

Proctor Panel

![Proctor-1](docs/images/Screenshot%202026-04-06%20130200.png)
![Proctor-2](docs/images/Screenshot%202026-04-06%20130207.png)

Cafeteria Panel

![Cafeteria-1](docs/images/Screenshot%202026-04-06%20130257.png)
![Cafeteria-2](docs/images/Screenshot%202026-04-06%20130303.png)

👨‍💻 Author
Dawit Haile Sebho
Computer Science Student @ Injibara University
📧 Email: dawit.s.haile@gmail.com
🌐 GitHub: Dave-haile

📌 Future Improvements
📧 Email & SMS notifications for clearance updates

📜 Activity logs for staff actions

📄 Export clearance certificates as PDF

🌍 Multilingual support (Amharic & English)

🔄 Integration with university student information system

� Mobile app development for iOS and Android

�� Acknowledgements
Special thanks to our instructors, mentors, and teammates for their support and valuable feedback throughout the project.

---

This version 2 includes:  
✔️ **Complete UI/UX overhaul** with modern design principles  
✔️ **Enhanced performance** and optimized backend architecture  
✔️ **Improved user experience** with better navigation and workflows  
✔️ **Enhanced security features** and authentication system  
✔️ **Better mobile responsiveness** and cross-device compatibility  
✔️ **Advanced dashboard features** with improved data visualization  
✔️ **Live deployment** at https://university-clearance-system.vercel.app
