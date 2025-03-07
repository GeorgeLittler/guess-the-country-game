import React, { useState, useEffect } from 'react';
import './Clues.css';

const Clues = ({ resetClues, clues, fetchClue, categoryUsage, hasSubmitted }) => {
  const [activeButtons, setActiveButtons] = useState([]);

  const buttonNames = ["Culture", "Geography", "History", "Politics", "Random Knowledge", "Sport"];

  useEffect(() => {
    if (resetClues) {
      setActiveButtons([]);
    }
  }, [resetClues]);

  const handleButtonClick = (category) => {
    if (!hasSubmitted && !activeButtons.includes(category) && activeButtons.length < 3 && categoryUsage[category] < 3) {
      fetchClue(category);
      setActiveButtons([...activeButtons, category]);
    }
  };

  const normalizeButtonName = (name) => name.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="clue-container">
      <div className="button-grid">
        {buttonNames.map((buttonName) => {
          const normalizedButtonName = normalizeButtonName(buttonName);
          const isFinished = categoryUsage[buttonName] >= 3;
          return (
            <button
              key={buttonName}
              type="button"
              className={`button-${normalizedButtonName} 
                ${activeButtons.includes(buttonName) ? 'active' : ''} 
                ${activeButtons.length === 3 ? 'three' : ''}
                ${isFinished ? 'finished' : ''}
                ${hasSubmitted ? 'submitted' : ''}`}
              onClick={() => handleButtonClick(buttonName)}
              disabled={
                hasSubmitted ||
                (activeButtons.length >= 3 && !activeButtons.includes(buttonName)) ||
                isFinished
              }
            >
              {buttonName}
            </button>
          );
        })}
      </div>
      <hr className="separator" />
      {Object.entries(clues).map(([category, clue]) => {
        const normalizedCategory = normalizeButtonName(category);
        return (
          <p key={category} className={`clue-paragraph ${normalizedCategory}`}>
            {clue.text}
          </p>
        );
      })}
    </div>
  );
};

export default Clues;