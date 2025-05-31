# NodeTalk – Real‑Time Chat + AI Collaboration Platform

> **NodeTalk** is a MERN‑stack web app that lets teams chat in real time, share code snippets (via WebContainers), and summon an AI assistant (`@ai`) powered by Google Generative AI. I built it to scratch my own itch for a lightweight "Slack × ChatGPT" experience that can be self‑hosted or deployed free on Render.

---

## ✨ Features

| Category             | Highlights                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Real‑time chat**   | Socket.IO rooms scoped to a _Project ID_ ; instant message broadcast ; online/offline events |
| **AI assistant**     | Mention `@ai` in any room to get code, docs, or brainstorming replies from Google Gen‑AI     |
| **Auth & security**  | JWT‑based login, hashed passwords (bcrypt), Redis session layer, CORS‑guarded API            |
| **Persistence**      | MongoDB Atlas for users, projects & chat history                                             |
| **Web IDE**          | In‑browser code execution via `@webcontainer/api` for quick code demos                       |
| **Modern UI**        | React 19 + Vite + Tailwind CSS ; dark theme ; responsive                                     |
| **One‑click deploy** | Separate **Static Site** (frontend) & **Web Service** (backend) blueprints for Render        |

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Redux Toolkit, Socket.IO‑client, WebContainers
- **Backend**: Node 22, Express 5, Socket.IO 4, MongoDB Atlas, Mongoose 8, Redis Cloud, Google Generative AI SDK
- **Deployment**: Render (Static Site + Web Service), GitHub Actions (optional CI)

---

## 📁 Folder Structure (monorepo)

```text
realtimechatai/
├─ backend/          # Node + Express API & Socket.IO server
│  ├─ server.js      # HTTP + WebSocket bootstrap
│  ├─ app.js         # Express config & routes
│  ├─ routes/        # REST endpoints (users, projects, ai)
│  ├─ services/      # AI, Redis, DB helpers
│  ├─ models/        # Mongoose schemas
│  └─ package.json
└─ frontend/         # React + Vite SPA
   ├─ src/
   ├─ vite.config.js
   └─ package.json
```

---

## 🚀 Quick Start (local)

> Requires **Node ≥ 20**, **npm** or **pnpm**, and local **MongoDB** & **Redis** – or connection strings to cloud services.


---

## ☁️ Deploy to Render

### 1 – Backend Web Service

| Field         | Value                                                   |
| ------------- | ------------------------------------------------------- |
| **Root Dir**  | `backend`                                               |
| **Build Cmd** | `npm install`                                           |
| **Start Cmd** | `node server.js`                                        |
| **Env Vars**  | Same as `/backend/.env` (except `PORT`, Render sets it) |

### 2 – Frontend Static Site

| Field           | Value                                         |
| --------------- | --------------------------------------------- |
| **Root Dir**    | `frontend`                                    |
| **Build Cmd**   | `npm install && npm run build`                |
| **Publish Dir** | `dist`                                        |
| **Env Var**     | `VITE_API_URL=https://<backend>.onrender.com` |

### 3 – Rewrite Rule (SPA routing)

`Source: /*` → `Destination: /index.html` → **Action: Rewrite**

Full deployment guide is in `/docs/render.md` (or check the wiki).

---

## 🧪 API Overview

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| POST   | `/users/register` | Register new user               |
| POST   | `/users/login`    | Login & receive JWT             |
| GET    | `/projects/:id`   | Get project details             |
| POST   | `/projects`       | Create project                  |
| POST   | `/ai`             | Forward prompt to AI (internal) |
| WS     | `socket.io`       | Real‑time messaging             |



---

## 📜 License

This project is licensed under the **MIT License** — see `LICENSE` for details.

---

## 🙌 Acknowledgements

- [Socket.IO](https://socket.io/)
- [Google Generative AI](https://developers.generativeai.google/)
- [WebContainers](https://webcontainers.io/)
- [Render](https://render.com/) – hassle‑free hosting

> _Built by **Md Masoom** with ❤️ and a lot of coffee._
