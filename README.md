# Votexa - Decentralized E-Voting System

🚀 **Live Demo**: [https://evoting-system-td9m.vercel.app/](https://evoting-system-td9m.vercel.app/)

Votexa is a next-generation decentralized e-voting system designed to deliver secure, tamper-proof, and real-time ballot casting. Equipped with dual-factor OTP authentication, sleek glassmorphic aesthetics, and live audit ledger streams, it ensures maximum transparency and cryptographic voter integrity for modern digital elections.

---

## 🚀 Key Features

- **🔒 Dual-Factor Verification**: Two-step authentication sending high-security numeric OTPs directly to user emails.
- **👤 Digital Voter Passport**: Personalized voter card rendering custom uploaded voter photos or dynamic humanoid avatars (Dicebear API).
- **💼 Admin Management Suite**: Comprehensive panel to schedule election dates/times, register candidates with Manifestos, Mottos, and Party Symbols (URL/File base64 uploads).
- **📊 Live Decrypt Standings**: Interactive results dashboard rendering voter turnout statistics and live leaderboards (Chart.js).
- **💬 Interactive Feedback Loop**: Post-vote modal questionnaires allowing voters to instantly rate their voting experience and display reviews on the landing page.
- **🎨 Premium Cyber-Theme**: Sleek translucent glassmorphism panels, glowing typography, and animated vector backgrounds.

---

## 🛠️ Technology Stack

### Frontend

- **React (Vite)**: Component-driven fast interface.
- **Vanilla CSS**: High-performance cyber grid and keyframe animations.
- **Chart.js**: Interactive voter share charts.
- **Axios**: Promise-based HTTP client.
- **React Hot Toast**: Beautiful micro-notifications.

### Backend

- **Node.js & Express**: Secure REST APIs.
- **MongoDB & Mongoose**: Fast document database modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Nodemailer**: Email verification engine.
- **Bcrypt**: Cryptographic password hashing.

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Instance (Local or Atlas)

### 1. Backend Configuration

1.  Navigate to the `/server` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `/server` and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    ```
4.  Start the backend:
    ```bash
    npm run dev
    ```

### 2. Frontend Configuration

1.  Navigate to the `/client` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm run dev
    ```

---

## 📦 How to Push to GitHub

Follow these commands to push the repository to your GitHub account:

1.  **Initialize Git** in the project root folder:
    ```bash
    git init
    ```
2.  **Create a `.gitignore`** to exclude credentials (`node_modules/`, `.env`):
    ```bash
    node_modules/
    .env
    dist/
    ```
3.  **Stage all project files**:
    ```bash
    git add .
    ```
4.  **Create your initial commit**:
    ```bash
    git commit -m "feat: complete Votexa decentralized voting system"
    ```
5.  **Link your GitHub repository** (replace `<username>` with your GitHub name):
    ```bash
    git branch -M main
    git remote add origin https://github.com/Pavani-1804/Evoting-System
    ```
6.  **Push to GitHub**:
    ```bash
    git push -u origin main
    ```
