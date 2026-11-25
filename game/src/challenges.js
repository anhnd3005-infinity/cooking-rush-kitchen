// Challenge modifier and game modes system for Bistro Rush: Master Chef.
// Configures special shift environments with custom modifiers, customer patience, and score multipliers.

export const CHALLENGE_STANDARD = 'standard';
export const CHALLENGE_LUNCH_RUSH = 'lunch_rush';
export const CHALLENGE_CRITIC_TABLE = 'critic_table';
export const CHALLENGE_VEGETARIAN = 'vegetarian';
export const CHALLENGE_SPEED_RUN = 'speed_run';

export const SHIFT_CHALLENGES = {
  [CHALLENGE_STANDARD]: {
    id: CHALLENGE_STANDARD,
    title: 'Standard Dinner Service',
    description: 'Balanced culinary rush with standard customer patience and steady orders.',
    timeMultiplier: 1.0,
    scoreMultiplier: 1.0,
    allowedRecipes: ['bistro_burger', 'artisan_pizza', 'tonkotsu_ramen'],
    badge: '🍽️',
  },
  [CHALLENGE_LUNCH_RUSH]: {
    id: CHALLENGE_LUNCH_RUSH,
    title: 'Lunch Rush Madness',
    description: 'Patience drains 25% faster, but all successful deliveries earn 2x tips.',
    timeMultiplier: 0.75,
    scoreMultiplier: 2.0,
    allowedRecipes: ['bistro_burger', 'artisan_pizza', 'tonkotsu_ramen'],
    badge: '⚡',
  },
  [CHALLENGE_CRITIC_TABLE]: {
    id: CHALLENGE_CRITIC_TABLE,
    title: 'Food Critic Inspection',
    description: 'High-stakes VIP guests demand meticulous execution for a 3x prestige bonus.',
    timeMultiplier: 0.9,
    scoreMultiplier: 3.0,
    allowedRecipes: ['bistro_burger', 'artisan_pizza', 'tonkotsu_ramen'],
    badge: '🧐',
  },
  [CHALLENGE_VEGETARIAN]: {
    id: CHALLENGE_VEGETARIAN,
    title: 'Botanical Garden Gala',
    description: 'Focus strictly on plant-based prep: extra points for fresh herbs and garden toppings.',
    timeMultiplier: 1.1,
    scoreMultiplier: 1.5,
    allowedRecipes: ['artisan_pizza'],
    badge: '🌱',
  },
  [CHALLENGE_SPEED_RUN]: {
    id: CHALLENGE_SPEED_RUN,
    title: '60-Second Flash Shift',
    description: 'Ultra-compressed sixty-second culinary frenzy with relentless order incoming.',
    timeMultiplier: 0.65,
    scoreMultiplier: 2.5,
    allowedRecipes: ['bistro_burger', 'artisan_pizza', 'tonkotsu_ramen'],
    badge: '⏱️',
  },
};

export class ChallengeEngine {
  constructor(mode = CHALLENGE_STANDARD) {
    this.currentMode = mode;
    this.config = SHIFT_CHALLENGES[mode] || SHIFT_CHALLENGES[CHALLENGE_STANDARD];
  }

  setChallenge(mode) {
    if (SHIFT_CHALLENGES[mode]) {
      this.currentMode = mode;
      this.config = SHIFT_CHALLENGES[mode];
      return true;
    }
    return false;
  }

  getAdjustedPatience(baseTime) {
    return Math.round(baseTime * this.config.timeMultiplier);
  }

  getAdjustedScore(basePoints) {
    return Math.round(basePoints * this.config.scoreMultiplier);
  }

  isRecipeAllowed(recipeId) {
    return this.config.allowedRecipes.includes(recipeId);
  }

  getSummary() {
    return {
      mode: this.currentMode,
      title: this.config.title,
      badge: this.config.badge,
      timeScale: this.config.timeMultiplier,
      scoreScale: this.config.scoreMultiplier,
    };
  }
}
