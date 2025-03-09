# Guess The Country Game

In each round, you can select up to three clues from six different categories: Culture, Geography, History, Politics, Random Knowledge, and Sport. Your goal is to determine which country the clues refer to, from a pool that includes all but six European countries. You earn points for choosing the correct country, with higher points awarded for using fewer clues. Each game consists of five rounds. There are 5 clues for each category for each country stored in the database. Once a user has seen a clue, the clue will not be shown again until they have seen all of the other clues for that category. It is also possible for a user to submit a clue to the database if the clue is approved by the database admin.

## Installation & Setup

### Prerequisites
Before running the project, ensure you have:
- [Python 3](https://www.python.org/downloads/) installed
- [Node.js & npm](https://nodejs.org/en/download/) installed
- [Visual Studio Code (VS Code)](https://code.visualstudio.com/download) or any preferred IDE
- The **Live Server** extension installed in VS Code (if needed for development)

---

### **1. Clone the Repository**
Open a terminal and run:
```bash
git clone https://github.com/GeorgeLittler/guess-the-country-game.git
cd guess-the-country-game
```

### **2. Backend Setup (Django)**
Navigate to the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Run the Django development server:
```bash
python3 manage.py runserver
```

The backend server should now be running at:
http://127.0.0.1:8000/

### **3. Frontend Setup (React)**
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

The frontend should now be running at:
http://localhost:3000/

### **4. Running the Project**
Ensure both the backend and frontend servers are running in separate terminal windows.

    Backend: Runs at http://127.0.0.1:8000/
    Frontend: Runs at http://localhost:3000/

The frontend will communicate with the backend API, and you should now be able to use the application.


## Features

### **Stores All Clues in a SQL Database**
- The game’s clues are stored in a structured SQL database, ensuring efficient retrieval and management
- This setup allows for easy updates, additions, and scalability as new clues or categories are introduced
- Using SQL provides fast query performance, ensuring smooth gameplay even with a large dataset

### **Uses Django for Backend**
- The backend is built with Django, a powerful Python framework that provides a secure, scalable, and maintainable structure for handling game logic, database queries, and API endpoints
- Django’s REST framework (DRF) is used to expose APIs that allow the frontend to request and receive clues, track scores, and manage user sessions
- Implements Django ORM (Object-Relational Mapping) to interact with the SQL database efficiently

### **Uses React for Frontend**
- The frontend is developed using React, providing a responsive, dynamic, and interactive user experience
- React efficiently handles real-time updates, such as displaying clues, tracking user progress, and managing the game flow
- Uses state management to keep track of selected clues, user scores, and game progress without unnecessary re-renders
- Allows for a seamless, modern UI that can be expanded with animations, leaderboards, and multiplayer functionality in the future