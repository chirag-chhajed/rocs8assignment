import { useState, useCallback, useRef } from "react";

const rows = 30;
const cols = 30;

function initializeGrid() {
  const rows = 30;
  const cols = 30;
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array.from(Array(cols), () => false));
  }
  // Add a glider
  grid[1][2] = true;
  grid[2][3] = true;
  grid[3][1] = true;
  grid[3][2] = true;
  grid[3][3] = true;
  return grid;
}

export default function App() {
  const [grid, setGrid] = useState(() => {
    return initializeGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => computeNextGeneration(g));
    setTimeout(runSimulation, 100);
  }, []);

  const computeNextGeneration = (g) => {
    const newGrid = g.map((arr) => [...arr]);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let neighbors = 0;
        const operations = [
          [0, 1],
          [0, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
          [1, 0],
          [-1, -1],
          [-1, 0],
        ];

        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;
          if (newI >= 0 && newI < rows && newJ >= 0 && newJ < cols) {
            neighbors += g[newI][newJ] ? 1 : 0;
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = false;
        } else if (g[i][j] === false && neighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }

    return newGrid;
  };

  const toggleCell = (i, j) => {
    const newGrid = [...grid];
    newGrid[i][j] = !newGrid[i][j];
    setGrid(newGrid);
  };

  const nextStep = () => {
    setGrid((g) => computeNextGeneration(g));
  };
  const handleCellInteraction = (i, j) => {
    if (!running) {
      toggleCell(i, j);
    }
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button type="button" onClick={() => setGrid(initializeGrid())}>
        Randomize
      </button>
      <button type="button" onClick={nextStep} disabled={running}>
        Next
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => handleCellInteraction(i, k)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "1px solid gray",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
