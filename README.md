# EcoCollect - Municipal Waste Collection Management Platform

EcoCollect is a software-only MVP built for municipal waste management. It provides citizens with an easy portal to submit waste collection requests with dynamic disposal guidance, track collection status in real time with unique tracking codes (e.g. `EC-1001`), and view previous request history. It empowers municipal administrators with a civic dashboard featuring real-time statistics, waste category breakdowns, filtering capabilities, and direct status updates.

---

## Problem Statement

Citizens often struggle to determine how to dispose of specific waste streams (such as E-Waste or Hazardous materials) and lack a simple, transparent channel to request municipal doorstep pickups. Conversely, collection authorities require a streamlined system to aggregate requests, monitor logistics status, and prevent hazardous items from entering general landfills.

## Solution

EcoCollect delivers a restrained, professional civic portal connecting citizens and municipal waste operations:
- **Citizen Guidance & Booking**: Instant category guidance (Organic, Recyclable, General, E-Waste, Hazardous) and rapid request booking.
- **Transparent Tracking**: Automated sequence IDs (`EC-1001`) with real-time visual workflow steppers (`Submitted` → `Assigned` → `Collected` / `Cancelled`).
- **Admin Command Center**: Real-time stats counters, category breakdown metrics, search/filter table, and single-click status updates.

---

## Features

- **Civic Design System**: Minimalist, professional palette (off-white, dark slate, muted green) built to municipal standards.
- **Dynamic Waste Guidance**: Short disposal rules displayed instantly upon selecting a waste category.
- **Form Validation**: Strict validation for citizen contact details, pickup address, and preferred time windows.
- **Real-Time Request Tracker**: Interactive stepper component highlighting current pickup status.
- **Local History Persistence**: Citizen history saved locally on device with instant sync to backend state.
- **Admin Filtering & Search**: Filter requests by category and status, search by ID, name, phone, or address.
- **Database Flexibility**: SQLAlchemy engine supporting **Supabase PostgreSQL** out of the box with zero-config fallback to **SQLite** for offline development.
- **Cloud Run Ready**: Containerized multi-stage Docker build ready for immediate Google Cloud Run deployment.

---

## Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, React Router DOM
- **Backend**: FastAPI, Pydantic, Uvicorn, SQLAlchemy
- **Database**: Supabase PostgreSQL / SQLite
- **Deployment**: Docker, Google Cloud Run

---

## Application Workflow

1. **Request Submission**:
   Citizen selects waste category → Views disposal guide → Fills out pickup details → Receives unique ID `EC-1001`.
2. **Database Storage**:
   Backend validates input, generates next sequential `EC-xxxx` code, and persists record in database.
3. **Logistics Management**:
   Municipal Admin opens `/admin`, views new `Pending` request in statistics and table, and updates status to `Assigned` or `Collected`.
4. **Citizen Verification**:
   Citizen inputs `EC-1001` in `/track` or checks `/my-requests` to see live status reflecting `Collected`.

---

## Project Structure

```text
ecocollect/
├── Dockerfile                  # Multi-stage Docker container build
├── README.md                   # Project documentation
├── .env.example                # Root environment template
├── backend/
│   ├── .env.example            # Backend environment template
│   ├── requirements.txt        # Python dependencies
│   └── app/
│       ├── __init__.py
│       ├── config.py           # Environment and app configuration
│       ├── database.py         # SQLAlchemy engine and session setup
│       ├── models.py           # Database models (WasteRequest)
│       ├── schemas.py          # Pydantic request/response schemas
│       ├── crud.py             # CRUD operations & sequence generator
│       └── main.py             # FastAPI routes & static file hosting
└── frontend/
    ├── package.json            # Node.js dependencies
    ├── vite.config.js          # Vite build & proxy settings
    ├── index.html              # HTML entry point
    └── src/
        ├── App.jsx             # Main application router
        ├── main.jsx            # React root mount
        ├── index.css           # Civic design system styles
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── StatusBadge.jsx
        │   └── RequestDetailsModal.jsx
        ├── data/
        │   └── wasteCategories.js # Category descriptions & guidelines
        ├── services/
        │   └── api.js          # API service client & local storage
        └── pages/
            ├── HomePage.jsx
            ├── RequestPickupPage.jsx
            ├── TrackingPage.jsx
            ├── MyRequestsPage.jsx
            └── AdminDashboardPage.jsx
```

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy Connection string (SQLite or PostgreSQL) | `sqlite:///./ecocollect.db` |
| `SUPABASE_URL` | Supabase project URL (Optional) | `""` |
| `SUPABASE_KEY` | Supabase Anon Key (Optional) | `""` |
| `PORT` | HTTP Server Port | `8000` |
| `ENV` | Environment mode (`development` / `production`) | `development` |

