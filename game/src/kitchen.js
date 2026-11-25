// Kitchen state model: stations for prep, chopping, grilling, assembly, and service.
// Supports combo rush multipliers, synchronized cooking animations, and zero-latency audio feedback.
import { INGREDIENTS } from './recipes.js';
import { playChopSound, playSizzleSound } from './audio.js';

export class Kitchen {
  constructor(particles) {
    this.particles = particles;
    this.choppingBoard = {
      item: null,
      progress: 0,
      knifeY: 0,
    };
    this.stoveSlots = [
      { item: null, progress: 0, maxTime: 4.5, state: 'empty' },
      { item: null, progress: 0, maxTime: 5.0, state: 'empty' },
    ];
    this.plate = [];
    this.holding = null; // item currently on chef cursor/hand
  }

  reset() {
    this.choppingBoard = { item: null, progress: 0, knifeY: 0 };
    this.stoveSlots = [
      { item: null, progress: 0, maxTime: 4.5, state: 'empty' },
      { item: null, progress: 0, maxTime: 5.0, state: 'empty' },
    ];
    this.plate = [];
    this.holding = null;
  }

  chop() {
    if (!this.choppingBoard.item) return false;
    const def = INGREDIENTS[this.choppingBoard.item];
    if (!def || !def.target) return false;

    this.choppingBoard.progress += 0.34;
    this.choppingBoard.knifeY = 18;
    playChopSound();
    if (this.particles) {
      this.particles.emitChop(460, 480, def.color, 7);
    }

    if (this.choppingBoard.progress >= 1.0) {
      this.choppingBoard.item = def.target;
      this.choppingBoard.progress = 1.0;
    }
    return true;
  }

  putOnStove(item, slotIdx) {
    const slot = this.stoveSlots[slotIdx];
    if (!slot || slot.state !== 'empty') return false;
    slot.item = item;
    slot.progress = 0;
    slot.state = 'sizzling';
    playSizzleSound();
    return true;
  }

  update(dt) {
    // Return knife to resting position
    if (this.choppingBoard.knifeY > 0) {
      this.choppingBoard.knifeY = Math.max(0, this.choppingBoard.knifeY - dt * 70);
    }

    // Cook items on stove
    this.stoveSlots.forEach((slot, idx) => {
      if (slot.state === 'sizzling') {
        slot.progress += dt / slot.maxTime;
        const xPos = 715;
        const yPos = 385 + idx * 160;
        if (this.particles && Math.random() < 0.35) {
          this.particles.emitSteam(xPos, yPos - 12, 1);
          this.particles.emitSizzle(xPos, yPos, 2);
        }
        if (slot.progress >= 1.0) {
          const def = INGREDIENTS[slot.item];
          if (def && def.target) {
            slot.item = def.target;
          }
          slot.state = 'done';
        }
      }
    });
  }
}
