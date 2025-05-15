import { useEffect, useState } from 'react';

const emojiBank = ['🐶','🐱','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🐧','🐦'];

const MemoryChallenge = ({ onSuccess, onFail, level }) => {
  const sequenceLength = Math.min(3 + level, 10);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const selected = Array.from({ length: sequenceLength }, () =>
      emojiBank[Math.floor(Math.random() * emojiBank.length)]
    );
    setSequence(selected);
    const timer = setTimeout(() => setShowing(false), 2000 + sequenceLength * 300);
    return () => clearTimeout(timer);
  }, [sequenceLength]);

  const handleGuess = (emoji) => {
    const next = [...userInput, emoji];
    setUserInput(next);
    if (next.length === sequence.length) {
      if (JSON.stringify(next) === JSON.stringify(sequence)) {
        onSuccess();
      } else {
        onFail();
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🧠 Memory Match</h2>
      {showing ? (
        <div style={{ fontSize: 32 }}>{sequence.join(' ')}</div>
      ) : (
        <div>
          <p>Repeat the sequence:</p>
          <div>
            {emojiBank.map((emoji, i) => (
              <button key={i} style={{ fontSize: 24, margin: 5 }} onClick={() => handleGuess(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryChallenge;
