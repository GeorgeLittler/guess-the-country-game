import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Intro from "./pages/Intro/Intro";
import UserAddClues from "./pages/UserAddClues/UserAddClues";
import Rules from "./pages/Rules/Rules";
import MainContent from "./pages/MainContent/MainContent";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add_clue" element={<UserAddClues />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/main-content" element={<MainContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
