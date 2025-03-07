import React from 'react';

const FeedbackAndNextRound = ({ feedback, onNextRound, isActive, isLastRound }) => {
  return (
    <div className="user-feedback">
      <p>{feedback}</p>
      <button
        type="button"
        className={`next-round-btn ${isActive ? 'active' : ''}`}
        onClick={onNextRound}
        disabled={!isActive}
      >
        {isLastRound ? "End Game" : "Next Round"}
      </button>
    </div>
  );
};

export default FeedbackAndNextRound;