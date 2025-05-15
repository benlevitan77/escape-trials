import { useEffect, useState } from 'react';

const ReflexChallenge = ({ onSuccess, onFail, level }) => {
  const gridSize = 3 + Math.min(level, 5); // scales up
  const [targetIndex, setTargetIndex] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const index = Math.floor(Math.random() * (gridSize * gridSize));
    setTargetIndex(index);
    const timer = setTimeout(() => {
      onFail();
    }, 1000); // 1 second to respond
    setTimeoutId(timer);
    return () => clearTimeout(timer);
  }, [gridSize]);

  const handleClick = (index) => {
    clearTimeout(timeoutId);
    setClicked(index);
    if (index === targetIndex) {
      onSuccess();
    } else {
      onFail();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>⚡ Click the red square FAST!</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 40px)`,
          justifyContent: 'center',
          gap: '5px',
          marginTop: '10px'
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: index === targetIndex ? 'red' : 'gray',
              cursor: 'pointer',
              border: index === clicked ? '2px solid yellow' : '1px solid black'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ReflexChallenge;
