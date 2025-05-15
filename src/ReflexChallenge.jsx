import { useEffect, useState } from 'react';

const ReflexChallenge = ({ onSuccess, onFail, level }) => {
  const gridSize = 3 + Math.min(level, 5); // scales to max 8x8
  const [targetIndex, setTargetIndex] = useState(null);
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    const index = Math.floor(Math.random() * (gridSize * gridSize));
    setTargetIndex(index);
  }, [gridSize]);

  const handleClick = (index) => {
    setClicked(index);
    if (index === targetIndex) {
      onSuccess();
    } else {
      onFail();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>⚡ Click the red square!</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 40px)`,
          justifyContent: 'center',
          gap: '5px'
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