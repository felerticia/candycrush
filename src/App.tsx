import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import { WIDTH, COLORS } from "./constants";
import { useState, useEffect } from "react";

function App() {
  const [candies, setCandies] = useState<string[]>([]);

  const createBoard = () => {
    const colors: string[] = new Array(WIDTH * WIDTH)
      .fill(0)
      .map(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

    return colors;
  };

  useEffect(() => {
    const board = createBoard();
    setCandies(board);
  }, []);

  console.log(candies);

  return (
    <div>
      <img src={blueCandy} />
      <img src={greenCandy} />
      <img src={orangeCandy} />
      <img src={purpleCandy} />
      <img src={redCandy} />
      <img src={yellowCandy} />
    </div>
  );
}

export default App;
