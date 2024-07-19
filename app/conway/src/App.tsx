import { useWindowSize } from "@uidotdev/usehooks";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useDeferredValue,
  memo,
} from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "./lib/utils";

const MAX_GRID_WIDTH = 1500;
const MAX_GRID_HEIGHT = 1500;

export default function App() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [size, setSize] = useState(20);
  const [iterations, setIterations] = useState(0);
  const [sizeChanged, setSizeChanged] = useState(false);
  const deferredSize = useDeferredValue(size);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const width = Math.min(windowWidth! - 40, MAX_GRID_WIDTH);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const height = Math.min(windowHeight! - 150, MAX_GRID_HEIGHT);
  const columns = Math.floor((width - 40) / deferredSize);
  const rows = Math.floor((height - 150) / deferredSize);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const initializeGrid = useCallback(() => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array.from(Array(columns), () => Math.random() < 0.15));
    }
    return grid;
  }, [columns, rows]);

  const [grid, setGrid] = useState(initializeGrid);

  useEffect(() => {
    setGrid(initializeGrid());
    setIterations(0);
    if (isRunning) {
      setIsRunning(false);
      setSizeChanged(true);
    }
  }, [columns, rows, initializeGrid]);

  useEffect(() => {
    if (sizeChanged && !isRunning) {
      startSimulation();
      setSizeChanged(false);
    }
  }, [sizeChanged, isRunning]);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      if (g.length !== rows || g[0].length !== columns) {
        return initializeGrid();
      }
      const nextGrid = g.map((row, i) =>
        row.map((_cell, j) => {
          let neighbors = 0;
          for (let I = -1; I <= 1; I++) {
            for (let J = -1; J <= 1; J++) {
              if (I === 0 && J === 0) continue;
              const x = i + I;
              const y = j + J;
              if (x >= 0 && x < rows && y >= 0 && y < columns) {
                neighbors += g[x][y] ? 1 : 0;
              }
            }
          }

          if (neighbors < 2 || neighbors > 3) return false;
          if (neighbors === 3) return true;
          return g[i][j];
        })
      );
      return nextGrid;
    });
    setIterations((iter) => iter + 1);

    setTimeout(runSimulation, 1000);
  }, [columns, rows, initializeGrid]);

  const startSimulation = () => {
    setIsRunning(true);
    runningRef.current = true;
    runSimulation();
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetGrid = () => {
    setGrid(initializeGrid());
    setIsRunning(false);
  };
  const toggleCell = useCallback(
    (i: number, j: number) => {
      if (isRunning) return; // Optionally prevent toggling while the simulation is running

      setGrid((g) => {
        const newGrid = [...g];
        newGrid[i] = [...newGrid[i]];
        newGrid[i][j] = !newGrid[i][j];
        return newGrid;
      });
    },
    [isRunning]
  );
  return (
    <div className="px-5 py-3 h-screen flex flex-col">
      <header>
        <h1 className="text-2xl">Conway's Game of Life</h1>
      </header>
      <div className="my-4">
        {!isRunning ? (
          <button
            onClick={startSimulation}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            type="button"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopSimulation}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            type="button"
          >
            Stop
          </button>
        )}
        <button
          onClick={resetGrid}
          className="bg-gray-500 text-white px-4 py-2 rounded"
          type="button"
        >
          Reset
        </button>
        <Slider
          onValueChange={(e) => {
            setSize(e[0]);
            if (isRunning) {
              stopSimulation();
            }
          }}
          defaultValue={[20]}
          min={15}
          max={60}
          step={5}
          className="my-4"
        />
        <div className="my-2">Iterations: {iterations}</div>
      </div>
      <main
        className="flex-grow flex justify-center"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${deferredSize}px)`,
          width: `${columns * deferredSize}px`,
          height: `${rows * deferredSize}px`,
          margin: "0 auto",
        }}
      >
        <MemoizedGrid
          grid={grid}
          deferredSize={deferredSize}
          toggleCell={toggleCell}
        />
      </main>
    </div>
  );
}

const MemoizedGrid = memo(
  ({
    grid,
    deferredSize,
    toggleCell,
  }: {
    grid: boolean[][];
    deferredSize: number;
    toggleCell: (i: number, j: number) => void;
  }) => (
    <>
      {grid.map((rows, i) =>
        rows.map((_col, k) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={`${i}-${k}`}
            className={cn(
              "transition border border-gray-400",
              grid[i][k] ? "bg-black" : "bg-white"
            )}
            style={{
              width: deferredSize,
              height: deferredSize,

              borderRadius: `${Math.max(2, deferredSize / 10)}px`,
              boxShadow: grid[i][k]
                ? `0 0 ${deferredSize / 5}px rgba(0, 0, 0, 0.5)`
                : `inset 0 0 ${deferredSize / 10}px rgba(0, 0, 0, 0.1)`,
            }}
            onClick={() => toggleCell(i, k)}
          />
        ))
      )}
    </>
  )
);
