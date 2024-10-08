const inhaleCircle = document.querySelector('.inhale');
const holdCircle = document.querySelector('.hold');
const exhaleCircle = document.querySelector('.exhale');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const durationButtons = document.querySelectorAll('.duration-btn');
const breatheCounterElement = document.getElementById('breatheCounter');

let INHALE_TIME = 4;
let HOLD_TIME = 4;
let EXHALE_TIME = 5;
let TOTAL_CYCLE_TIME = INHALE_TIME + HOLD_TIME + EXHALE_TIME;

let isRunning = false;
let animationFrame;
let startTime;
let breathCount = 0;
let lastCycleTime = 0;

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = performance.now();
  animate();
}

function stopTimer() {
  isRunning = false;
  cancelAnimationFrame(animationFrame);
  resetCircles();
  breathCount = 0;
  updateBreatheCounter();
}

function animate(currentTime) {
  if (!isRunning) return;

  const elapsedTime = (currentTime - startTime) / 1000;
  const cycleTime = elapsedTime % TOTAL_CYCLE_TIME;

  if (cycleTime < lastCycleTime) {
    breathCount++;
    updateBreatheCounter();
  }
  lastCycleTime = cycleTime;

  updateCircles(cycleTime);

  animationFrame = requestAnimationFrame(animate);
}

function updateCircles(cycleTime) {
  resetCircles();

  if (cycleTime < INHALE_TIME) {
    updateCircle(inhaleCircle, cycleTime, INHALE_TIME);
  } else if (cycleTime < INHALE_TIME + HOLD_TIME) {
    inhaleCircle.classList.add('active');
    updateCircle(holdCircle, cycleTime - INHALE_TIME, HOLD_TIME);
  } else {
    inhaleCircle.classList.add('active');
    holdCircle.classList.add('active');
    updateCircle(exhaleCircle, cycleTime - INHALE_TIME - HOLD_TIME, EXHALE_TIME);
  }
}

function updateCircle(circle, currentTime, totalTime) {
  circle.classList.add('active');
  const progress = (currentTime / totalTime) * 360;
  circle.querySelector('.progress-ring').style.transform = `rotate(${progress}deg)`;
  
  const remainingTime = Math.max(0, totalTime - currentTime).toFixed(1);
  circle.querySelector('.timer-duration').textContent = `${remainingTime}s`;
}

function resetCircles() {
  [inhaleCircle, holdCircle, exhaleCircle].forEach(circle => {
    circle.classList.remove('active');
    circle.querySelector('.progress-ring').style.transform = 'rotate(0deg)';
  });
  updateDurationDisplay();
}

function updateDurationDisplay() {
  inhaleCircle.querySelector('.timer-duration').textContent = `${INHALE_TIME.toFixed(1)}s`;
  holdCircle.querySelector('.timer-duration').textContent = `${HOLD_TIME.toFixed(1)}s`;
  exhaleCircle.querySelector('.timer-duration').textContent = `${EXHALE_TIME.toFixed(1)}s`;
}

function updateDuration(target, increment) {
  const minDuration = 1;
  const maxDuration = 10;

  switch (target) {
    case 'inhale':
      INHALE_TIME = Math.min(Math.max(INHALE_TIME + increment, minDuration), maxDuration);
      break;
    case 'hold':
      HOLD_TIME = Math.min(Math.max(HOLD_TIME + increment, minDuration), maxDuration);
      break;
    case 'exhale':
      EXHALE_TIME = Math.min(Math.max(EXHALE_TIME + increment, minDuration), maxDuration);
      break;
  }

  TOTAL_CYCLE_TIME = INHALE_TIME + HOLD_TIME + EXHALE_TIME;
  updateDurationDisplay();
}

function updateBreatheCounter() {
  breatheCounterElement.textContent = `Breaths: ${breathCount}`;
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);

durationButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    const increment = button.classList.contains('plus') ? 0.5 : -0.5;
    updateDuration(target, increment);
  });
});

// Initialize circles and durations
resetCircles();
updateDurationDisplay();
updateBreatheCounter();