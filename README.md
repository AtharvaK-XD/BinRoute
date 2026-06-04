<div align="center">

```
      ██████╗ ██╗███╗   ██╗██████╗  ██████╗ ██╗   ██╗████████╗███████╗
      ██╔══██╗██║████╗  ██║██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝
      ██████╔╝██║██╔██╗ ██║██████╔╝██║   ██║██║   ██║   ██║   █████╗  
      ██╔══██╗██║██║╚██╗██║██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  
      ██████╔╝██║██║ ╚████║██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗
      ╚═════╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝
```

</div>

<div align = "center">

### 🗑️ Smart routes. Less waste.

**BinRoute** is a smart waste management dashboard for municipal fleet managers — built to optimize bin collection routes, monitor fleet activity, and reduce operational costs through real-time data and intelligent routing.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-bin--route.vercel.app-22c55e?style=for-the-badge)](https://bin-route.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<br/>

[![BinRoute Demo](https://img.youtube.com/vi/N4vcWH7ZHKA/maxresdefault.jpg)](https://www.youtube.com/watch?v=N4vcWH7ZHKA)

</div>

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="200">
      <h3>📊</h3>
      <b>Dashboard</b><br/>
      <sub>Real-time overview of active routes, bins collected, fleet status, and daily stats</sub>
    </td>
    <td align="center" width="200">
      <h3>🗺️</h3>
      <b>Map View</b><br/>
      <sub>Live map tracking of waste collection vehicles across all city zones</sub>
    </td>
    <td align="center" width="200">
      <h3>🛣️</h3>
      <b>Routes Page</b><br/>
      <sub>View, manage, and optimize collection routes with one click</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="200">
      <h3>📈</h3>
      <b>Analytics</b><br/>
      <sub>Charts and insights on collection efficiency, zone performance & fleet utilization</sub>
    </td>
    <td align="center" width="200">
      <h3>🔐</h3>
      <b>Authentication</b><br/>
      <sub>Secure login and user management powered by Supabase Auth</sub>
    </td>
    <td align="center" width="200">
      <h3>⚙️</h3>
      <b>Settings</b><br/>
      <sub>User preferences and system-level configuration options</sub>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| ⚛️ Framework | React + Vite | Core UI framework and lightning-fast bundler |
| 🎨 Styling | Tailwind CSS | Utility-first, responsive design system |
| 🔀 Routing | React Router | Seamless client-side navigation |
| 🗄️ Backend | Node.js + Express | Auth, database, and real-time subscriptions |
| 🌐 State | Context API | Global auth and app state management |

---

## 📁 Project Structure

```
BinRoute/
|
├── frontend/
│   ├── src/
│   │   ├── assets/              # Static assets (icons, images)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   └── TopNav.jsx       # Top navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── data/
│   │   │   └── mockData.js      # Mock fleet & route data
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main overview page
│   │   │   ├── MapView.jsx      # Live vehicle map
│   │   │   ├── RoutesPage.jsx   # Route management
│   │   │   ├── Analytics.jsx    # Charts & insights
│   │   │   ├── Login.jsx        # Auth screen
│   │   │   └── Settings.jsx     # User settings
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
|
├── backend/
│   ├── routes/
│   │   ├── bins.js              # GET /bins, POST /bins/:id/update
│   │   ├── trucks.js            # GET /trucks
│   │   └── optimize.js          # POST /optimize → returns routes
│   ├── db/
│   │   └── supabase.js          # supabase client setup
|   ├── middleware/
│   │   └──errorHandler.js       # global error handling
│   ├── index.js                 # entry point, app.listen()
│   └── package-lock.json
│   └── package.json
|
├── .gitignore
└── README.md

```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- ![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)
- ![Yarn](https://img.shields.io/badge/Yarn-latest-2C8EBB?style=flat-square&logo=yarn&logoColor=white)
- A [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/AtharvaK-XD/BinRoute.git
cd BinRoute
```

### 2. Install Dependencies & Run

```bash
cd frontend
yarn install
yarn dev
```

> The app will be running at `http://localhost:5173`

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AtharvaK-XD">
        <img src="https://github.com/AtharvaK-XD.png" width="80px" style="border-radius:50%" alt="Atharva"/><br/>
        <sub><b>Atharva Kulkarni</b></sub>
      </a><br/>
      <sub>Frontend</sub>
    </td>
    <td align="center">
      <a href="https://github.com/smitdighe">
        <img src="https://github.com/smitdighe.png" width="80px" style="border-radius:50%" alt="Smit"/><br/>
        <sub><b>Smit Dighe</b></sub>
      </a><br/>
      <sub>Backend</sub>
    </td>
  </tr>
</table>

---

## 🔗 Links

| Resource | Link |
|:---------|:-----|
| 🌐 Live Demo | [bin-route.vercel.app](https://bin-route.vercel.app) |
| 📺 YouTube Demo | [Watch on YouTube](https://www.youtube.com/watch?v=N4vcWH7ZHKA) |
| 💻 GitHub | [AtharvaK-XD/BinRoute](https://github.com/AtharvaK-XD/BinRoute) |

---

<div align="center">

Made with 💚 by [Atharva Kulkarni](https://github.com/AtharvaK-XD) & [Smit Dighe](https://github.com/smitdighe)

<sub>If you found this useful, give it a ⭐ on GitHub!</sub>

</div>
