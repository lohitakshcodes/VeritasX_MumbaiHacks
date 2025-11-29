# 🚀 Deployment Guide for Veritas X

Since I cannot access your personal accounts, follow these simple steps to deploy your app for free!

## Part 1: Backend Deployment (Render)
*We'll use Render's free tier to host the Python API.*

1.  **Sign Up/Login**: Go to [render.com](https://render.com/) and log in with GitHub.
2.  **New Web Service**: Click "New +" -> "Web Service".
3.  **Connect Repo**: Select your repository: `VeritasX_MumbaiHacks`.
4.  **Configure**:
    *   **Name**: `veritas-x-backend` (or similar)
    *   **Region**: Singapore (closest to India) or any default.
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
    *   **Root Directory**: `.` (leave empty or set to root)
5.  **Create**: Click "Create Web Service".
6.  **Wait**: It will take a few minutes. Once live, copy the **URL** (e.g., `https://veritas-x-backend.onrender.com`).
    *   *Note: The first request might be slow as the free tier spins down after inactivity.*

---

## Part 2: Frontend Deployment (Vercel)
*We'll use Vercel to host the React frontend.*

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repo**: Select `VeritasX_MumbaiHacks`.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: Click "Edit" and select `frontend`. **(Important!)**
    *   **Environment Variables**:
        *   Key: `VITE_API_URL`
        *   Value: *Paste your Render Backend URL here* (e.g., `https://veritas-x-backend.onrender.com`)
        *   *Note: No trailing slash is best, but usually fine.*
5.  **Deploy**: Click "Deploy".
6.  **Success**: Vercel will build and deploy your site. You'll get a live URL (e.g., `https://veritas-x-frontend.vercel.app`).

---

## 🎉 You're Live!
Share the **Vercel URL** with the judges.

### Troubleshooting
*   **Backend Error?** Check Render logs. Ensure `requirements.txt` is installed.
*   **Frontend Error?** Check Vercel logs. Ensure `Root Directory` was set to `frontend`.
*   **API Connection Failed?** Ensure the `VITE_API_URL` in Vercel matches your active Render URL.
