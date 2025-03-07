import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EuropeMap from '../../components/EuropeMap/EuropeMap';
import Clues from '../../components/Clues/Clues';
import GameInfo from '../../components/GameInfo/GameInfo';
import FeedbackAndNextRound from '../../components/FeedbackAndNextRound/FeedbackAndNextRound';
import './MainContent.css';
import useGameState from '../../hooks/useGameState';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import { TOTAL_ROUNDS } from '../../constants/gameConstants';

const MainContent = () => {
  const { 
    round, 
    score, 
    userFeedback, 
    handleSubmit, 
    handleNextRoundAndResetMapAndClues, 
    hasSubmitted, 
    correctAnswer, 
    clues, 
    fetchClue,
    availablePoints,
    categoryUsage,
    resetGame,
    resetMap,
    resetClues
  } = useGameState();
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleGameEnd = () => {
    resetGame();
    navigate('/');
  };

  const handleNextRoundClick = () => {
    if (round === TOTAL_ROUNDS - 1) {
      handleGameEnd();
    } else {
      handleNextRoundAndResetMapAndClues();
    }
  };

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} logout={logout} />
      <div className="content-grid">
        <GameInfo round={round} availablePoints={availablePoints} score={score} />
        {correctAnswer && (
          <>
            <EuropeMap 
              className="europe-map" 
              onSubmit={handleSubmit} 
              hasSubmitted={hasSubmitted} 
              resetMap={resetMap} 
              correctAnswer={correctAnswer} 
            />
            <Clues 
              className="clues" 
              resetClues={resetClues} 
              clues={clues} 
              fetchClue={(category) => fetchClue(correctAnswer.id, category)}
              categoryUsage={categoryUsage}
              hasSubmitted={hasSubmitted}
            />
          </>
        )}
        <FeedbackAndNextRound 
          feedback={userFeedback}
          onNextRound={handleNextRoundClick}
          isActive={hasSubmitted}
          isLastRound={round === TOTAL_ROUNDS - 1}
        />
      </div>
    </>
  );
};

export default MainContent;