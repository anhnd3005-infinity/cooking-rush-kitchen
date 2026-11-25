// Recipe definitions, ingredient properties, and step progression for Bistro Rush.

export const INGREDIENT_BUN = 'bun';
export const INGREDIENT_PATTY = 'patty';
export const INGREDIENT_PATTY_COOKED = 'patty_cooked';
export const INGREDIENT_CHEESE = 'cheese';
export const INGREDIENT_TOMATO = 'tomato';
export const INGREDIENT_TOMATO_SLICED = 'tomato_sliced';
export const INGREDIENT_LETTUCE = 'lettuce';
export const INGREDIENT_LETTUCE_CHOPPED = 'lettuce_chopped';

export const INGREDIENT_DOUGH = 'dough';
export const INGREDIENT_SAUCE = 'sauce';
export const INGREDIENT_MOZZARELLA = 'mozzarella';
export const INGREDIENT_PEPPERONI = 'pepperoni';
export const INGREDIENT_PEPPERONI_SLICED = 'pepperoni_sliced';
export const INGREDIENT_BASIL = 'basil';

export const INGREDIENT_NOODLES = 'noodles';
export const INGREDIENT_BROTH = 'broth';
export const INGREDIENT_PORK = 'pork';
export const INGREDIENT_PORK_SEARED = 'pork_seared';
export const INGREDIENT_EGG = 'egg';
export const INGREDIENT_SCALLION = 'scallion';
export const INGREDIENT_SCALLION_CHOPPED = 'scallion_chopped';

export const INGREDIENTS = {
  [INGREDIENT_BUN]: { name: 'Brioche Bun', category: 'pantry', color: '#e0a96d', icon: '🍞', hint: 'PLATE' },
  [INGREDIENT_PATTY]: { name: 'Raw Beef Patty', category: 'raw_grill', color: '#993d3d', target: INGREDIENT_PATTY_COOKED, icon: '🥩', hint: 'GRILL' },
  [INGREDIENT_PATTY_COOKED]: { name: 'Sizzled Patty', category: 'cooked', color: '#4a1e1e', icon: '🍔', hint: 'DONE' },
  [INGREDIENT_CHEESE]: { name: 'Aged Cheddar', category: 'pantry', color: '#ffb703', icon: '🧀', hint: 'PLATE' },
  [INGREDIENT_TOMATO]: { name: 'Vine Tomato', category: 'raw_chop', color: '#e63946', target: INGREDIENT_TOMATO_SLICED, icon: '🍅', hint: 'CHOP' },
  [INGREDIENT_TOMATO_SLICED]: { name: 'Tomato Slices', category: 'prepped', color: '#d90429', icon: '🍅', hint: 'DONE' },
  [INGREDIENT_LETTUCE]: { name: 'Crisp Lettuce', category: 'raw_chop', color: '#588157', target: INGREDIENT_LETTUCE_CHOPPED, icon: '🥬', hint: 'CHOP' },
  [INGREDIENT_LETTUCE_CHOPPED]: { name: 'Chopped Greens', category: 'prepped', color: '#3a5a40', icon: '🥗', hint: 'DONE' },

  [INGREDIENT_DOUGH]: { name: 'Pizza Crust', category: 'pantry', color: '#f6d8ac', icon: '🍕', hint: 'PLATE' },
  [INGREDIENT_SAUCE]: { name: 'Marinara Sauce', category: 'pantry', color: '#b91c1c', icon: '🥫', hint: 'PLATE' },
  [INGREDIENT_MOZZARELLA]: { name: 'Mozzarella', category: 'pantry', color: '#fef08a', icon: '🧀', hint: 'PLATE' },
  [INGREDIENT_PEPPERONI]: { name: 'Whole Pepperoni', category: 'raw_chop', color: '#9f1239', target: INGREDIENT_PEPPERONI_SLICED, icon: '🥓', hint: 'CHOP' },
  [INGREDIENT_PEPPERONI_SLICED]: { name: 'Pepperoni Slices', category: 'prepped', color: '#881337', icon: '🥓', hint: 'DONE' },
  [INGREDIENT_BASIL]: { name: 'Fresh Basil', category: 'pantry', color: '#15803d', icon: '🌿', hint: 'PLATE' },

  [INGREDIENT_NOODLES]: { name: 'Ramen Noodles', category: 'pantry', color: '#fde047', icon: '🍜', hint: 'PLATE' },
  [INGREDIENT_BROTH]: { name: 'Tonkotsu Broth', category: 'pantry', color: '#ca8a04', icon: '🍲', hint: 'PLATE' },
  [INGREDIENT_PORK]: { name: 'Chashu Belly', category: 'raw_grill', color: '#b45309', target: INGREDIENT_PORK_SEARED, icon: '🥩', hint: 'GRILL' },
  [INGREDIENT_PORK_SEARED]: { name: 'Seared Chashu', category: 'cooked', color: '#5f2305', icon: '🥓', hint: 'DONE' },
  [INGREDIENT_EGG]: { name: 'Ajitsuke Egg', category: 'pantry', color: '#fde68a', icon: '🥚', hint: 'PLATE' },
  [INGREDIENT_SCALLION]: { name: 'Green Scallion', category: 'raw_chop', color: '#22c55e', target: INGREDIENT_SCALLION_CHOPPED, icon: '🥢', hint: 'CHOP' },
  [INGREDIENT_SCALLION_CHOPPED]: { name: 'Minced Scallion', category: 'prepped', color: '#16a34a', icon: '🌱', hint: 'DONE' },
};

