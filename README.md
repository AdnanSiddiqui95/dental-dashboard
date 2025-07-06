# 🦷 Dental Center Management Dashboard

This is a **frontend-only** Dental Center Management Dashboard developed as part of the **ENTNT Technical Assignment** for the role of **Frontend Developer (React)**.

> 🔗 **Live Demo**: [Click Here to View the App](https://adnansiddiqui95.github.io/dental-dashboard/#/login)

## 👤 Login Credentials

### 🧑‍⚕️ Admin (Dentist)
- **Email:** `admin@entnt.in`
- **Password:** `admin123`

### 🧑‍⚕️ Patient
- **Email:** `john@entnt.in`
- **Password:** `patient123`

---

## 📋 Project Overview

The application manages dental patients, appointments (incidents), and treatment records. It is a **fully simulated** dashboard using `localStorage`, **React functional components**, and **TailwindCSS**.

### 👨‍⚕️ Admin Features
- View/Add/Edit/Delete Patients
- Manage Appointments
- Upload Treatment Files (PDFs, X-rays, etc.)
- View Treatments
- See Calendar View of Appointments
- Dashboard KPIs

### 👩‍⚕️ Patient Features
- Book Appointments
- View Own Appointments (History & Upcoming)
- View Uploaded Files and Treatment Info

---

## 🧪 Tech Stack

- ⚛️ **React** (Functional Components)
- 🧭 **React Router v6**
- 💾 **localStorage** for data simulation
- 🎨 **TailwindCSS** for styling
- 📦 **Vite** as the build tool

---

## 🗃️ Folder Structure

```bash
src/
│
├── components/        # Shared UI components like Navbar, Layout
├── context/           # AuthContext for login/session management
├── data/              # localStorage helpers
├── pages/             # Route-based pages
├── routes/            # ProtectedRoute for auth/role check
├── App.jsx            # Main routing setup
└── main.jsx           # App root
