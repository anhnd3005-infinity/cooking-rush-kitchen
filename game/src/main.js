// Main game loop, state orchestration and scene staging for Bistro Rush.
import { ParticleSystem } from './particles.js';
import { OrderManager } from './orders.js';
import { Kitchen } from './kitchen.js';
import { GameRenderer, SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_OVER } from './render.js';
import { InputManager, ACTION_CONFIRM, ACTION_PAUSE } from './input.js';
import { stageScene } from './shots.js';

const canvas = document.getElementById('game');
const renderer = new GameRenderer(canvas);
const particles = new ParticleSystem();
const orders = new OrderManager();
const kitchen = new Kitchen(particles);
const input = new InputManager(canvas);

const state = {
  particles,
  orders,
  kitchen,
  shiftTimeRemaining: 90,
};

let screen = SCREEN_TITLE;
let bestScore = 0;
let lastTime = performance.now();

// Handle URL query parameters for screenshot generation
const params = new URLSearchParams(window.location.search);
const shotParam = params.get('shot');

function runScreenshotMode(shotName) {
  renderer.resize();
  const scene = stageScene(shotName, state);
  let frames = 0;

  function renderFrame() {
    renderer.draw(state, scene.screen, scene.best);
    frames++;
    if (frames < 3) {
      requestAnimationFrame(renderFrame);
    } else {
      window.__shotReady = true;
    }
  }
  requestAnimationFrame(renderFrame);
}

function startGame() {
  kitchen.reset();
  orders.reset();
  state.shiftTimeRemaining = 90;
  screen = SCREEN_PLAY;
}

function gameLoop(now) {
  requestAnimationFrame(gameLoop);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // Process global actions
  const actions = input.takeActions();
  if (actions & ACTION_CONFIRM) {
    if (screen === SCREEN_TITLE || screen === SCREEN_OVER) {
      startGame();
    }
  }
  if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
    screen = SCREEN_PAUSED;
  } else if ((actions & (ACTION_PAUSE | ACTION_CONFIRM)) && screen === SCREEN_PAUSED) {
    screen = SCREEN_PLAY;
  }

  // Update game simulation
  if (screen === SCREEN_PLAY) {
    input.processKitchenClicks(kitchen, orders, particles);
    kitchen.update(dt);
    orders.update(dt);
    particles.update(dt);

    state.shiftTimeRemaining -= dt;
    if (state.shiftTimeRemaining <= 0) {
      screen = SCREEN_OVER;
      if (orders.score > bestScore) {
        bestScore = orders.score;
      }
    }
  }

  renderer.draw(state, screen, bestScore);
}

window.addEventListener('resize', () => renderer.resize());
renderer.resize();

if (shotParam) {
  runScreenshotMode(shotParam);
} else {
  requestAnimationFrame(gameLoop);
}
