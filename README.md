<p align="center">
  <img src="client/src/assets/logo.svg" alt="Recur Logo" width="120px" />
</p>

<h1 align="center">Recur</h1>

<p align="center">
  A premium, interactive Spaced Repetition & Data Structures and Algorithms (DSA) Practice Tracker. Track solve times, monitor difficulty distribution, and maintain a rigorous history of your programming attempts.
</p>

---

## 📊 Dashboard Preview

<p align="center">
  <img src="client/public/Recur.png" alt="Recur Dashboard" width="100%" style="border-radius: 8px; border: 1px solid #2a2c38;" />
</p>


---

## ✨ Features

- **📊 Comprehensive Stats Dashboard**: Tracks total solved questions grouped by difficulty (Easy, Medium, Hard), showcases distribution using interactive Pie Charts, and calculates your exact average solving duration.
- **⏱️ Integrated Practice Stopwatch**: An in-browser stepper flow equipped with a live stopwatch to measure the precise time spent on each question attempt.
- **📅 Practice & Review History**: Retain complete logs of all past attempts, including solution notes, hint usage, external problem links, and time tags.
- **🔐 Secure Cookie Authentication**: Uses `httpOnly`, cross-site secure cookie verification for production environments, keeping user sessions safe against CSRF and credential theft.
- **🛡️ Production Ready & Robust**: Features password strength rules, strict input validations to combat Stored XSS vulnerabilities, and an API rate limiter to protect against brute-force attacks.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Icons & Visuals**: Lucide React
- **Animations**: Motion (Framer Motion) & custom micro-interactions (e.g., PixelBlast ripples)
- **Charts**: Material UI X-Charts (`@mui/x-charts`)

### Backend & Database
- **Framework**: Node.js & Express (v5)
- **Database**: MongoDB (via Mongoose)
- **Session Management**: JWT + `cookie-parser`
- **Security & Optimization**: `cors`, `bcrypt`, `express-rate-limit`

---

## 🚀 Local Development Setup

To run the Recur application locally, follow these steps:

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

---

### 1. Server Configuration & Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The API server will run on `http://localhost:3000`.

---

### 2. Client Configuration & Setup

1. Open a new terminal tab/window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment Notes

When deploying Recur to a live environment (e.g., frontend on Vercel/Netlify, backend on Render):

1. **CORS Configuration**: Ensure the `CLIENT_URL` environment variable on the server points to your production frontend URL (e.g., `https://your-app.vercel.app`) without a trailing slash.
2. **Cross-Site Cookies**: The backend automatically flags authentication cookies as `secure: true` and `sameSite: "none"` when running in production to ensure proper authentication persistence across different domains.
