import { useReducer, useEffect, useRef, useCallback, useMemo } from "react";
import { fetchRandomCountry, fetchClue } from "../services/api";
import useMapReset from "./useMapReset";
import {
  POINTS,
  INITIAL_CATEGORY_USAGE,
  INITIAL_AVAILABLE_POINTS,
  INITIAL_USER_FEEDBACK,
  MAX_CATEGORY_USAGE,
} from "../constants/gameConstants";

// Defines constants for action types - used to identify different actions that can be dispatched to update the state
const SET_ROUND = "SET_ROUND";
const SET_SCORE = "SET_SCORE";
const SET_USER_FEEDBACK = "SET_USER_FEEDBACK";
const SET_HAS_SUBMITTED = "SET_HAS_SUBMITTED";
const SET_CORRECT_ANSWER = "SET_CORRECT_ANSWER";
const SET_CLUES_AND_POINTS_AND_USAGE = "SET_CLUES_AND_POINTS_AND_USAGE";
const RESET_GAME = "RESET_GAME";
const SET_ERROR = "SET_ERROR";

// Define initial state
const initialState = {
  round: 0,
  score: 0,
  userFeedback: INITIAL_USER_FEEDBACK,
  hasSubmitted: false,
  correctAnswer: null,
  clues: {},
  availablePoints: INITIAL_AVAILABLE_POINTS,
  categoryUsage: INITIAL_CATEGORY_USAGE,
  error: null,
};

// Defines reducer function - it takes the current state and an action as parameters and returns a new state based on the action type
function gameReducer(state, action) {
  switch (action.type) {
    case SET_ROUND:
      return { ...state, round: action.payload };
    case SET_SCORE:
      return { ...state, score: action.payload };
    case SET_USER_FEEDBACK:
      return { ...state, userFeedback: action.payload };
    case SET_HAS_SUBMITTED:
      return { ...state, hasSubmitted: action.payload };
    case SET_CORRECT_ANSWER:
      return { ...state, correctAnswer: action.payload };
    case SET_CLUES_AND_POINTS_AND_USAGE:
      return {
        ...state,
        clues: action.payload.clues,
        availablePoints: action.payload.availablePoints,
        categoryUsage: action.payload.categoryUsage,
      };
    case RESET_GAME:
      return initialState;
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState); // an alternative to useState - for more complex state logic
  const hasFetchedInitialCountry = useRef(false);

  const { resetMap, resetClues, resetMapAndClues } = useMapReset();

  const getRandomCountry = useCallback(async () => {
    try {
      const randomCountry = await fetchRandomCountry();
      dispatch({ type: SET_CORRECT_ANSWER, payload: randomCountry });
      dispatch({ type: SET_ERROR, payload: null }); // Clear any existing errors
    } catch (error) {
      console.error("Error fetching random country:", error);
      dispatch({
        type: SET_ERROR,
        payload: "Failed to fetch a random country. Please try again.",
      });
    }
  }, []);

  const getClue = useCallback(
    async (countryId, category) => {
      if (state.categoryUsage[category] >= MAX_CATEGORY_USAGE) {
        dispatch({
          type: SET_ERROR,
          payload: `Category ${category} has been used the maximum number of times.`,
        });
        return;
      }

      try {
        const clueData = await fetchClue(countryId, category);
        const newClues = { ...state.clues, [category]: clueData };
        const numClues = Object.keys(newClues).length;
        let newAvailablePoints;

        switch (numClues) {
          case 0:
            newAvailablePoints = POINTS.NO_CLUES;
            break;
          case 1:
            newAvailablePoints = POINTS.ONE_CLUE;
            break;
          case 2:
            newAvailablePoints = POINTS.TWO_CLUES;
            break;
          default:
            newAvailablePoints = POINTS.THREE_CLUES;
        }

        const newCategoryUsage = {
          ...state.categoryUsage,
          [category]: state.categoryUsage[category] + 1,
        };

        dispatch({
          type: SET_CLUES_AND_POINTS_AND_USAGE,
          payload: {
            clues: newClues,
            availablePoints: newAvailablePoints,
            categoryUsage: newCategoryUsage,
          },
        });

        dispatch({ type: SET_ERROR, payload: null }); // Clear any existing errors
      } catch (error) {
        console.error(`Error fetching clue for country ${countryId}:`, error);
        dispatch({
          type: SET_ERROR,
          payload: "Failed to fetch clue. Please try again.",
        });
      }
    },
    [state.categoryUsage, state.clues]
  );

  useEffect(() => {
    if (!hasFetchedInitialCountry.current) {
      getRandomCountry();
      hasFetchedInitialCountry.current = true;
    }
  }, [getRandomCountry]);

  const handleSubmit = useCallback(
    (selectedCountry) => {
      dispatch({ type: SET_HAS_SUBMITTED, payload: true });
      if (selectedCountry === state.correctAnswer.name) {
        dispatch({ type: SET_USER_FEEDBACK, payload: "Correct!" });
        dispatch({
          type: SET_SCORE,
          payload: state.score + state.availablePoints,
        });
      } else {
        dispatch({
          type: SET_USER_FEEDBACK,
          payload: `Incorrect. The correct answer was ${state.correctAnswer.name}.`,
        });
      }
    },
    [state.correctAnswer, state.availablePoints, state.score]
  );

  const handleNextRoundAndResetMapAndClues = useCallback(() => {
    dispatch({ type: SET_ROUND, payload: state.round + 1 });
    dispatch({ type: SET_USER_FEEDBACK, payload: INITIAL_USER_FEEDBACK });
    dispatch({ type: SET_HAS_SUBMITTED, payload: false });
    dispatch({
      type: SET_CLUES_AND_POINTS_AND_USAGE,
      payload: {
        clues: {},
        availablePoints: INITIAL_AVAILABLE_POINTS,
        categoryUsage: state.categoryUsage,
      },
    });
    resetMapAndClues();
    getRandomCountry();
  }, [getRandomCountry, resetMapAndClues, state.round, state.categoryUsage]);

  const resetGame = useCallback(() => {
    dispatch({ type: RESET_GAME });
    resetMapAndClues();
    getRandomCountry();
  }, [getRandomCountry, resetMapAndClues]);

  const displayError = useCallback(() => {
    if (state.error) {
      alert(state.error);
      dispatch({ type: SET_ERROR, payload: null });
    }
  }, [state.error]);

  return useMemo(
    () => ({
      ...state,
      handleSubmit,
      handleNextRoundAndResetMapAndClues,
      fetchClue: getClue,
      resetGame,
      resetMap,
      resetClues,
      displayError,
    }),
    [
      state,
      handleSubmit,
      handleNextRoundAndResetMapAndClues,
      getClue,
      resetGame,
      resetMap,
      resetClues,
      displayError,
    ]
  );
};

export default useGameState;
