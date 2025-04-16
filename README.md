# Guess The Country Game

**Guess The Country** is an interactive quiz game where players choose clues from different categories to identify a European country. You can select up to three clues per round from categories like Culture, Geography, History, Politics, Random Knowledge, and Sport. Points are awarded based on the number of clues used, encouraging strategic play. Users can also submit new clues for approval.

---

## Live Deployment

- **Frontend**: [https://guess-the-country.vercel.app](https://guess-the-country.vercel.app)
- **Backend API**: [https://guess-the-country-backend.onrender.com](https://guess-the-country-backend.onrender.com)

---

## Tech Stack

- **Frontend**: React (deployed on Vercel)
- **Backend**: Django REST Framework (deployed on Render)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Token-based with DRF

---

## Running Locally (Optional)

If you'd like to run the project locally for development purposes:

### 1. Clone the Repository

```bash
git clone https://github.com/GeorgeLittler/guess-the-country-game.git
cd guess-the-country-game
```

### 2. Backend setup

Make sure you have Python 3.11+ installed.

Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a .env file in backend/ and add:
```bash
DATABASE_URL=your_own_supabase_connection_string
DEBUG=True
```
You must set up your own Supabase project to get a connection string. This project does not expose access to the production database.

Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

Make sure you have Node.js installed.

```bash
cd frontend
npm install
npm run dev
```
This will run the frontend at http://localhost:3000 and the backend at http://localhost:8000 by default.

---

## Features

✨ 6 categories of clues per country

🔐 Authenticated user sessions

📤 Users can submit their own clues

🧠 Clue memory ensures non-repeating clues

🧩 All data stored in a centralised Supabase PostgreSQL DB

---

## Deployment Info

Render hosts the Django backend

Vercel hosts the React frontend

Supabase hosts the production PostgreSQL database

---

## Project Structure
```bash
guess-the-country-game/
├── backend/              # Django REST API
│   ├── api/              # Core game logic and models
│   ├── manage.py
│   └── ...
├── frontend/             # React UI
│   └── ...
└── .gitignore
```