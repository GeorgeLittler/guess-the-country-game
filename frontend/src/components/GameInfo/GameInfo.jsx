import React from 'react';
import { TOTAL_ROUNDS } from '../../constants/gameConstants';

const GameInfo = ({ round, availablePoints, score }) => {
  return (
    <div className="game-info">
      <p className="round-number">Round: {round + 1} / {TOTAL_ROUNDS}</p>
      <p className='available-points'>Points Available: {availablePoints}</p>
      <p className="score">Points: {score}</p>
    </div>
  );
};

export default GameInfo;