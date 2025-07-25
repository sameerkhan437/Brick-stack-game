const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 500;

let current, stack, speed, score, best, gameOver, started = false;

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startBtn").style.display = "none";
  started = true;
  init();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  document.getElementById("restartBtn").style.display = "none";
  init();
});

function init() {
  stack = [{x: 50, y: canvas.height - 30, width: 200}];
  current = {x: 0, y: canvas.height - 60, width: 200, dir: 1};
  speed = 2;
  score = 0;
  best = localStorage.getItem("best") || 0;
  document.getElementById("best").innerText = best;
  document.getElementById("score").innerText = 0;
  gameOver = false;
  animate();
}

function animate() {
  if (!started || gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stack
  stack.forEach(block => {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(block.x, block.y, block.width, 30);
  });

  // Move current block
  current.x += current.dir * speed;
  if (current.x + current.width > canvas.width || current.x < 0) current.dir *= -1;

  ctx.fillStyle = "#ff0";
  ctx.fillRect(current.x, current.y, current.width, 30);

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", placeBlock);

function placeBlock() {
  if (!started || gameOver) return;
  const last = stack[stack.length - 1];
  const overlap = Math.max(0, Math.min(current.x + current.width, last.x + last.width) - Math.max(current.x, last.x));
  if (overlap > 0) {
    current.width = overlap;
    current.x = Math.max(current.x, last.x);
    stack.push({x: current.x, y: current.y, width: current.width});
    current.y -= 30;
    speed += 0.1;
    score++;
    document.getElementById("score").innerText = score;
    if (score > best) {
      best = score;
      localStorage.setItem("best", best);
      document.getElementById("best").innerText = best;
    }
  } else {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 60, canvas.height / 2);
    document.getElementById("restartBtn").style.display = "block";
  }
}
