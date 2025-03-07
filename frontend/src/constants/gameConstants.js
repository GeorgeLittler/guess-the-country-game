// Number of rounds in a game
export const TOTAL_ROUNDS = 5;

// Maximum number of clues per round
export const MAX_CLUES_PER_ROUND = 3;

// Maximum usage of each category per game
export const MAX_CATEGORY_USAGE = 3;

// Points awarded based on number of clues seen
export const POINTS = {
  NO_CLUES: 5,
  ONE_CLUE: 3,
  TWO_CLUES: 2,
  THREE_CLUES: 1,
};

// Initial state for category usage
export const INITIAL_CATEGORY_USAGE = {
  Culture: 0,
  Geography: 0,
  History: 0,
  Politics: 0,
  "Random Knowledge": 0,
  Sport: 0,
};

// List of all categories
export const CATEGORIES = Object.keys(INITIAL_CATEGORY_USAGE);

// Initial available points
export const INITIAL_AVAILABLE_POINTS = POINTS.NO_CLUES;

// Initial user feedback
export const INITIAL_USER_FEEDBACK = "Complete this round to move on";

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "login/",
  REGISTER: "register/",
  COUNTRY: "countries/",
  CLUE_CATEGORY: "clue-categories/",
  RANDOM_COUNTRY: "countries/random/",
  GET_CLUE: (countryId) => `countries/${countryId}/get_clue/`,
  SUBMIT_CLUE: "submit-clue/",
};

// Timeout for resetting map and clues
export const RESET_TIMEOUT = 100; // milliseconds
