# 🚀 LeaveEase Enterprise HRMS - Deployment Guide

This guide provides step-by-step instructions to deploy the **LeaveEase MERN Stack** application to production using **Vercel** (Frontend) and **Render / Railway** (Backend with MongoDB Atlas).

---

## 1. 🗄️ Database Setup (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so your production cloud server can connect.
4. Copy your MongoDB Atlas connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_leave_db?retryWrites=true&w=majority
   ```

---

## 2. 🖥️ Backend Deployment (Render / Railway)

### Option A: Deploy on Render
1. Sign up on [Render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository `https://github.com/bhanukotanagachaitanya/LeaveEase`.
3. Set the following parameters:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *Your Secure Random Secret Key*
   - `CLIENT_URL`: `https://your-leaveease-app.vercel.app` *(Your Vercel URL)*
5. Click **Create Web Service**. Your API will be live at `https://<your-render-app>.onrender.com`.

---

## 3. 🌐 Frontend Deployment (Vercel)

1. Sign up on [Vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository `bhanukotanagachaitanya/LeaveEase`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (or `client`)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://<your-render-app>.onrender.com/api`
5. Click **Deploy**. Vercel will build and publish your application!

---

## 📋 Pre-Configured Files Included in Repository

- **Root `.gitignore`**: Excludes `node_modules`, `.env`, `dist`, logs.
- **Client `.gitignore`**: Excludes Vite build outputs and secrets.
- **Server `.gitignore`**: Excludes server dependencies and secrets.
- **Root `vercel.json`**: Vercel SPA rewrite routing rules.
- **Server `Procfile`**: Node.js web process execution command.
- **Server `render.yaml`**: Infrastructure-as-code configuration for Render.
- **Server `config/seed.js`**: Database seed script for default Administrator (`ADM001` / `admin@company.com` / `Admin@123`).

---

## 🔑 Default Production Administrator Credentials
- **Portal Sign In**: `https://<your-leaveease-app>.vercel.app/login`
- **Administrator ID**: `ADM001`
- **Email**: `admin@company.com`
- **Password**: `Admin@123`
