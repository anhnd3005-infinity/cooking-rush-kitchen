// Achievement and culinary accolade system for Bistro Rush: Master Chef.
// Tracks real-time chef performance, speed milestones, plating precision, and award unlocks.

export const BADGE_SPEED_DEMON = 'speed_demon';
export const BADGE_SEAR_PRODIGY = 'sear_prodigy';
export const BADGE_MICHELIN_STAR = 'michelin_star';
export const BADGE_ZERO_WASTE = 'zero_waste';
export const BADGE_COMBO_KING = 'combo_king';
export const BADGE_KNIFE_MASTER = 'knife_master';
export const BADGE_PERFECT_SHIFT = 'perfect_shift';

export const ACHIEVEMENTS = [
  {
    id: BADGE_SPEED_DEMON,
    name: 'Speed Demon',
    description: 'Deliver an artisan order with more than 60% remaining patience.',
    icon: '⚡',
    rewardPoints: 150,
    check: (stats) => stats.fastestOrderRatio >= 0.6,
  },
  {
    id: BADGE_SEAR_PRODIGY,
    name: 'Sear Prodigy',
    description: 'Cook 5 meat items to golden doneness without burning.',
    icon: '🔥',
    rewardPoints: 200,
    check: (stats) => stats.perfectSearCount >= 5,
  },
  {
    id: BADGE_MICHELIN_STAR,
    name: 'Michelin Star Prestige',
    description: 'Reach a dinner service revenue exceeding $500.',
    icon: '⭐',
    rewardPoints: 300,
    check: (stats) => stats.totalRevenue >= 500,
  },
  {
    id: BADGE_ZERO_WASTE,
    name: 'Zero Waste Kitchen',
    description: 'Complete a full dinner service with 0 discarded ingredients.',
    icon: '🌿',
    rewardPoints: 180,
    check: (stats) => stats.shiftComplete && stats.discardedCount === 0,
  },
  {
    id: BADGE_COMBO_KING,
    name: 'Combo King',
    description: 'Achieve and maintain a maximum 5x Rush combo multiplier.',
    icon: '👑',
    rewardPoints: 250,
    check: (stats) => stats.maxComboStreak >= 5,
  },
  {
    id: BADGE_KNIFE_MASTER,
    name: 'Julienne Master',
    description: 'Perform 20 rapid ingredient chops on the end-grain cutting board.',
    icon: '🔪',
    rewardPoints: 120,
    check: (stats) => stats.totalChopsCount >= 20,
  },
  {
    id: BADGE_PERFECT_SHIFT,
    name: 'Flawless Dinner Service',
    description: 'Serve at least 6 gourmet orders without a single customer walkout.',
    icon: '🏆',
    rewardPoints: 500,
    check: (stats) => stats.servedCount >= 6 && stats.missedCount === 0,
  },
];

export class AchievementTracker {
  constructor() {
    this.unlocked = new Set();
    this.recentUnlocks = [];
    this.stats = {
      totalRevenue: 0,
      servedCount: 0,
      missedCount: 0,
      discardedCount: 0,
      perfectSearCount: 0,
      totalChopsCount: 0,
      maxComboStreak: 1,
      fastestOrderRatio: 0,
      shiftComplete: false,
    };
  }

  reset() {
    this.unlocked.clear();
    this.recentUnlocks = [];
    this.stats = {
      totalRevenue: 0,
      servedCount: 0,
      missedCount: 0,
      discardedCount: 0,
      perfectSearCount: 0,
      totalChopsCount: 0,
      maxComboStreak: 1,
      fastestOrderRatio: 0,
      shiftComplete: false,
    };
  }

  recordChop() {
    this.stats.totalChopsCount++;
    this.evaluate();
  }

  recordSear() {
    this.stats.perfectSearCount++;
    this.evaluate();
  }

  recordDiscard() {
    this.stats.discardedCount++;
  }

  recordDelivery(order, timeRemaining, totalTime, score, combo) {
    this.stats.servedCount++;
    this.stats.totalRevenue = score;
    const ratio = Math.max(0, timeRemaining / totalTime);
    if (ratio > this.stats.fastestOrderRatio) {
      this.stats.fastestOrderRatio = ratio;
    }
    if (combo > this.stats.maxComboStreak) {
      this.stats.maxComboStreak = combo;
    }
    this.evaluate();
  }

  recordShiftEnd(missedCount, finalScore) {
    this.stats.shiftComplete = true;
    this.stats.missedCount = missedCount;
    this.stats.totalRevenue = finalScore;
    this.evaluate();
  }

  evaluate() {
    for (const achievement of ACHIEVEMENTS) {
      if (!this.unlocked.has(achievement.id) && achievement.check(this.stats)) {
        this.unlocked.add(achievement.id);
        this.recentUnlocks.push({
          ...achievement,
          unlockedAt: Date.now(),
        });
      }
    }
  }

  getUnlockedBadges() {
    return ACHIEVEMENTS.filter((a) => this.unlocked.has(a.id));
  }

  drainRecentAlerts() {
    const alerts = [...this.recentUnlocks];
    this.recentUnlocks = [];
    return alerts;
  }
}
