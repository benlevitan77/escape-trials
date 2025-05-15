import { useState } from 'react';

const DiceChallenge = ({ onSuccess, onFail }) => {
  const [computerRoll] = useState(Math.ceil(Math.random() * 6));
  const [playerRoll, setPlayerRoll] = useState(null);
  const [result, setResult] = useState(null);

  const handleGuess = (guessType) => {
    const roll = Math.ceil(Math.random() * 6);
    setPlayerRoll(roll);

    let success = false;
    if (guessType === 'higher') {
      success = roll >= computerRoll;
    } else {
      success = roll <= computerRoll;
    }

    setResult(success ? 'win' : 'lose');
    setTimeout(success ? onSuccess : onFail, 1200);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🎲 Dice Prediction Duel</h2>
      <p>Computer rolled: <strong>{computerRoll}</strong></p>
      <p>Can you predict your roll correctly?</p>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => handleGuess('higher')}>I’ll roll ⬆️ higher or equal</button>{' '}
        <button onClick={() => handleGuess('lower')}>I’ll roll ⬇️ lower or equal</button>
      </div>

      {playerRoll && (
        <div style={{ marginTop: 10 }}>
          <p>You rolled: 🎲 {playerRoll}</p>
          <p style={{ fontWeight: 'bold' }}>
            {result === 'win' ? '✅ You predicted correctly!' : '❌ You were wrong!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceChallenge;
