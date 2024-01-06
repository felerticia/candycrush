/* eslint-disable @typescript-eslint/no-unused-vars */

import { WIDTH, COLORS } from "./constants";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [candies, setCandies] = useState<string[]>([]);

  const createBoard = () => {
    const colors: string[] = new Array(WIDTH * WIDTH)
      .fill(0)
      .map(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

    return colors;
  };

  const checkColumn = (board: string[]) => {
    for (let i = 0; i <= WIDTH * (WIDTH - 4) - 1; i++) {
      if (!board[i]) continue;

      if (
        board[i] === board[i + WIDTH] &&
        board[i] === board[i + WIDTH * 2] &&
        board[i] === board[i + WIDTH * 3] &&
        board[i] === board[i + WIDTH * 4]
      ) {
        board[i] = "";
        board[i + WIDTH] = "";
        board[i + WIDTH * 2] = "";
        board[i + WIDTH * 3] = "";
        board[i + WIDTH * 4] = "";
      }
    }

    for (let i = 0; i <= WIDTH * (WIDTH - 3) - 1; i++) {
      if (!board[i]) continue;

      if (
        board[i] === board[i + WIDTH] &&
        board[i] === board[i + WIDTH * 2] &&
        board[i] === board[i + WIDTH * 3]
      ) {
        board[i] = "";
        board[i + WIDTH] = "";
        board[i + WIDTH * 2] = "";
        board[i + WIDTH * 3] = "";
      }
    }

    for (let i = 0; i <= WIDTH * (WIDTH - 2) - 1; i++) {
      if (!board[i]) continue;

      if (board[i] === board[i + WIDTH] && board[i] === board[i + WIDTH * 2]) {
        board[i] = "";
        board[i + WIDTH] = "";
        board[i + WIDTH * 2] = "";
      }
    }

    return board;
  };

  const checkRow = (board: string[]) => {
    for (let i = 0; i <= WIDTH * WIDTH - 5; i++) {
      if (!board[i]) continue;

      if ((i % WIDTH) + 5 > WIDTH) continue;

      if (
        board[i] === board[i + 1] &&
        board[i] === board[i + 2] &&
        board[i] === board[i + 3] &&
        board[i] === board[i + 4]
      ) {
        board[i] = "";
        board[i + 1] = "";
        board[i + 2] = "";
        board[i + 3] = "";
        board[i + 4] = "";
      }
    }

    for (let i = 0; i <= WIDTH * WIDTH - 4; i++) {
      if (!board[i]) continue;

      if ((i % WIDTH) + 4 > WIDTH) continue;

      if (
        board[i] === board[i + 1] &&
        board[i] === board[i + 2] &&
        board[i] === board[i + 3]
      ) {
        board[i] = "";
        board[i + 1] = "";
        board[i + 2] = "";
        board[i + 3] = "";
      }
    }

    for (let i = 0; i <= WIDTH * WIDTH - 3; i++) {
      if (!board[i]) continue;

      if ((i % WIDTH) + 3 > WIDTH) continue;

      if (board[i] === board[i + 1] && board[i] === board[i + 2]) {
        board[i] = "";
        board[i + 1] = "";
        board[i + 2] = "";
      }
    }

    return board;
  };

  const moveDown = (board: string[]) => {
    for (let i = 0; i <= WIDTH * WIDTH; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && board[i] === "") {
        const randomNumber = Math.floor(Math.random() * COLORS.length);
        board[i] = COLORS[randomNumber];
      }

      if (board[i + WIDTH] === "") {
        board[i + WIDTH] = board[i];
        board[i] = "";
      }
    }
    return board;
  };

  const clearDuplicates = useCallback((board: string[]) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let newBoard = [...board];
      newBoard = checkColumn(newBoard);
      newBoard = checkRow(newBoard);
      newBoard = moveDown(newBoard);
      if (board.every((cell, i) => cell === newBoard[i])) {
        return board;
      }
      board = [...newBoard];
    }
  }, []);

  useEffect(() => {
    let board = createBoard();
    board = clearDuplicates(board);
    setCandies(board);
  }, [clearDuplicates]);

  return (
    <div className="app">
      <div className="board">
        {candies.map((candy, index) => (
          <div key={index} className={candy}>
            {index}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
