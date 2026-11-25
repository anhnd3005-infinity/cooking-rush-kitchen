// Order queue management, ticket timers, combo multipliers and service scoring.
import { RECIPES } from './recipes.js';
import { playOrderTicketChime, playTimerWarning } from './audio.js';

export class OrderManager {
  constructor() {
    this.activeOrders = [];
    this.maxOrders = 3;
    this.nextTicketId = 1;
    this.orderSpawnTimer = 0;
    this.spawnInterval = 14;
    this.servedCount = 0;
    this.missedCount = 0;
    this.score = 0;
    this.combo = 1;
  }

  reset() {
    this.activeOrders = [];
    this.nextTicketId = 1;
    this.orderSpawnTimer = 2; // quick initial spawn
    this.servedCount = 0;
    this.missedCount = 0;
    this.score = 0;
    this.combo = 1;
  }

  spawnOrder(recipeId = null) {
    if (this.activeOrders.length >= this.maxOrders) return null;
    let recipe;
    if (recipeId) {
      recipe = RECIPES.find((r) => r.id === recipeId) || RECIPES[0];
    } else {
      recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    }

    const order = {
      ticketId: this.nextTicketId++,
      recipe: recipe,
      timeRemaining: recipe.timeLimit,
      totalTime: recipe.timeLimit,
      warned: false,
    };
    this.activeOrders.push(order);
    playOrderTicketChime();
    return order;
  }

  update(dt) {
    this.orderSpawnTimer -= dt;
    if (this.orderSpawnTimer <= 0 && this.activeOrders.length < this.maxOrders) {
      this.spawnOrder();
      this.orderSpawnTimer = this.spawnInterval;
    }

    // Update timers
    for (let i = this.activeOrders.length - 1; i >= 0; i--) {
      const order = this.activeOrders[i];
      order.timeRemaining -= dt;

      if (!order.warned && order.timeRemaining <= 10) {
        order.warned = true;
        playTimerWarning();
      }

      if (order.timeRemaining <= 0) {
        // Expired order
        this.activeOrders.splice(i, 1);
        this.missedCount++;
        this.combo = 1;
      }
    }
  }

  /** Check if current plate matches any active order */
  matchesOrder(plateIngredients) {
    for (let i = 0; i < this.activeOrders.length; i++) {
      const order = this.activeOrders[i];
      const req = order.recipe.requiredIngredients;
      if (plateIngredients.length !== req.length) continue;
      let match = true;
      for (let j = 0; j < req.length; j++) {
        if (plateIngredients[j] !== req[j]) {
          match = false;
          break;
        }
      }
      if (match) return { index: i, order: order };
    }
    return null;
  }

  deliverPlate(plateIngredients) {
    const match = this.matchesOrder(plateIngredients);
    if (!match) return null;

    const { index, order } = match;
    this.activeOrders.splice(index, 1);

    // Speed bonus calculation
    const speedRatio = Math.max(0, order.timeRemaining / order.totalTime);
    const speedBonus = Math.round(speedRatio * 50);
    const orderPoints = (order.recipe.points + speedBonus) * this.combo;

    this.score += orderPoints;
    this.servedCount++;
    this.combo = Math.min(5, this.combo + 1);

    return {
      points: orderPoints,
      combo: this.combo,
      recipeName: order.recipe.name,
    };
  }
}
