const gameBoardTable = document.getElementById("game-board");
const nextBlockDiv = document.getElementById("next-block");
const scoreDiv = document.getElementById("score");

const height = 24;
const width = 12;
const speed = 300;

const blocks = [
  {
    name: "I",
    shape: ["0_0", "1_0", "2_0", "3_0"],
    class: "i-block",
    height: 4,
    width: 1,
  },
  {
    name: "O",
    shape: ["0_0", "0_1", "1_0", "1_1"],
    class: "o-block",
    height: 2,
    width: 2,
  },
  {
    name: "T",
    shape: ["0_1", "1_0", "1_1", "1_2"],
    class: "t-block",
    height: 2,
    width: 3,
  },
  {
    name: "S",
    shape: ["0_1", "0_2", "1_0", "1_1"],
    class: "s-block",
    height: 2,
    width: 3,
  },
  {
    name: "Z",
    shape: ["0_0", "0_1", "1_1", "1_2"],
    class: "z-block",
    height: 2,
    width: 3,
  },
  {
    name: "L",
    shape: ["0_0", "1_0", "2_0", "2_1"],
    class: "l-block",
    height: 2,
    width: 3,
  },
  {
    name: "J",
    shape: ["0_1", "1_1", "2_0", "2_1"],
    class: "j-block",
    height: 2,
    width: 3,
  },
];

let gameBoard = Array.from({ length: height }, () => Array(width).fill(null));
let score = 0;

let currentBlock = blocks[Math.floor(Math.random() * blocks.length)];
let nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
let currentBlockY = 0 - currentBlock.height;
let currentBlockX = Math.floor((width - currentBlock.width) / 2);

const intervalId = setInterval(runGame, speed);

function runGame() {
  if (!checkCollision(currentBlockY + 1, currentBlockX)) {
    currentBlockY++;
  } else {
    placeBlock();
    clearRows();
    spawnNewBlock();
  }

  drawGameBoard();
  drawNextBlock();
}

function drawGameBoard() {
  gameBoardTable.innerHTML = "";

  for (let y = 0; y < height; y++) {
    const tr = document.createElement("tr");

    for (let x = 0; x < width; x++) {
      const td = document.createElement("td");
      td.dataset.y = y;
      td.dataset.x = x;

      if (gameBoard[y][x]) {
        td.classList.add(gameBoard[y][x]);
      } else {
        const cellCoordinates = `${y - currentBlockY}_${x - currentBlockX}`;
        if (currentBlock.shape.includes(cellCoordinates)) {
          td.classList.add(currentBlock.class);
        }
      }

      tr.appendChild(td);
    }

    gameBoardTable.appendChild(tr);
  }
}

function checkCollision(newY, newX, newShape = currentBlock.shape) {
  return newShape.some((block) => {
    const [blockY, blockX] = block.split("_").map(Number);
    const checkY = blockY + newY;
    const checkX = blockX + newX;

    return (
      checkY >= height || // Bottom boundary
      checkX < 0 || // Left boundary
      checkX >= width || // Right boundary
      (gameBoard[checkY] && gameBoard[checkY][checkX]) // Existing blocks
    );
  });
}

function placeBlock() {
  currentBlock.shape.forEach((block) => {
    const [blockY, blockX] = block.split("_").map(Number);
    const placeY = blockY + currentBlockY;
    const placeX = blockX + currentBlockX;
    gameBoard[placeY][placeX] = currentBlock.class;
  });
}

function clearRows() {
  let clearedRows = 0;

  gameBoard = gameBoard.filter((row) => {
    if (row.every((cell) => cell)) {
      clearedRows++;
      return false;
    }
    return true;
  });

  while (gameBoard.length < height) {
    gameBoard.unshift(Array(width).fill(null));
  }

  score += clearedRows * 100;
  scoreDiv.innerText = `Score: ${score}`;
}

function spawnNewBlock() {
  currentBlock = nextBlock;
  nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
  currentBlockY = 0 - currentBlock.height;
  currentBlockX = Math.floor((width - currentBlock.width) / 2);

  if (checkCollision(currentBlockY, currentBlockX)) {
    clearInterval(intervalId);
    alert("Game Over! Your score: " + score);
  }
}

function drawNextBlock() {
  nextBlockDiv.innerHTML = "";
  const previewHeight = 4;
  const previewWidth = 4;

  for (let y = 0; y < previewHeight; y++) {
    const row = document.createElement("div");
    row.classList.add("preview-row");

    for (let x = 0; x < previewWidth; x++) {
      const cell = document.createElement("div");
      cell.classList.add("preview-cell");

      const cellCoordinates = `${y}_${x}`;
      if (nextBlock.shape.includes(cellCoordinates)) {
        cell.classList.add(nextBlock.class);
      }

      row.appendChild(cell);
    }

    nextBlockDiv.appendChild(row);
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "ArrowLeft" &&
    !checkCollision(currentBlockY, currentBlockX - 1)
  ) {
    currentBlockX--;
  } else if (
    e.key === "ArrowRight" &&
    !checkCollision(currentBlockY, currentBlockX + 1)
  ) {
    currentBlockX++;
  } else if (
    e.key === "ArrowDown" &&
    !checkCollision(currentBlockY + 1, currentBlockX)
  ) {
    currentBlockY++;
  } else if (e.key === "ArrowUp") {
    rotateBlock();
  }

  drawGameBoard();
});

function rotateBlock() {
  const newShape = currentBlock.shape.map((block) => {
    const [y, x] = block.split("_").map(Number);
    return `${x}_${currentBlock.height - 1 - y}`;
  });

  if (!checkCollision(currentBlockY, currentBlockX, newShape)) {
    currentBlock.shape = newShape;
  }
}
