import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import MissingMarzy from './MissingMarzy.png';
import './Intro.css';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';

const Modal = ({ onClose, navToLogin }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type='button' className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Login Required</h2>
        <p>You need to log in to play the game.</p>
        <button type='button' onClick={navToLogin} className='modal-login-btn'>Go to Login</button>
      </div>
    </div>
  );
};

const Intro = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navToLogin = () => {
    navigate('/login');
  }

  const navToGame = () => {
    if (isLoggedIn) {
      navigate("/main-content");
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className='home-container'>
      <Navbar isLoggedIn={isLoggedIn} logout={logout} />
      <div className="home-content-grid">
        <h1>Where's Marzy?</h1>
        <img src={MissingMarzy} alt="Missing Marzy" className='home-marzy' />
        <p className='home-paragraph'>
          Marzy has been kidnapped from Sutton Park by a gang of criminals and trafficked to a random European country.
          You must find where the criminals have taken him and save him or else they will sell his organs on the black market.
        </p>
        <button type='button' className='start-game-btn' onClick={navToGame}>Start Game</button>
      </div>
      {isModalOpen && <Modal onClose={closeModal} navToLogin={navToLogin} />}
    </div>
  );
};

export default Intro;