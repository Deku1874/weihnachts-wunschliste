// ==================== TETRIS GAME ====================
const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const BLOCK_SIZE = 25;
const COLS = 10;
const ROWS = 16;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]]  // Z
];

const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let linesCleared = 0;
let gameOver = false;
let dropCounter = 0;
let dropInterval = 800;
let lastTime = 0;

function createPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[idx],
    color: COLORS[idx]
  };
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawBlock(c, r, board[r][c]);
      }
    }
  }
}

function drawPiece() {
  if (!currentPiece) return;
  currentPiece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        drawBlock(currentX + c, currentY + r, currentPiece.color);
      }
    });
  });
}

function collision(x, y, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const newX = x + c;
        const newY = y + r;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function merge() {
  currentPiece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const y = currentY + r;
        const x = currentX + c;
        if (y >= 0) {
          board[y][x] = currentPiece.color;
        }
      }
    });
  });
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared > 0) {
    linesCleared += cleared;
    document.getElementById('lines-cleared').textContent = linesCleared;
    if (linesCleared >= 10) {
      winGame();
    }
  }
}

function newPiece() {
  currentPiece = createPiece();
  currentX = Math.floor(COLS / 2) - 1;
  currentY = 0;
  
  if (collision(currentX, currentY, currentPiece.shape)) {
    gameOver = true;
    alert('Game Over! Versuch es nochmal!');
    resetGame();
  }
}

function drop() {
  if (gameOver) return;
  if (!collision(currentX, currentY + 1, currentPiece.shape)) {
    currentY++;
  } else {
    merge();
    clearLines();
    newPiece();
  }
}

function moveLeft() {
  if (!collision(currentX - 1, currentY, currentPiece.shape)) {
    currentX--;
  }
}

function moveRight() {
  if (!collision(currentX + 1, currentY, currentPiece.shape)) {
    currentX++;
  }
}

function rotate() {
  const rotated = currentPiece.shape[0].map((_, i) =>
    currentPiece.shape.map(row => row[i]).reverse()
  );
  if (!collision(currentX, currentY, rotated)) {
    currentPiece.shape = rotated;
  }
}

function hardDrop() {
  while (!collision(currentX, currentY + 1, currentPiece.shape)) {
    currentY++;
  }
  drop();
}

function resetGame() {
  board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  linesCleared = 0;
  document.getElementById('lines-cleared').textContent = linesCleared;
  gameOver = false;
  newPiece();
}

function winGame() {
  gameOver = true;
  setTimeout(() => {
    document.getElementById('tetris-screen').classList.add('hidden');
  }, 500);
}

function skipGame() {
  document.getElementById('tetris-screen').classList.add('hidden');
}

// Game Loop
function gameLoop(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  
  if (dropCounter > dropInterval) {
    drop();
    dropCounter = 0;
  }
  
  drawBoard();
  drawPiece();
  requestAnimationFrame(gameLoop);
}

// Touch Controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) moveRight();
    else if (dx < -30) moveLeft();
  } else {
    if (dy > 50) hardDrop();
    else if (Math.abs(dx) < 20 && Math.abs(dy) < 20) rotate();
  }
});

// Keyboard Controls
document.addEventListener('keydown', e => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowDown') drop();
  if (e.key === 'ArrowUp' || e.key === ' ') rotate();
});

// Start Tetris
newPiece();
gameLoop();

// ==================== WISHLIST CODE ====================
const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
const giftCount = gifts.length;
let currentIndex = 0;

const quizModal = document.getElementById("quizModal");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const feedbackText = document.getElementById("feedbackText");