---

## Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
Frontend application will launch at `http://localhost:5173`.

---

## Core Feature Routes & API Mapping

| Feature | Frontend Component / URL | FastAPI Backend Endpoint | Description |
| :--- | :--- | :--- | :--- |
| ♻️ **Waste Category Selection** | `/request` (`RequestPickupPage.jsx`) | `GET /api/categories` | Select from Organic, Recyclable, General, E-Waste, or Hazardous with dynamic disposal guidelines |
| 📍 **Pickup Location** | `GoogleMapView.jsx` component | Included in `POST /api/requests` payload (`address`) | Embedded Google Maps view pinpointing Pune street addresses & sectors |
| 📝 **Pickup Request** | `/request` (`RequestPickupPage.jsx`) | `POST /api/requests` | Submit citizen details, category, Pune address & description |
| 📅 **Pickup Scheduling** | `/request` (`RequestPickupPage.jsx`) | Included in `POST /api/requests` payload | Select preferred date and time slot (`09:00 AM - 12:00 PM`, `01:00 PM - 04:00 PM`) |
| 🔄 **Request Status** | `/track` (`TrackingPage.jsx`) | `GET /api/requests/{id}` & `PATCH /api/requests/{id}/status` | Interactive stepper tracking progress (`Submitted` → `Assigned` → `Collected` / `Cancelled`) |
| 👨‍💼 **Admin Dashboard** | `/admin` (`AdminDashboardPage.jsx`) | `GET /api/requests` | Central municipal management dashboard with live statistics & request table |
| 📊 **Collection Statistics** | `/admin` (`AdminDashboardPage.jsx`) | `GET /api/stats` | Real-time counters (Total, Pending, Assigned, Collected, Cancelled) & category breakdown |
| 🔎 **Request Search & Filtering** | `/admin` (`AdminDashboardPage.jsx`) | `GET /api/requests?search=...&category=...&status=...` | Live multi-field search (ID, name, phone, address) with dropdown filters |
| 📋 **Pickup History** | `/my-requests` (`MyRequestsPage.jsx`) | `GET /api/requests` | Citizen request history stored locally with real-time status updates from backend |

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint & system status |
| `GET` | `/api/categories` | Returns waste categories and disposal guidance |
| `POST` | `/api/requests` | Create a new waste pickup request |
| `GET` | `/api/requests` | List all requests (Supports `search`, `category`, `status` parameters) |
| `GET` | `/api/requests/{id_or_code}` | Fetch single request by ID or tracking code (e.g. `EC-1001`) |
| `PATCH` | `/api/requests/{id_or_code}/status` | Update status (`Pending`, `Assigned`, `Collected`, `Cancelled`) |
| `GET` | `/api/stats` | Fetch dashboard stats counters & category breakdown |

---

## Google Cloud Run Deployment

1. **Build Container Image**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT-ID]/ecocollect
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy ecocollect \
     --image gcr.io/[PROJECT-ID]/ecocollect \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

---

## Future Improvements

1. **SMS & Email Notifications**: Automated notification alerts when a request status changes to `Assigned` or `Collected`.
2. **GPS Logistics Mapping**: Interactive map integration showing driver routes and collection pinpoints.
3. **Role-based Authentication**: JWT-based auth for municipal drivers and administrators.
