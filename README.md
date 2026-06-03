# 🗑️ BinRoute

**Smart routes. Less waste.**

BinRoute is a smart waste management dashboard for municipal fleet managers — built to optimize bin collection routes, monitor fleet activity, and reduce operational costs through real-time data and intelligent routing.

---

## 🚀 Live Demo: [bin-route.vercel.app](https://bin-route.vercel.app)  

---

## 📸 Features

- **Dashboard** — Real-time overview of active routes, bins collected, fleet status, and daily stats
- **Map View** — Live map tracking of waste collection vehicles across zones
- **Routes Page** — View, manage, and optimize collection routes
- **Analytics** — Charts and insights on collection efficiency, zone performance, and fleet utilization
- **Authentication** — Secure login via Supabase Auth
- **Settings** — User and system configuration

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| React + Vite | Core framework and bundler |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side navigation |
| Supabase JS | Auth & database client |
| Context API | Global auth state management |

---

## 📁 Project Structure

```
BinRoute/
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopNav.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── RoutesPage.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js

```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- Yarn
- Supabase account

### 1. Clone the repo

```bash
git clone https://github.com/AtharvaK-XD/BinRoute.git
cd BinRoute
```

### 2. Setup Frontend

```bash
cd frontend
yarn install
yarn dev
```
---

## 👥 Team

| Role | Name |
|---|---|
| Frontend | [Atharva Kulkarni](https://github.com/AtharvaK-XD) |
| Backend | [Smit Dighe](https://github.com/smitdighe) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