export const PANTRY_KEYS = [
  INGREDIENT_BUN,
  INGREDIENT_PATTY,
  INGREDIENT_CHEESE,
  INGREDIENT_TOMATO,
  INGREDIENT_LETTUCE,
  INGREDIENT_DOUGH,
  INGREDIENT_SAUCE,
  INGREDIENT_MOZZARELLA,
  INGREDIENT_PEPPERONI,
  INGREDIENT_BASIL,
  INGREDIENT_NOODLES,
  INGREDIENT_BROTH,
  INGREDIENT_PORK,
  INGREDIENT_EGG,
  INGREDIENT_SCALLION,
];

export const RECIPES = [
  {
    id: 'bistro_burger',
    name: 'Bistro Deluxe Burger',
    tagline: 'Smash patty with melted cheddar & garden greens',
    timeLimit: 38,
    points: 120,
    steps: [
      { text: 'Chop vine tomato into juicy slices', icon: '🍅' },
      { text: 'Chop lettuce into crisp green shreds', icon: '🥬' },
      { text: 'Sear beef patty on the sizzling griddle', icon: '🥩' },
      { text: 'Stack on toasted brioche with cheddar & bun', icon: '🍔' },
    ],
    requiredIngredients: [
      INGREDIENT_BUN,
      INGREDIENT_PATTY_COOKED,
      INGREDIENT_CHEESE,
      INGREDIENT_TOMATO_SLICED,
      INGREDIENT_LETTUCE_CHOPPED,
      INGREDIENT_BUN,
    ],
  },
  {
    id: 'artisan_pizza',
    name: 'Rustic Pepperoni Pizza',
    tagline: 'Woodfired thin crust with marinara & mozzarella',
    timeLimit: 42,
    points: 140,
    steps: [
      { text: 'Spread rich marinara sauce over hand-tossed dough', icon: '🥫' },
      { text: 'Scatter creamy shredded mozzarella cheese', icon: '🧀' },
      { text: 'Slice seasoned pepperoni sausage thinly', icon: '🔪' },
      { text: 'Garnish with fragrant sweet basil leaves', icon: '🌿' },
    ],
    requiredIngredients: [
      INGREDIENT_DOUGH,
      INGREDIENT_SAUCE,
      INGREDIENT_MOZZARELLA,
      INGREDIENT_PEPPERONI_SLICED,
      INGREDIENT_BASIL,
    ],
  },
  {
    id: 'tonkotsu_ramen',
    name: 'Tonkotsu Craft Ramen',
    tagline: 'Rich broth, springy noodles & seared chashu',
    timeLimit: 45,
    points: 160,
    steps: [
      { text: 'Ladle steaming golden bone broth into ceramic bowl', icon: '🍲' },
      { text: 'Fold in springy blanched ramen noodles', icon: '🍜' },
      { text: 'Sear chashu pork belly on griddle with grill marks', icon: '🥩' },
      { text: 'Top with jammy ajitsuke egg and minced scallions', icon: '🥚' },
    ],
    requiredIngredients: [
      INGREDIENT_BROTH,
      INGREDIENT_NOODLES,
      INGREDIENT_PORK_SEARED,
      INGREDIENT_EGG,
      INGREDIENT_SCALLION_CHOPPED,
    ],
  },
];
