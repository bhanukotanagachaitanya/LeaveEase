# LeaveEase (LE) - Employee Leave Management System

**LeaveEase (LE)** is an enterprise-grade, production-quality Employee Leave Management System developed with the **MERN Stack** (**MongoDB**, **Express.js**, **React.js**, **Node.js**).

---

## 🔥 Key Enhancements & Modules

### 1. Application Branding
- Rebranded throughout to **LeaveEase** (Short Logo: **LE**).
- Updated titles, headers, navigation sidebar, login portal, and system notifications.

### 2. Clean Security & Authentication
- **No Demo Fill Buttons**: Completely removed development/demo auto-fills and hardcoded credentials.
- **Login Identifier**: Log in using **Employee ID** or **Full Name** alongside Password.
- **Secure Password Audit Log**: All password changes log Employee Name, Employee ID, Date/Time, IP Address, and `changedBy` ('Self' / 'Admin'). Old/new passwords are **NEVER** stored unhashed or exposed in plain text.
- **Forgot Password Workflow**: Multi-step verification via Employee ID & Security Question.

### 3. Administrator Employee Management
- **Public Sign-up Disabled**: Employee creation is strictly managed by Administrators.
- **Admin Features**:
  - Add New Employee
  - Edit Employee Details
  - Activate / Deactivate Accounts
  - Reset Employee Password
  - Delete Employee Record
  - View Password Audit Logs

### 4. Holiday Management Module
- Admin capabilities to declare, edit, and delete company holidays (Holiday Name, Occasion, Description, Date, Type).
- **Employee Portal**:
  - "Today is a Holiday!" announcement banner.
  - Upcoming holidays list widget & calendar integration.
  - Automated notice on leave application for declared holidays.

### 5. Notification Center
- Real-time Bell dropdown drawer in the top Navbar.
- Notifications generated for holiday announcements, leave approvals/rejections, password changes, and account provisioning.

---

## 📁 Project Architecture

```
employee-leave-management-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Sidebar, Navbar, NotificationDropdown, StatCard, Modal, Toast, LoadingSpinner
│   │   │   └── leave/          # LeaveStatusBadge, LeaveActionModal
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # MainLayout, AuthLayout
│   │   ├── pages/              # Login, Register, ForgotPassword, EmployeeDashboard, ApplyLeave, LeaveHistory, EmployeeProfile, HolidayManagement, AdminDashboard, AllLeaveRequests, AllEmployees, PasswordAuditLogs, Reports
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/           # api, authService, leaveService, adminService, holidayService, notificationService
│   │   ├── utils/              # dateUtils, validators
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── server/
│   ├── config/                 # db.js, seed.js
│   ├── controllers/            # authController, employeeController, leaveController, adminController, holidayController, notificationController
│   ├── middleware/             # authMiddleware, adminMiddleware, validationMiddleware, errorMiddleware
│   ├── models/                 # User.js, LeaveRequest.js, Holiday.js, Notification.js, PasswordAudit.js
│   ├── routes/                 # authRoutes, employeeRoutes, leaveRoutes, adminRoutes, holidayRoutes, notificationRoutes
│   ├── utils/                  # generateToken, responseHandler
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── Employee_Leave_Management.postman_collection.json
└── README.md
```

---

## 🔑 Default Initial Credentials

Run `npm run seed` inside `server/` to reset initial database records:

| Role | Employee ID | Name | Password | Security Answer |
|---|---|---|---|---|
| **Administrator** | `ADM001` | System Administrator | `Admin@123` | `9999` |
| **Employee 1** | `EMP101` | John Doe | `Password123` | `eng` |
| **Employee 2** | `EMP102` | Jane Smith | `Password123` | `boston` |
| **Employee 3** | `EMP103` | Alex Johnson | `Password123` | `1234` |

---

## 🌐 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection URI: `mongodb+srv://<username>:<password>@cluster.mongodb.net/leaveease_db?retryWrites=true&w=majority`.

### 2. Backend (Render)
1. Create a Web Service on [Render](https://render.com/).
2. Connect your Git repository (Root Directory: `server`).
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Secure Random Secret Key>`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://your-client.vercel.app`
   - `NODE_ENV`: `production`

### 3. Frontend (Vercel)
1. Create a project on [Vercel](https://vercel.com/).
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`

---

## 🚀 How to Run Locally

### Backend Server
```bash
cd server
npm install
npm run seed
npm run dev
# Server listening on http://localhost:5000
```

### Frontend Application
```bash
cd client
npm install
npm run dev
# Client app accessible on http://localhost:3000
```
