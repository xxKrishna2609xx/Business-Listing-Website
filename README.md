# Right Ads Digital - Business Listing Website

A premium, modern, and responsive local business listing directory website (similar to Justdial) built with a React/Vite frontend and a FastAPI/MongoDB backend server.

---

## 🏗️ Architecture Overview

The application consists of three main components:
1. **Frontend (Vite + React)**: Beautifully designed portal running on `http://localhost:5173`. Uses Tailwind CSS for styles, Framer Motion for micro-animations, and Axios to communicate with the REST API.
2. **Backend (FastAPI)**: High-performance Python backend server running on `http://localhost:8000`. Handles authentication, business listings, categories, leads, and admin operations.
3. **Database (MongoDB)**: Local database engine running on `mongodb://localhost:27017` storing users, categories, subcategories, approved/pending listings, and quote requests.

---

## 🚀 Quick Start Guide

Follow these steps to get both servers up and running on your local machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) (v3.8+)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`)

---

### 1. Backend Server Setup (`http://localhost:8000`)

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   # Windows (Command Prompt)
   python -m venv venv
   venv\Scripts\activate

   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify that the local MongoDB server is running, and start the FastAPI server:
   ```bash
   python run.py
   ```
   *Note: On the first launch, the server will automatically seed all 19 categories, subcategories, businesses, and the default admin user account into your local MongoDB database.*

---

### 2. Frontend Server Setup (`http://localhost:5173`)

1. Open a new terminal window and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔐 Default Credentials

### Admin Portal
* **Email**: `admin@rightads.digital`
* **Password**: `Admin@123`
* **Role**: Admin

*To access the Admin panel, sign in using the credentials above and click "Admin Panel" inside the user profile dropdown in the top navigation bar.*

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── auth/          # Password hashing and JWT generation
│   │   ├── models/        # Pydantic data schemas
│   │   ├── routers/       # API route handlers
│   │   ├── config.py      # App configurations (.env loader)
│   │   ├── database.py    # MongoDB (Motor) connection initialization
│   │   ├── main.py        # FastAPI app creation & CORS setup
│   │   └── seed.py        # Database seeding scripts
│   ├── requirements.txt   # Python dependency list
│   └── run.py             # Server entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI elements, layout, and forms
│   │   ├── context/       # Auth state context manager
│   │   ├── pages/         # Public search, details, dashboard, and admin views
│   │   ├── services/      # Axios API modules to talk to the backend
│   │   └── App.jsx        # Routing configuration
│   ├── package.json       # Node package manager configuration
│   └── vite.config.js     # Vite configuration
```
