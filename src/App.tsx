/* eslint-disable @typescript-eslint/no-unused-vars */

import { WIDTH, COLORS } from "./constants";
import { useState, useEffect, useCallback, DragEvent } from "react";

function App() {
  const [candies, setCandies] = useState<string[]>([]);
  const [dragging, setDragging] = useState<number>(-1);
  const [dropping, setDropping] = useState<number>(-1);

  const createStack = () => {
    const colors: string[] = new Array(WIDTH * WIDTH)
      .fill(0)
      .map(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

    return colors;
  };

  const checkColumn = (currentCandies: string[]) => {
    for (let i = 0; i <= WIDTH * (WIDTH - 4) - 1; i++) {
      if (!currentCandies[i]) continue;

      if (
        currentCandies[i] === currentCandies[i + WIDTH] &&
        currentCandies[i] === currentCandies[i + WIDTH * 2] &&
        currentCandies[i] === currentCandies[i + WIDTH * 3] &&
        currentCandies[i] === currentCandies[i + WIDTH * 4]
      ) {
        currentCandies[i] = "";
        currentCandies[i + WIDTH] = "";
        currentCandies[i + WIDTH * 2] = "";
        currentCandies[i + WIDTH * 3] = "";
        currentCandies[i + WIDTH * 4] = "";
      }
    }

    for (let i = 0; i <= WIDTH * (WIDTH - 3) - 1; i++) {
      if (!currentCandies[i]) continue;

      if (
        currentCandies[i] === currentCandies[i + WIDTH] &&
        currentCandies[i] === currentCandies[i + WIDTH * 2] &&
        currentCandies[i] === currentCandies[i + WIDTH * 3]
      ) {
        currentCandies[i] = "";
        currentCandies[i + WIDTH] = "";
        currentCandies[i + WIDTH * 2] = "";
        currentCandies[i + WIDTH * 3] = "";
      }
    }

    for (let i = 0; i <= WIDTH * (WIDTH - 2) - 1; i++) {
      if (!currentCandies[i]) continue;

      if (
        currentCandies[i] === currentCandies[i + WIDTH] &&
        currentCandies[i] === currentCandies[i + WIDTH * 2]
      ) {
        currentCandies[i] = "";
        currentCandies[i + WIDTH] = "";
        currentCandies[i + WIDTH * 2] = "";
      }
    }

    return currentCandies;
  };

  const checkRow = (currentCandies: string[]) => {
    for (let i = 0; i <= WIDTH * WIDTH - 5; i++) {
      if (!currentCandies[i]) continue;

      if ((i % WIDTH) + 5 > WIDTH) continue;

      if (
        currentCandies[i] === currentCandies[i + 1] &&
        currentCandies[i] === currentCandies[i + 2] &&
        currentCandies[i] === currentCandies[i + 3] &&
        currentCandies[i] === currentCandies[i + 4]
      ) {
        currentCandies[i] = "";
        currentCandies[i + 1] = "";
        currentCandies[i + 2] = "";
        currentCandies[i + 3] = "";
        currentCandies[i + 4] = "";
      }
    }

    for (let i = 0; i <= WIDTH * WIDTH - 4; i++) {
      if (!currentCandies[i]) continue;

      if ((i % WIDTH) + 4 > WIDTH) continue;

      if (
        currentCandies[i] === currentCandies[i + 1] &&
        currentCandies[i] === currentCandies[i + 2] &&
        currentCandies[i] === currentCandies[i + 3]
      ) {
        currentCandies[i] = "";
        currentCandies[i + 1] = "";
        currentCandies[i + 2] = "";
        currentCandies[i + 3] = "";
      }
    }

    for (let i = 0; i <= WIDTH * WIDTH - 3; i++) {
      if (!currentCandies[i]) continue;

      if ((i % WIDTH) + 3 > WIDTH) continue;

      if (
        currentCandies[i] === currentCandies[i + 1] &&
        currentCandies[i] === currentCandies[i + 2]
      ) {
        currentCandies[i] = "";
        currentCandies[i + 1] = "";
        currentCandies[i + 2] = "";
      }
    }

    return currentCandies;
  };

  const moveDown = (currentCandies: string[]) => {
    for (let i = 0; i <= WIDTH * WIDTH; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentCandies[i] === "") {
        const randomNumber = Math.floor(Math.random() * COLORS.length);
        currentCandies[i] = COLORS[randomNumber];
      }

      if (currentCandies[i + WIDTH] === "") {
        currentCandies[i + WIDTH] = currentCandies[i];
        currentCandies[i] = "";
      }
    }
    return currentCandies;
  };

  const clearDuplicates = useCallback((currentCandies: string[]) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let nextCandies = [...currentCandies];
      nextCandies = checkColumn(nextCandies);
      nextCandies = checkRow(nextCandies);
      nextCandies = moveDown(nextCandies);
      if (currentCandies.every((cell, i) => cell === nextCandies[i])) {
        return currentCandies;
      }
      currentCandies = [...nextCandies];
    }
  }, []);

  const dragStart = (e: DragEvent<HTMLDivElement>) => {
    // The item being dragged
    setDragging(Number(e.currentTarget.getAttribute("data-id")));
  };
  const dragDrop = (e: DragEvent<HTMLDivElement>) => {
    // and OnDrop is a message to the dropped upon target.
    setDropping(Number(e.currentTarget.getAttribute("data-id")));
  };
  const dragEnd = () => {
    // Drag ends

    const isNextCell =
      dropping === dragging - 1 ||
      dropping === dragging + 1 ||
      dropping === dragging - WIDTH ||
      dropping === dragging + WIDTH;

    const invalidRightEdge =
      dragging % WIDTH === WIDTH - 1 && dropping === dragging + 1;

    const invalidLeftEdge = dragging % WIDTH === 0 && dropping === dragging - 1;

    const valid = isNextCell && !invalidRightEdge && !invalidLeftEdge;

    if (valid) {
      let newCandies = [...candies];

      [newCandies[dragging], newCandies[dropping]] = [
        newCandies[dropping],
        newCandies[dragging],
      ];

      newCandies = checkColumn(newCandies);
      newCandies = checkRow(newCandies);

      if (newCandies.filter((x) => !x).length === 0) {
        // didn't make any 3,4,5 in a row or column
        return;
      } else {
        setCandies(newCandies);
      }
    }
  };

  useEffect(() => {
    let newCandies = createStack();
    newCandies = clearDuplicates(newCandies);
    setCandies(newCandies);
  }, [clearDuplicates]);

  useEffect(() => {
    setTimeout(() => {
      let newCandies = [...candies];
      newCandies = checkColumn(newCandies);
      newCandies = checkRow(newCandies);
      newCandies = moveDown(newCandies);

      if (newCandies.every((b, i) => b === candies[i])) return;
      else setCandies(newCandies);
    }, 100);
  }, [candies]);

  const preventDefaultMethod = (e: DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  return (
    <div className="app">
      <div className="board">
        {candies.map((candy, index) => (
          <div
            key={index}
            className={candy}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={
              preventDefaultMethod /*when an element is being dragged over a drop target*/
            }
            onDragEnter={
              preventDefaultMethod /*when an element is draggable element enters a drop target*/
            }
            onDragLeave={
              preventDefaultMethod /*when an  element is moved out of a drop target*/
            }
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
