# 🛒 Full-Stack E-Commerce & Inventory Management Platform

A robust, production-grade e-commerce application built with Next.js, Node.js, MongoDB, and Redis. Features complete cart workflows, end-to-end transactional security, role-based admin controls, and seamless payment integration.

🔗 **Live Deployment:** [View Live Application](https://next-ecommerce2-alpha.vercel.app/)  
📂 **Source Code:** [GitHub Repository]()

---

## 🚀 Key Features

### 🔐 Authentication & Security
* **Dual-Token System:** Secure authentication flow using short-lived JWT access tokens and Redis-backed refresh tokens.
* **Granular Role-Based Access Control (RBAC):** Distinct route guards for authenticated shoppers versus system administrators.
* **Data Privacy:** HttpOnly cookie management and strict server-side validation to guard against XSS and injection attacks.

### 🛍️ Core E-Commerce Engine
* **Dynamic Product Catalog:** Filter products by category, ratings, and price with optimized pagination.
* **High-Performance Caching:** High-traffic product catalog queries and session tokens are cached in Redis to maintain sub-second latency.
* **State Management & Cart:** Persistent cart management and real-time state synchronization powered by Zustand.

### 💳 Transaction Processing & Payments
* **Payment Gateway Integration:** Direct payment flows with Razorpay (and modular support for Stripe).
* **Webhook Architecture:** Resilient webhook listener with cryptographic signature verification to ensure accurate order logging in MongoDB with zero data loss.

### 👑 Admin Management Dashboard
* **Inventory Control:** Complete CRUD operations for products, categories, and inventory counts.
* **Media Pipelines:** Image uploads processed through Multer and stored on Cloudinary.
* **Order & Revenue Tracking:** Real-time visibility into customer purchases, transaction statuses, and sales metrics.

### 🎨 UI & Design
* Modern, responsive interface styled with **Tailwind CSS**.
* Built-in loading skeletons, asynchronous spinners, and toast alerts for an optimal user experience across mobile and desktop.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React.js, Tailwind CSS, Zustand, Lucide Icons
* **Backend:** Node.js, Express.js, RESTful API
* **Database & Caching:** MongoDB (Mongoose ODM), Redis (Upstash / Redis Cloud)
* **Payments:** Razorpay API & Webhooks, Stripe
* **Media & Cloud:** Cloudinary, Multer
* **Deployment:** Vercel (Frontend), Render / Railway (Backend)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database & Caching
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_url

# Authentication Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Razorpay / Stripe Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
