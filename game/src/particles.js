// Dynamic particle effects for kitchen cooking: smoke, steam, sizzling grease sparks, and service stars.

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emitSteam(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: -20 - Math.random() * 25,
        size: 8 + Math.random() * 8,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        color: 'rgba(240, 245, 255, 0.45)',
        type: 'steam',
      });
    }
  }

  emitSizzle(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 24 - 12),
        y: y + (Math.random() * 12 - 6),
        vx: (Math.random() - 0.5) * 60,
        vy: -30 - Math.random() * 50,
        size: 2.5 + Math.random() * 2.5,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        color: Math.random() > 0.4 ? '#ffb703' : '#fb8500',
        type: 'sizzle',
      });
    }
  }

  emitChop(x, y, color = '#e63946', count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 90,
        vy: -40 - Math.random() * 60,
        size: 3 + Math.random() * 3,
        life: 0.4 + Math.random() * 0.2,
        maxLife: 0.6,
        color: color,
        type: 'chop',
      });
    }
  }

  emitServeStars(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 60 + Math.random() * 70;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        life: 0.6 + Math.random() * 0.3,
        maxLife: 0.9,
        color: '#ffd166',
        type: 'star',
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'chop' || p.type === 'sizzle') {
        p.vy += 120 * dt; // gravity
      } else if (p.type === 'steam') {
        p.size += dt * 8; // expand
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      if (p.type === 'steam') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((1 - alpha) * Math.PI * 2);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
