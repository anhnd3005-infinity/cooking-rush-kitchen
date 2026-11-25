// Mouse and keyboard input management for Bistro Rush.
import { PANTRY_KEYS, INGREDIENTS } from './recipes.js';

export const ACTION_CONFIRM = 1 << 0;
export const ACTION_PAUSE = 1 << 1;

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.actions = 0;
    this.mouse = { x: 0, y: 0, clicked: false };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        this.actions |= ACTION_CONFIRM;
      } else if (e.code === 'KeyP') {
        this.actions |= ACTION_PAUSE;
      }
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 1280 / rect.width;
      const scaleY = 720 / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
      this.mouse.clicked = true;
      this.actions |= ACTION_CONFIRM;
    });
  }

  takeActions() {
    const a = this.actions;
    this.actions = 0;
    return a;
  }

  processKitchenClicks(kitchen, orders, particles) {
    if (!this.mouse.clicked) return;
    this.mouse.clicked = false;
    const { x, y } = this.mouse;

    // 1. Check Pantry Bins (3 columns x 5 rows)
    for (let idx = 0; idx < PANTRY_KEYS.length; idx++) {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const bx = 30 + col * 96;
      const by = 295 + row * 78;
      const bw = 88;
      const bh = 72;

      if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
        const itemKey = PANTRY_KEYS[idx];
        const def = INGREDIENTS[itemKey];
        if (!def) return;

        if (def.category === 'raw_chop') {
          kitchen.choppingBoard.item = itemKey;
          kitchen.choppingBoard.progress = 0;
        } else if (def.category === 'raw_grill') {
          if (kitchen.stoveSlots[0].state === 'empty') {
            kitchen.putOnStove(itemKey, 0);
          } else if (kitchen.stoveSlots[1].state === 'empty') {
            kitchen.putOnStove(itemKey, 1);
          }
        } else {
          // Direct to plate
          kitchen.plate.push(itemKey);
        }
        return;
      }
    }

    // 2. Check Chopping Board (x: 340-570, y: 295-650)
    if (x >= 340 && x <= 570 && y >= 295 && y <= 650) {
      if (kitchen.choppingBoard.item) {
        if (kitchen.choppingBoard.progress < 1.0) {
          kitchen.chop();
        } else {
          // Transfer prepped item to plate
          kitchen.plate.push(kitchen.choppingBoard.item);
          kitchen.choppingBoard.item = null;
          kitchen.choppingBoard.progress = 0;
        }
      }
      return;
    }

    // 3. Check Stove Slots
    kitchen.stoveSlots.forEach((slot, idx) => {
      const px = 630;
      const py = 310 + idx * 165;
      if (x >= px && x <= px + 200 && y >= py && y <= py + 145) {
        if (slot.state === 'done') {
          kitchen.plate.push(slot.item);
          slot.item = null;
          slot.state = 'empty';
          slot.progress = 0;
        }
      }
    });

    // 4. Check Plating Board / Discard
    if (x >= 880 && x <= 1120 && y >= 295 && y <= 650) {
      // Discard / reset plate if wrong or overflow
      if (kitchen.plate.length >= 7) {
        kitchen.plate = [];
      }
      return;
    }

    // 5. Check Service Bell
    if (x >= 1090 && x <= 1250 && y >= 340 && y <= 470) {
      if (kitchen.plate.length > 0) {
        const result = orders.deliverPlate(kitchen.plate);
        if (result) {
          if (particles) particles.emitServeStars(1010, 460, 24);
          kitchen.plate = [];
        }
      }
    }
  }
}
