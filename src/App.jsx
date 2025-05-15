import { useState, useEffect } from 'react';
import ReflexChallenge from './ReflexChallenge';
import MemoryChallenge from './MemoryChallenge';
import DiceChallenge from './DiceChallenge';
import './App.css';

const START_TIME = 60;
const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];

const createEmptyMaze = (size) =>
  Array.from({ length: size }, () => Array(size).fill('wall'));

const generateMaze = (size) => {
  const maze = createEmptyMaze(size);
  const isValid = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1;

  const carve = (x, y) => {
    maze[y][x] = 'path';
    for (const [dx, dy] of directions.sort(() => 0.5 - Math.random())) {
      const nx = x + dx, ny = y + dy;
      if (isValid(nx, ny) && maze[ny][nx] === 'wall') {
        maze[y + dy / 2][x + dx / 2] = 'path';
        carve(nx, ny);
      }
    }
  };

  carve(1, 1);
  maze[1][1] = 'start';

  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue = [{ x: 1, y: 1, dist: 0 }];
  visited[1][1] = true;
  let farthest = { x: 1, y: 1, dist: 0 };

  while (queue.length) {
    const { x, y, dist } = queue.shift();
    if (dist > farthest.dist) farthest = { x, y, dist };
    for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size &&
          !visited[ny][nx] && maze[ny][nx] === 'path') {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny, dist: dist + 1 });
      }
    }
  }

  maze[farthest.y][farthest.x] = 'goal';

  let count = 0;
  while (count < 8) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (maze[y][x] === 'path') {
      maze[y][x] = 'challenge';
      count++;
    }
  }

  return { maze, goal: farthest };
};

const App = () => {
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('mazeHighScore') || '0')
  );
  const [size, setSize] = useState(10);
  const [{ maze, goal }, setMazeState] = useState(() => generateMaze(10));
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeType, setChallengeType] = useState(null);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const resetGame = (increment = false) => {
    const newLevel = increment ? level + 1 : 0;
    const newSize = 10 + newLevel;
    setLevel(newLevel);
    setSize(newSize);
    const newMaze = generateMaze(newSize);
    setMazeState(newMaze);
    setPlayer({ x: 1, y: 1 });
    setTimeLeft(START_TIME);
    setShowChallenge(false);
    setShowWinMessage(false);
    setChallengeType(null);
    if (newLevel > highScore) {
      setHighScore(newLevel);
      localStorage.setItem('mazeHighScore', newLevel);
    }
  };

  const movePlayer = (dx, dy) => {
    const nx = player.x + dx, ny = player.y + dy;
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;
    const tile = maze[ny][nx];
    if (tile === 'wall') return;
    if (nx === goal.x && ny === goal.y) {
      setShowWinMessage(true);
      return;
    }
    if (tile === 'challenge') {
      setChallengeType(['reflex', 'memory', 'dice'][Math.floor(Math.random() * 3)]);
      setShowChallenge(true);
    }
    setPlayer({ x: nx, y: ny });
  };

  const handleWinChallenge = () => {
    const newMaze = maze.map(row => [...row]);
    newMaze[player.y][player.x] = 'path';
    setMazeState({ maze: newMaze, goal });
    setShowChallenge(false);
    setChallengeType(null);
  };

  const handleFailChallenge = () => {
    resetGame(false);
  };

  useEffect(() => {
    const keyHandler = (e) => {
      if (showChallenge || showWinMessage || timeLeft <= 0) return;
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [player, showChallenge, showWinMessage, timeLeft]);

  useEffect(() => {
    if (showChallenge || showWinMessage) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showChallenge, showWinMessage]);

  const renderTile = (type, x, y) => {
    const isPlayer = player.x === x && player.y === y;
    if (isPlayer) return '🧍';
    if (x === goal.x && y === goal.y) return '🚪';
    if (type === 'wall') return '⬛';
    if (type === 'path') return '⬜';
    if (type === 'challenge') return '🟥';
    return '';
  };

  return (
    <div className="container">
      <h1>🧩 Escape Trials Maze</h1>
      <div style={{ marginBottom: 10 }}>
        <strong>⏱ Time Left:</strong> {timeLeft}s &nbsp;&nbsp;
        <strong>🎯 Level:</strong> {level} &nbsp;&nbsp;
        <strong>🥇 High Score:</strong> {highScore}
        <button
          onClick={() => resetGame(false)}
          style={{
            marginLeft: 20,
            padding: '5px 15px',
            borderRadius: '5px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🔁 Restart Game
        </button>
      </div>

      <div className="grid" style={{
        gridTemplateColumns: `repeat(${size}, 40px)`,
        gridTemplateRows: `repeat(${size}, 40px)`
      }}>
        {maze.flatMap((row, y) =>
          row.map((cell, x) => (
            <div className="cell" key={`${x}-${y}`}>
              {renderTile(cell, x, y)}
            </div>
          ))
        )}
      </div>

      {timeLeft === 0 && !showWinMessage && (
        <div style={{ marginTop: 20, fontSize: '1.2rem', color: 'red' }}>
          ❌ Time’s up! Try again.
        </div>
      )}

      {showWinMessage && (
        <div style={{ marginTop: 20, fontSize: '1.4rem', color: 'green' }}>
          🎉 You reached the goal! You win!
          <br />
          <button
            onClick={() => resetGame(true)}
            style={{
              marginTop: 10,
              padding: '6px 18px',
              borderRadius: '6px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ▶️ Start Next Level
          </button>
        </div>
      )}

      {showChallenge && (
        <div className="modal">
          <div className="modal-content">
            {{
              reflex: <ReflexChallenge onSuccess={handleWinChallenge} onFail={handleFailChallenge} level={level + 1} />,
              memory: <MemoryChallenge onSuccess={handleWinChallenge} onFail={handleFailChallenge} level={level + 1} />,
              dice: <DiceChallenge onSuccess={handleWinChallenge} onFail={handleFailChallenge} />
            }[challengeType]}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
