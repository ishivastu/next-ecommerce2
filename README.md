# 🛒 Full-Stack E-Commerce & Inventory Management Platform

A robust, production-grade e-commerce application built with **Next.js, Node.js, MongoDB, and Redis**. Features complete cart workflows, end-to-end transactional security, role-based admin controls, and seamless payment integration.

🔗 **Live Deployment:** [View Live Application](https://next-ecommerce2-alpha.vercel.app/)
📂 **Source Code:** [GitHub Repository](YOUR_GITHUB_REPOSITORY_URL)

---

## 🔐 Demo Credentials

You can use the following test account to explore the live application:

| Field        | Test Account     |
| ------------ | ---------------- |
| **Email**    | `test@gmail.com` |
| **Password** | `123456`         |

> **Note:** These credentials are for the public demo account and are intended only for testing the application.

---

## 🚀 Key Features

### 🔐 Authentication & Security

* **Dual-Token System:** Secure authentication flow using short-lived JWT access tokens and Redis-backed refresh tokens.
* **Granular Role-Based Access Control (RBAC):** Distinct route guards for authenticated shoppers versus system administrators.
* **Data Privacy:** HttpOnly cookie management and strict server-side validation to help protect against XSS and injection attacks.

### 🛍️ Core E-Commerce Engine

* **Dynamic Product Catalog:** Filter products by category, ratings, and price with optimized pagination.
* **High-Performance Caching:** High-traffic product catalog queries and session tokens are cached in Redis to improve response times.
* **State Management & Cart:** Persistent cart management and real-time state synchronization powered by Zustand.

### 💳 Transaction Processing & Payments

* **Payment Gateway Integration:** Direct payment flows with Razorpay, with modular support for Stripe.
* **Webhook Architecture:** Resilient webhook listener with cryptographic signature verification for reliable order processing and transaction logging in MongoDB.

### 👑 Admin Management Dashboard

* **Inventory Control:** Complete CRUD operations for products, categories, and inventory counts.
* **Media Pipelines:** Image uploads processed through Multer and stored on Cloudinary.
* **Order & Revenue Tracking:** Visibility into customer purchases, transaction statuses, and sales metrics.

### 🎨 UI & Design

* Modern, responsive interface styled with **Tailwind CSS**.
* Loading skeletons and asynchronous spinners.
* Toast notifications for user feedback.
* Responsive experience across mobile and desktop devices.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS
* Zustand
* Lucide Icons

### Backend

* Node.js
* Express.js
* RESTful API

### Database & Caching

* MongoDB
* Mongoose ODM
* Redis
* Upstash / Redis Cloud

### Payments

* Razorpay API
* Razorpay Webhooks
* Stripe

### Media & Cloud

* Cloudinary
* Multer

### Deployment

* Vercel
* Render / Railway

---

## 🏗️ Application Architecture

```text
                         ┌─────────────────────┐
                         │       Customer      │
                         │     Web Browser     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express / Node    │
                         │      REST API       │
                         └──────┬──────┬───────┘
                                │      │
                    ┌───────────┘      └────────────┐
                    ▼                               ▼
             ┌──────────────┐                ┌──────────────┐
             │   MongoDB    │                │    Redis     │
             │  Database    │                │    Cache     │
             └──────────────┘                └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Razorpay /  │
             │    Stripe    │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Cloudinary  │
             │    Media     │
             └──────────────┘
```

---

## 🔐 Authentication Flow

The application uses a dual-token authentication architecture:

```text
User Login
    │
    ▼
Next.js Frontend
    │
    ▼
Express Authentication API
    │
    ├──────────────► JWT Access Token
    │
    └──────────────► Redis Refresh Token
                         │
                         ▼
                    Secure Storage
```

Access tokens are short-lived, while refresh tokens allow sessions to remain authenticated without requiring users to log in repeatedly.

HttpOnly cookies are used to help prevent client-side JavaScript from accessing authentication tokens.

---

## 🛒 Shopping Flow

```text
Browse Products
       │
       ▼
Filter / Search
       │
       ▼
Product Details
       │
       ▼
Add to Cart
       │
       ▼
Review Cart
       │
       ▼
Checkout
       │
       ▼
Razorpay / Stripe
       │
       ▼
Payment Verification
       │
       ▼
Webhook
       │
       ▼
MongoDB Order
```

---

## 💳 Payment & Webhook Architecture

Payment processing is integrated with Razorpay, with modular support for Stripe.

The webhook architecture allows the backend to verify payment events before updating order status.

```text
Customer
   │
   ▼
Checkout
   │
   ▼
Payment Gateway
   │
   ▼
Payment Completed
   │
   ▼
Webhook
   │
   ▼
Signature Verification
   │
   ▼
Order Update
   │
   ▼
MongoDB
```

Webhook signatures are verified server-side before processing payment events.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

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
```

### Environment Variable Description

| Variable                  | Purpose                               |
| ------------------------- | ------------------------------------- |
| `PORT`                    | Backend server port                   |
| `NODE_ENV`                | Application environment               |
| `CLIENT_URL`              | Frontend URL used for CORS            |
| `MONGO_URI`               | MongoDB connection string             |
| `REDIS_URL`               | Redis connection URL                  |
| `JWT_ACCESS_SECRET`       | Secret used for access tokens         |
| `JWT_REFRESH_SECRET`      | Secret used for refresh tokens        |
| `RAZORPAY_KEY_ID`         | Razorpay public key                   |
| `RAZORPAY_KEY_SECRET`     | Razorpay server secret                |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification secret |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name                 |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                    |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret                 |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB
* Redis
* Cloudinary account
* Razorpay account
* Git

### Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Navigate to the Project

```bash
cd your-project-folder
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env` and add the required credentials shown above.

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🌐 Deployment

The frontend can be deployed using **Vercel**, while the backend can be deployed using services such as **Render** or **Railway**.

Make sure all production environment variables are configured in the deployment platform.

### Current Deployment

**Live Application:**
https://next-ecommerce2-alpha.vercel.app/

---

## 🔒 Security

The application follows several security practices:

* JWT-based authentication
* Refresh-token architecture
* HttpOnly cookies
* Server-side authentication checks
* Role-based authorization
* Password hashing
* Server-side request validation
* Payment webhook signature verification
* Environment-based secret management
* Redis-backed session/token management

> Never commit `.env` files or production API credentials to GitHub.

---

## 👑 Admin Features

Authorized administrators can manage:

* Products
* Categories
* Inventory
* Product images
* Orders
* Customer purchases
* Sales information

Admin routes are protected using role-based authorization.

---

## 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

Tailwind CSS is used for responsive layouts and UI components.

---

## 🔮 Future Improvements

Potential improvements include:

* Product reviews and ratings
* Wishlist functionality
* Advanced product search
* Coupon and discount system
* Email order notifications
* Advanced sales analytics
* Multiple payment methods
* Product recommendation system
* Order tracking
* Customer support/chat
* AI-powered product recommendations

---

## 👨‍💻 Author

**Shivastu Mishra**

Information Technology Student & Full-Stack Developer

GitHub: [@ishivastu](https://github.com/ishivastu)

---

## 📄 License

This project is available for educational and portfolio purposes.

Add an appropriate open-source license if you intend to distribute the project publicly.

---

⭐ If you found this project interesting, consider giving the repository a star!