const quizData = [
  {
    question: "Wann habe ich Geburtstag?",
    correct: "14.02.2006",
    wrong: ["25.12.1999", "01.04.2005", "31.10.2007"],
    link: "https://www.zalando.de/nike-sportswear-air-force-1-07-sneaker-low-white-ni112n022-a11.html",
    wrongTexts: ["Nope, so alt bin ich nicht!", "Falsch! Ich bin kein Aprilscherz!", "Halloween? Versuch's nochmal!"]
  },
  {
    question: "Was studiere ich?",
    correct: "Interaktive Medien",
    wrong: ["Raketenwissenschaft", "Kunst🤡", "Meme-ologie"],
    link: "https://www.zalando.de/karl-kani-jeans-relaxed-fit-grey-kk122g04f-c11.html",
    wrongTexts: ["Klingt cool, aber nein!", "Kreativ, aber leider falsch!", "Fast, aber nicht ganz!"]
  },
  {
    question: "Wie groß bin ich?",
    correct: "Größer als Papa",
    wrong: ["Groß", "Genau 2 Meter", "Durchschnittlich"],
    link: "https://www.zalando.de/karl-kani-tribal-baggy-five-pocket-jeans-relaxed-fit-bleached-blue-kk122g03r-k11.html",
    wrongTexts: ["Hahahaha, fast!", "Übertreib mal nicht!", "Nope!"]
  },
  {
    question: "Wer ist mein Lieblings Musiker?",
    correct: "T-low",
    wrong: ["Helene Fischer", "Lil Peep", "XXXTentacion"],
    link: "https://shirtz.cool/products/the-weaver-hoodie?variant=41144949211234",
    wrongTexts: ["Atemlos?", "Nur in der Top 4!", "Fast!"]
  },
  {
    question: "Was ist mein Lieblings Getränk?",
    correct: "White Monster",
    wrong: ["Vodka mit Pfeffer", "Gurkenwasser", "Red Bull"],
    link: "https://shirtz.cool/products/the-demon-hoodie",
    wrongTexts: ["Nur wenn ich krank bin!", "Bäh!Ich bin nicht Papa!", "Energy für Verlierer!"]
  },
  {
    question: "Was ist mein Lieblings Story Spiel?",
    correct: "Resident Evil",
    wrong: ["Counter-Strike 2", "Minecraft", "RDR2"],
    link: "https://store.steampowered.com/app/3764200/Resident_Evil_Requiem/",
    wrongTexts: ["Ist doch nur ein Online Shooter?", "Immer gut zum spielen, aber nein!", "Andi, hast du mich mit Tim verwechselt?"]
  },
  {
    question: "Wo will ich gerne hinreisen?",
    correct: "Japan",
    wrong: ["Bielefeld", "Bulgarien", "Nord Korea"],
    link: "https://www.amazon.de/Elgato-Studio-Controller-ausl%C3%B6sen-Software-20GBA9901-wt/dp/B09RMXK59C/",
    wrongTexts: ["Das gibt's doch gar nicht!", "Erst zu einer Hochzeit!", "Komme ich dann überhaupt wieder zurück?"]
  }
];

const unlockedGifts = new Array(giftCount).fill(false);

const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

function showSlide(index) {
  currentIndex = Math.max(0, Math.min(index, giftCount - 1));
  const offset = -currentIndex * window.innerWidth;
  track.style.transform = `translateX(${offset}px)`;
  updatePageIndicator(currentIndex);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${giftCount}`;
}

window.addEventListener("resize", () => {
  showSlide(currentIndex);
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    showSlide(currentIndex + 1);
  }
  if (e.key === "ArrowLeft") {
    showSlide(currentIndex - 1);
  }
});

let startX = 0;
let isSwiping = false;

track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  isSwiping = true;
});

track.addEventListener("touchend", e => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const swipeThreshold = 50;
  
  if (deltaX < -swipeThreshold) {
    showSlide(currentIndex + 1);
  } else if (deltaX > swipeThreshold) {
    showSlide(currentIndex - 1);
  }
  isSwiping = false;
});

function showQuiz(giftIndex) {
  const quiz = quizData[giftIndex];
  quizQuestion.textContent = quiz.question;
  feedbackText.textContent = "";
  
  const allAnswers = [quiz.correct, ...quiz.wrong];
  const shuffled = allAnswers.sort(() => Math.random() - 0.5);
  
  quizAnswers.innerHTML = "";
  shuffled.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(answer, quiz, giftIndex, btn);
    quizAnswers.appendChild(btn);
  });
  
  quizModal.classList.add("active");
}

function checkAnswer(selected, quiz, giftIndex, btn) {
  if (selected === quiz.correct) {
    btn.classList.add("correct");
    feedbackText.textContent = "🎉 Richtig! Geschenk freigeschaltet!";
    feedbackText.style.color = "#4CAF50";
    
    setTimeout(() => {
      unlockGift(giftIndex);
      quizModal.classList.remove("active");
    }, 1500);
  } else {
    btn.classList.add("wrong");
    const wrongIndex = quiz.wrong.indexOf(selected);
    feedbackText.textContent = quiz.wrongTexts[wrongIndex];
    feedbackText.style.color = "#ff4444";
    
    setTimeout(() => {
      btn.classList.remove("wrong");
      feedbackText.textContent = "";
    }, 1500);
  }
}

function unlockGift(giftIndex) {
  unlockedGifts[giftIndex] = true;
  const giftElement = gifts[giftIndex].querySelector(".gift");
  giftElement.classList.add("unlocked");
}

gifts.forEach((giftBox, index) => {
  const giftElement = giftBox.querySelector(".gift");
  giftElement.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (unlockedGifts[index]) {
      window.open(quizData[index].link, "_blank");
    } else {
      showQuiz(index);
    }
  });
});

showSlide(currentIndex);