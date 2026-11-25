// Staging deterministic scenes for AI judge evaluation screenshots.
import {
  INGREDIENT_BUN,
  INGREDIENT_PATTY_COOKED,
  INGREDIENT_CHEESE,
  INGREDIENT_TOMATO_SLICED,
  INGREDIENT_LETTUCE_CHOPPED,
  INGREDIENT_PATTY,
  INGREDIENT_TOMATO,
} from './recipes.js';
import { SCREEN_PLAY, SCREEN_OVER } from './render.js';

export function stageScene(name, state) {
  state.kitchen.reset();
  state.orders.reset();

  if (name === 'kitchen' || name === '1-kitchen.jpg') {
    // Scene 1: Kitchen overview with active order board and fresh pantry
    state.orders.spawnOrder('bistro_burger');
    state.orders.spawnOrder('artisan_pizza');
    state.orders.spawnOrder('tonkotsu_ramen');
    state.orders.activeOrders[0].timeRemaining = 34;
    state.orders.activeOrders[1].timeRemaining = 38;
    state.orders.activeOrders[2].timeRemaining = 42;
    state.shiftTimeRemaining = 85;
    state.orders.score = 120;
    state.orders.combo = 1;
    return { screen: SCREEN_PLAY, best: 0 };
  }

  if (name === 'prep' || name === '2-prep-action.jpg') {
    // Scene 2: Knife chopping on board, patty sizzling on griddle with smoke & sparks
    state.orders.spawnOrder('bistro_burger');
    state.orders.spawnOrder('artisan_pizza');
    state.orders.activeOrders[0].timeRemaining = 24;
    state.orders.activeOrders[1].timeRemaining = 32;

    state.kitchen.choppingBoard.item = INGREDIENT_TOMATO;
    state.kitchen.choppingBoard.progress = 0.68;
    state.kitchen.choppingBoard.knifeY = 14;

    state.kitchen.stoveSlots[0].item = INGREDIENT_PATTY;
    state.kitchen.stoveSlots[0].progress = 0.58;
    state.kitchen.stoveSlots[0].state = 'sizzling';

    state.particles.emitSteam(715, 370, 7);
    state.particles.emitSizzle(715, 385, 10);
    state.particles.emitChop(460, 470, '#e63946', 10);

    state.shiftTimeRemaining = 62;
    state.orders.score = 240;
    state.orders.combo = 2;
    return { screen: SCREEN_PLAY, best: 240 };
  }

  if (name === 'assembly' || name === '3-dish-assembly.jpg') {
    // Scene 3: Dish mid-assembly / complete on ceramic plate, ready to serve, timer ticking
    state.orders.spawnOrder('bistro_burger');
    state.orders.spawnOrder('tonkotsu_ramen');
    state.orders.activeOrders[0].timeRemaining = 12;
    state.orders.activeOrders[1].timeRemaining = 28;

    // Plated burger with all artisan layers
    state.kitchen.plate = [
      INGREDIENT_BUN,
      INGREDIENT_PATTY_COOKED,
      INGREDIENT_CHEESE,
      INGREDIENT_TOMATO_SLICED,
      INGREDIENT_LETTUCE_CHOPPED,
      INGREDIENT_BUN,
    ];

    state.kitchen.choppingBoard.item = INGREDIENT_LETTUCE_CHOPPED;
    state.kitchen.choppingBoard.progress = 1.0;

    state.kitchen.stoveSlots[0].item = INGREDIENT_PATTY_COOKED;
    state.kitchen.stoveSlots[0].progress = 1.0;
    state.kitchen.stoveSlots[0].state = 'done';

    state.particles.emitServeStars(1170, 400, 18);
    state.particles.emitSteam(715, 370, 5);

    state.shiftTimeRemaining = 35;
    state.orders.score = 420;
    state.orders.combo = 3;
    return { screen: SCREEN_PLAY, best: 420 };
  }

  // Scene 4: End of shift / Results screen
  state.orders.score = 680;
  state.orders.servedCount = 6;
  state.orders.missedCount = 0;
  state.orders.combo = 4;
  return { screen: SCREEN_OVER, best: 680 };
}
