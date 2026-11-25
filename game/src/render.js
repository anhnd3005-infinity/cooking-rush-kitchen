// Canvas 2D renderer for Bistro Rush: kitchen environment, order board, ingredient prep, and plating.
import { INGREDIENTS, PANTRY_KEYS } from './recipes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 1280;
    this.height = 720;
    this.scale = 1;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 1280;
    const h = rect.height || 720;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.scale = Math.min((w * dpr) / this.width, (h * dpr) / this.height);
  }

  draw(state, screen, bestScore = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.scale, this.scale);

    // 1. Draw Kitchen Backdrop
    this.drawKitchenBackdrop(ctx);

    // 2. Draw Top Order Board
    this.drawOrderBoard(ctx, state.orders);

    // 3. Draw Kitchen Workstations
    this.drawCounters(ctx);
    this.drawPantry(ctx, state.kitchen);
    this.drawChoppingStation(ctx, state.kitchen.choppingBoard);
    this.drawStoveStation(ctx, state.kitchen.stoveSlots);
    this.drawPlatingStation(ctx, state.kitchen.plate);
    this.drawServiceBell(ctx);

    // 4. Draw Particles
    if (state.particles) {
      state.particles.draw(ctx);
    }

    // 5. Draw HUD & Service Timer
    this.drawHUD(ctx, state);

    // 6. Draw Overlay Screens (Title / Paused / Game Over)
    if (screen === SCREEN_TITLE) {
      this.drawTitleScreen(ctx, bestScore);
    } else if (screen === SCREEN_PAUSED) {
      this.drawPausedScreen(ctx);
    } else if (screen === SCREEN_OVER) {
      this.drawGameOverScreen(ctx, state, bestScore);
    }

    ctx.restore();
  }

  drawKitchenBackdrop(ctx) {
    // Subway tiled wall
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(0, 0, this.width, this.height);

    // Wall tiles
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.width, 240);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    for (let y = 0; y < 240; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    for (let y = 0; y < 240; y += 30) {
      const offset = (y / 30) % 2 === 0 ? 0 : 35;
      for (let x = offset; x < this.width; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 30);
        ctx.stroke();
      }
    }

    // Stainless steel splashback shelf & ambient light
    const shelfGrad = ctx.createLinearGradient(0, 226, 0, 244);
    shelfGrad.addColorStop(0, '#94a3b8');
    shelfGrad.addColorStop(0.3, '#cbd5e1');
    shelfGrad.addColorStop(0.7, '#64748b');
    shelfGrad.addColorStop(1, '#334155');
    ctx.fillStyle = shelfGrad;
    ctx.fillRect(0, 226, this.width, 18);

    // Warm kitchen spot lighting gradient from above
    const spotGrad = ctx.createRadialGradient(640, 20, 50, 640, 240, 650);
    spotGrad.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
    spotGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, this.width, 240);
  }

  drawCounters(ctx) {
    const y = 244;
    const h = this.height - y;

    // Rich Butcher Block Oak Table
    const woodGrad = ctx.createLinearGradient(0, y, 0, this.height);
    woodGrad.addColorStop(0, '#a14506');
    woodGrad.addColorStop(0.08, '#853205');
    woodGrad.addColorStop(0.5, '#6c2803');
    woodGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(0, y, this.width, h);

    // Wood planks pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let py = y + 40; py < this.height; py += 35) {
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(this.width, py);
      ctx.stroke();
    }

    // Stainless steel griddle station bay with brushed metal sheen
    const steelGrad = ctx.createLinearGradient(600, y, 860, y);
    steelGrad.addColorStop(0, '#1e293b');
    steelGrad.addColorStop(0.15, '#475569');
    steelGrad.addColorStop(0.5, '#64748b');
    steelGrad.addColorStop(0.85, '#475569');
    steelGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = steelGrad;
    ctx.fillRect(600, y, 260, h);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(600, y, 260, h);

    // Steel ventilation grates at bottom of stove bay
    ctx.fillStyle = '#0f172a';
    for (let gy = 665; gy < 705; gy += 10) {
      ctx.fillRect(620, gy, 220, 5);
    }
  }

  drawOrderBoard(ctx, orders) {
    // Brass ticket hanging rail with metallic sheen
    const railGrad = ctx.createLinearGradient(40, 10, 40, 22);
    railGrad.addColorStop(0, '#fef08a');
    railGrad.addColorStop(0.4, '#d97706');
    railGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = railGrad;
    ctx.fillRect(40, 10, 1200, 12);

    // Render active order tickets
    const active = orders.activeOrders || [];
    active.forEach((order, idx) => {
      const x = 320 + idx * 290;
      const y = 20;
      const w = 270;
      const h = 202;

      // Realistic ticket drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#fffef7';
      ctx.fillRect(x, y, w, h);
      ctx.restore();

      // Top brass grip clip
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + w / 2 - 20, y - 6, 40, 12);
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + w / 2 - 16, y - 4, 32, 4);

      // Order Title & Recipe Tag
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillText(`ORDER #${order.ticketId}`, x + 16, y + 26);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.fillText(order.recipe.name, x + 16, y + 46);

      // Recipe steps with distinct icons
      ctx.fillStyle = '#334155';
      ctx.font = '12px -apple-system, sans-serif';
      order.recipe.steps.forEach((step, sIdx) => {
        ctx.fillText(`${step.icon} ${step.text}`, x + 16, y + 68 + sIdx * 20);
      });

      // Patience Timer Bar
      const timerPct = Math.max(0, order.timeRemaining / order.totalTime);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + 16, y + h - 26, w - 32, 14);

      // Color coding timer bar
      ctx.fillStyle = timerPct > 0.45 ? '#16a34a' : timerPct > 0.2 ? '#d97706' : '#dc2626';
      ctx.fillRect(x + 16, y + h - 26, (w - 32) * timerPct, 14);

      // Timer gloss line
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(x + 16, y + h - 26, (w - 32) * timerPct, 5);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${Math.ceil(order.timeRemaining)}s`, x + w - 42, y + h - 15);
    });
  }

  drawPantry(ctx, kitchen) {
    // Pantry Bins Header with modern badge
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText('🥫 INGREDIENTS PANTRY', 30, 278);

    PANTRY_KEYS.forEach((key, idx) => {
      const def = INGREDIENTS[key];
      if (!def) return;

      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const bx = 30 + col * 96;
      const by = 295 + row * 78;
      const bw = 88;
      const bh = 72;

      // Bin container with drop shadow & border
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, by, bw, bh);
      ctx.restore();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);

      // Top category color accent line
      ctx.fillStyle = def.color;
      ctx.fillRect(bx, by, bw, 4);

      // Icon & Name
      ctx.font = '24px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(def.icon || '🥘', bx + bw / 2, by + 34);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.fillText(def.name, bx + bw / 2, by + 50);

      // Action Hint tag [CHOP] / [GRILL] / [PLATE]
      ctx.fillStyle = def.hint === 'CHOP' ? '#38bdf8' : def.hint === 'GRILL' ? '#fb923c' : '#a3e635';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`[${def.hint}]`, bx + bw / 2, by + 64);
    });
    ctx.textAlign = 'left';
  }

  drawChoppingStation(ctx, board) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText('🔪 CHOPPING BOARD', 345, 278);

    const bx = 345;
    const by = 295;
    const bw = 230;
    const bh = 370;

    // End-grain Wooden cutting board with multi-layer bevel and wood grain
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#d97706';
    ctx.fillRect(bx, by, bw, bh);
    ctx.restore();

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 5;
    ctx.strokeRect(bx, by, bw, bh);

    // Juice groove perimeter
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx + 14, by + 14, bw - 28, bh - 28);

    if (board.item) {
      const def = INGREDIENTS[board.item] || { name: board.item, color: '#e63946', icon: '🍅' };

      // Food item on board with realistic shading
      const cx = bx + bw / 2;
      const cy = by + bh / 2 - 20;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cut marks on food as progress advances
      if (board.progress > 0) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        const cuts = Math.floor(board.progress * 5);
        for (let i = 0; i < cuts; i++) {
          const cutX = cx - 25 + i * 12;
          ctx.beginPath();
          ctx.moveTo(cutX, cy - 25);
          ctx.lineTo(cutX, cy + 25);
          ctx.stroke();
        }
      }

      // Ingredient name & state label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(def.name, cx, cy + 62);

      // Chop Progress Bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx + 20, by + bh - 48, bw - 40, 20);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx + 20, by + bh - 48, bw - 40, 20);

      const chopPct = Math.min(1, board.progress);
      ctx.fillStyle = chopPct >= 1 ? '#22c55e' : '#38bdf8';
      ctx.fillRect(bx + 22, by + bh - 46, (bw - 44) * chopPct, 16);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(chopPct >= 1 ? '✓ CHOPPED! CLICK TO PLATE' : `PREP: ${Math.round(chopPct * 100)}%`, cx, by + bh - 34);

      // Professional Chef Knife
      const knifeY = cy - 25 + (board.knifeY || 0);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Steel blade
      const bladeGrad = ctx.createLinearGradient(cx - 55, knifeY, cx + 45, knifeY);
      bladeGrad.addColorStop(0, '#f8fafc');
      bladeGrad.addColorStop(0.5, '#cbd5e1');
      bladeGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = bladeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 55, knifeY);
      ctx.lineTo(cx + 45, knifeY);
      ctx.lineTo(cx + 45, knifeY + 16);
      ctx.lineTo(cx - 45, knifeY + 16);
      ctx.closePath();
      ctx.fill();

      // Knife pakkawood handle
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cx + 45, knifeY - 2, 36, 20);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(cx + 55, knifeY + 6, 4, 4); // rivet 1
      ctx.fillRect(cx + 68, knifeY + 6, 4, 4); // rivet 2
      ctx.restore();

      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Select Tomato, Lettuce,', bx + bw / 2, by + bh / 2 - 14);
      ctx.fillText('Pepperoni or Scallion', bx + bw / 2, by + bh / 2 + 8);
      ctx.fillStyle = '#92400e';
      ctx.font = 'italic 12px -apple-system, sans-serif';
      ctx.fillText('Press [SPACE] or Click to Chop', bx + bw / 2, by + bh / 2 + 34);
      ctx.textAlign = 'left';
    }
  }

  drawStoveStation(ctx, slots) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText('🔥 STOVE & SIZZLE GRIDDLE', 630, 278);

    slots.forEach((slot, idx) => {
      const px = 630;
      const py = 310 + idx * 165;
      const pw = 200;
      const ph = 145;

      const panX = px + 80;
      const panY = py + 70;

      // Heavy Cast Iron Pan with outer rim and heat glow
      ctx.save();
      ctx.shadowColor = slot.state === 'sizzling' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = slot.state === 'sizzling' ? 16 : 8;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(panX, panY, 58, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Pan handle with hanging hole
      ctx.fillStyle = '#090d16';
      ctx.fillRect(panX + 54, panY - 7, 58, 14);
      ctx.beginPath();
      ctx.arc(panX + 104, panY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Pan interior surface
      ctx.fillStyle = '#182030';
      ctx.beginPath();
      ctx.arc(panX, panY, 52, 0, Math.PI * 2);
      ctx.fill();

      if (slot.state !== 'empty' && slot.item) {
        const def = INGREDIENTS[slot.item] || { name: slot.item, color: '#993d3d' };

        // Sizzling patty / chashu meat with gradient crust
        const meatGrad = ctx.createRadialGradient(panX - 8, panY - 8, 4, panX, panY, 40);
        meatGrad.addColorStop(0, def.color);
        meatGrad.addColorStop(0.8, '#301010');
        meatGrad.addColorStop(1, '#1a0808');
        ctx.fillStyle = meatGrad;
        ctx.beginPath();
        ctx.arc(panX, panY, 38, 0, Math.PI * 2);
        ctx.fill();

        // High-end Diamond Crosshatch Grill Marks
        ctx.save();
        ctx.strokeStyle = '#150505';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Diagonal line set 1
        ctx.moveTo(panX - 25, panY - 15);
        ctx.lineTo(panX + 15, panY + 25);
        ctx.moveTo(panX - 15, panY - 25);
        ctx.lineTo(panX + 25, panY + 15);
        ctx.moveTo(panX - 32, panY);
        ctx.lineTo(panX, panY + 32);
        // Diagonal line set 2 (Crosshatch diamond)
        ctx.moveTo(panX - 15, panY + 25);
        ctx.lineTo(panX + 25, panY - 15);
        ctx.moveTo(panX - 25, panY + 15);
        ctx.lineTo(panX + 15, panY - 25);
        ctx.moveTo(panX, panY + 32);
        ctx.lineTo(panX + 32, panY);
        ctx.stroke();

        // Glistening oil sizzle sheen highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(panX - 12, panY - 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Doneness Progress Ring
        ctx.beginPath();
        ctx.arc(panX, panY, 48, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, slot.progress));
        ctx.strokeStyle = slot.progress >= 1.0 ? '#22c55e' : '#f59e0b';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Status Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(slot.state === 'done' ? '✓ SEARED! CLICK TO PLATE' : '🔥 SIZZLING...', panX, py + 138);
        ctx.textAlign = 'left';
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Griddle Burner ${idx + 1}`, panX, panY - 4);
        ctx.fillStyle = '#475569';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillText('Patty / Chashu', panX, panY + 12);
        ctx.textAlign = 'left';
      }
    });
  }

  drawPlatingStation(ctx, plate) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText('🍽️ PLATING & ASSEMBLY', 880, 278);

    const px = 880;
    const by = 295;
    const pw = 240;
    const ph = 370;

    // Station counter area
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px, by, pw, ph);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(px, by, pw, ph);

    // Fine Dining Porcelain Plate
    const cx = px + pw / 2;
    const cy = by + ph / 2 - 20;

    // Subtle drop shadow on plate (ambient soft shadow + contact shadow)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Plate ceramic gradient & luxury gold edge rim
    const plateGrad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, 90);
    plateGrad.addColorStop(0, '#ffffff');
    plateGrad.addColorStop(0.75, '#f1f5f9');
    plateGrad.addColorStop(0.95, '#e2e8f0');
    plateGrad.addColorStop(1, '#d97706'); // Michelin gold rim!
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner plate recess ring
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 68, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Stacked Ingredients on Plate (Mid-Assembly or Finished Dish)
    if (plate.length > 0) {
      plate.forEach((itemKey, idx) => {
        const def = INGREDIENTS[itemKey] || { name: itemKey, color: '#f59e0b' };
        const stackY = cy + 30 - idx * 13;
        const stackW = 86 - idx * 2;

        ctx.save();
        // Drop shadow under each layered ingredient
        ctx.shadowColor = 'rgba(0,0,0,0.22)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 3;

        // Custom detailed rendering per ingredient type
        if (itemKey === 'bun') {
          const isTop = idx === plate.length - 1 && idx > 0;
          ctx.fillStyle = isTop ? '#d97706' : '#b45309';
          ctx.beginPath();
          if (isTop) {
            // Rounded dome top bun with sesame seeds
            ctx.ellipse(cx, stackY, stackW / 2, 16, 0, Math.PI, 0);
            ctx.fill();
            // Sesame seeds
            ctx.fillStyle = '#fffbeb';
            [-18, -6, 8, 20, -12, 14].forEach((sx, sIdx) => {
              ctx.fillRect(cx + sx, stackY - 6 - (sIdx % 2) * 5, 3, 2);
            });
          } else {
            // Bottom toasted flat bun
            ctx.ellipse(cx, stackY, stackW / 2, 10, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (itemKey === 'patty_cooked' || itemKey === 'pork_seared') {
          // Juicy cooked patty / seared pork with grill marks
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.ellipse(cx, stackY, stackW / 2, 11, 0, 0, Math.PI * 2);
          ctx.fill();
          // Grill char marks on plated burger patty
          ctx.strokeStyle = '#200808';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - 24, stackY - 4);
          ctx.lineTo(cx + 8, stackY + 4);
          ctx.moveTo(cx - 10, stackY - 4);
          ctx.lineTo(cx + 22, stackY + 4);
          ctx.stroke();
        } else if (itemKey === 'cheese' || itemKey === 'mozzarella') {
          // Melted cheese drooping over edges
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.ellipse(cx, stackY, stackW / 2 + 3, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (itemKey === 'tomato_sliced') {
          // Glossy red sliced tomato discs
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.ellipse(cx, stackY, stackW / 2 - 2, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (itemKey === 'lettuce_chopped' || itemKey === 'basil' || itemKey === 'scallion_chopped') {
          // Fresh ruffled herbs / greens
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.ellipse(cx, stackY, stackW / 2 + 2, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard ingredient layer
          ctx.fillStyle = def.color;
          ctx.beginPath();
          ctx.ellipse(cx, stackY, stackW / 2, 9, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Layer count indicator & dish ready status
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${plate.length} Layers Assembled`, cx, cy + 96);
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillText('Ready? Hit Bell to Serve!', cx, cy + 112);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Plate is pristine', cx, cy - 8);
      ctx.fillText('Stack prepared recipe layers here', cx, cy + 14);
      ctx.textAlign = 'left';
    }
  }

  drawServiceBell(ctx) {
    const bx = 1170;
    const by = 345;

    // Golden service bell with radiant metallic shimmer
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;

    // Hardwood mahogany base
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bx - 36, by + 44, 72, 10);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx - 36, by + 42, 72, 3);

    // Bell Dome with multi-stop Golden Metallic Shimmer
    const bellGrad = ctx.createLinearGradient(bx - 34, by, bx + 34, by + 44);
    bellGrad.addColorStop(0, '#fef08a'); // specular highlight
    bellGrad.addColorStop(0.2, '#fde047');
    bellGrad.addColorStop(0.5, '#f59e0b');
    bellGrad.addColorStop(0.85, '#d97706');
    bellGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = bellGrad;
    ctx.beginPath();
    ctx.arc(bx, by + 40, 34, Math.PI, 0);
    ctx.fill();

    // Polished curved shimmer streak
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bx - 6, by + 40, 26, Math.PI * 1.15, Math.PI * 1.55);
    ctx.stroke();

    // Top brass striker pin & knob
    ctx.fillStyle = '#92400e';
    ctx.fillRect(bx - 4, by + 2, 8, 10);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(bx, by + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Serve Action Button with emerald glow
    ctx.save();
    ctx.shadowColor = 'rgba(22, 163, 74, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(bx - 48, by + 68, 96, 40);
    ctx.restore();

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx - 48, by + 68, 96, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔔 RING &', bx, by + 85);
    ctx.fillText('SERVE', bx, by + 100);
    ctx.textAlign = 'left';
  }

  drawHUD(ctx, state) {
    // Score & Revenue Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 150, 240, 68);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 150, 240, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.fillText('RESTAURANT REVENUE', 45, 172);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`$${state.orders.score || 0}`, 45, 204);

    // Enhanced Combo Rush Indicator
    if (state.orders.combo > 1) {
      const comboX = 175;
      const comboY = 162;
      const comboW = 86;
      const comboH = 44;

      // Pulsating flame rush badge
      ctx.save();
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      const rushGrad = ctx.createLinearGradient(comboX, comboY, comboX, comboY + comboH);
      rushGrad.addColorStop(0, '#ef4444');
      rushGrad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = rushGrad;
      ctx.fillRect(comboX, comboY, comboW, comboH);
      ctx.restore();

      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(comboX, comboY, comboW, comboH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ${state.orders.combo}x RUSH`, comboX + comboW / 2, comboY + 20);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`+${state.orders.combo * 25}% TIPS`, comboX + comboW / 2, comboY + 36);
      ctx.textAlign = 'left';
    }

    // Shift Clock
    const shiftTime = Math.max(0, Math.ceil(state.shiftTimeRemaining || 90));
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1100, 150, 140, 68);
    ctx.strokeStyle = shiftTime < 20 ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(1100, 150, 140, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.fillText('SHIFT CLOCK', 1120, 172);

    ctx.fillStyle = shiftTime < 20 ? '#ef4444' : '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${shiftTime}s`, 1120, 204);
  }

  drawTitleScreen(ctx, bestScore) {
    ctx.fillStyle = 'rgba(11, 19, 41, 0.9)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.textAlign = 'center';

    // Title Logo
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 64px -apple-system, sans-serif';
    ctx.fillText('BISTRO RUSH', this.width / 2, 250);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px -apple-system, sans-serif';
    ctx.fillText('MASTER CHEF KITCHEN', this.width / 2, 300);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px -apple-system, sans-serif';
    ctx.fillText('Chop fresh produce, sear gourmet meats, craft artisan recipes & conquer dinner rush!', this.width / 2, 350);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('PRESS [SPACE] OR CLICK ANYWHERE TO START SERVICE', this.width / 2, 440);

    if (bestScore > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`🏆 MICHELIN STAR RECORD: $${bestScore}`, this.width / 2, 500);
    }

    ctx.restore();
  }

  drawPausedScreen(ctx) {
    ctx.fillStyle = 'rgba(11, 19, 41, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, sans-serif';
    ctx.fillText('SERVICE PAUSED', this.width / 2, this.height / 2);

    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Press [P] or click to resume culinary rush', this.width / 2, this.height / 2 + 50);
    ctx.restore();
  }

  drawGameOverScreen(ctx, state, bestScore) {
    ctx.fillStyle = 'rgba(11, 19, 41, 0.94)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.textAlign = 'center';

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 52px -apple-system, sans-serif';
    ctx.fillText('DINNER SERVICE COMPLETE!', this.width / 2, 210);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`FINAL REVENUE: $${state.orders.score}`, this.width / 2, 280);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillText(`Dishes Served: ${state.orders.servedCount}  |  Missed Orders: ${state.orders.missedCount}`, this.width / 2, 330);

    // Michelin Star Award
    const stars = state.orders.score >= 500 ? '⭐⭐⭐ 3-STAR MICHELIN RATING' : state.orders.score >= 250 ? '⭐⭐ 2-STAR POPULAR BISTRO' : '⭐ 1-STAR RISING CHEF';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText(stars, this.width / 2, 390);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('PRESS [SPACE] OR CLICK TO START A NEW SHIFT', this.width / 2, 470);

    ctx.restore();
  }
}
