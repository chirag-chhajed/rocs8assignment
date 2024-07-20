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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
    setIterations(0);
  };
  const toggleCell = useCallback(
    (i: number, j: number) => {
      if (isRunning) return;

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
    <div className="px-5 py-3 h-screen flex flex-col bg-accent">
      <header className="flex justify-between items-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Conway's Game of Life
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size={"icon"}
                variant="ghost"
                title="info of the game"
                aria-label="info of the game"
              >
                <Info size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent asChild>
              <div className="space-y-3 text-accent-foreground w-80 md:w-fit mr-4">
                <p className="text-lg font-bold">For a live cell:</p>
                <ol className="list-decimal list-inside font-medium text-base">
                  <li>Survives if it has 2 or 3 live neighbors</li>
                  <li>
                    Dies if it has fewer than 2 live neighbors (underpopulation)
                  </li>
                  <li>
                    Dies if it has more than 3 live neighbors (overpopulation)
                  </li>
                </ol>
                <p className="text-lg font-bold">For a dead cell:</p>
                <ol className="list-decimal list-inside font-medium text-base">
                  <li>
                    Becomes alive if it has exactly 3 live neighbors
                    (reproduction)
                  </li>
                  <li>Stays dead in all other cases</li>
                </ol>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <div className="my-4 space-x-2">
        {!isRunning ? (
          <Button
            onClick={startSimulation}
            variant={"default"}
            type="button"
            title="Start the Game"
            aria-label="Start the Game"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={stopSimulation}
            type="button"
            variant={"destructive"}
            title="Pause the Game"
            aria-label="Pause the Game"
          >
            Stop
          </Button>
        )}
        <Button
          onClick={resetGrid}
          type="button"
          variant={"outline"}
          title="Reset the Grid"
          aria-label="Reset the Grid"
        >
          Reset
        </Button>
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
          className="my-4 md:w-1/2 lg:w-1/3"
        />
        <div className="my-2">Iterations: {iterations}</div>
      </div>
      <main
        className="flex-grow flex justify-center mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${deferredSize}px)`,
          width: `${columns * deferredSize}px`,
          height: `${rows * deferredSize}px`,
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
