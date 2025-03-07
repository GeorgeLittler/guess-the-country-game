import { useReducer, useCallback, useMemo } from "react";
import {
  POINTS,
  INITIAL_CATEGORY_USAGE,
  MAX_CATEGORY_USAGE,
} from "../constants/gameConstants";
import { fetchClue } from "../services/api";

// useGameScore hook
export const useGameScore = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_SCORE":
          return { ...state, score: action.payload };
        case "ADD_POINTS":
          return { ...state, score: state.score + action.payload };
        case "RESET_SCORE":
          return { ...state, score: 0 };
        default:
          return state;
      }
    },
    { score: 0 }
  );

  const setScore = useCallback((score) => {
    dispatch({ type: "SET_SCORE", payload: score });
  }, []);

  const addPoints = useCallback((points) => {
    dispatch({ type: "ADD_POINTS", payload: points });
  }, []);

  const resetScore = useCallback(() => {
    dispatch({ type: "RESET_SCORE" });
  }, []);

  return { score: state.score, setScore, addPoints, resetScore };
};

// useGameRound hook
export const useGameRound = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_ROUND":
          return { ...state, round: action.payload };
        case "INCREMENT_ROUND":
          return { ...state, round: state.round + 1 };
        case "RESET_ROUND":
          return { ...state, round: 0 };
        default:
          return state;
      }
    },
    { round: 0 }
  );

  const setRound = useCallback((round) => {
    dispatch({ type: "SET_ROUND", payload: round });
  }, []);

  const incrementRound = useCallback(() => {
    dispatch({ type: "INCREMENT_ROUND" });
  }, []);

  const resetRound = useCallback(() => {
    dispatch({ type: "RESET_ROUND" });
  }, []);

  return { round: state.round, setRound, incrementRound, resetRound };
};

// useGameClues hook
export const useGameClues = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_CLUES":
          return { ...state, clues: action.payload };
        case "ADD_CLUE":
          return {
            ...state,
            clues: {
              ...state.clues,
              [action.payload.category]: action.payload.clue,
            },
            categoryUsage: {
              ...state.categoryUsage,
              [action.payload.category]:
                (state.categoryUsage[action.payload.category] || 0) + 1,
            },
          };
        case "RESET_CLUES":
          return { ...state, clues: {}, categoryUsage: INITIAL_CATEGORY_USAGE };
        default:
          return state;
      }
    },
    { clues: {}, categoryUsage: INITIAL_CATEGORY_USAGE }
  );

  const addClue = useCallback(
    async (countryId, category) => {
      if (state.categoryUsage[category] >= MAX_CATEGORY_USAGE) {
        throw new Error(
          `Category ${category} has been used the maximum number of times.`
        );
      }
      const clueData = await fetchClue(countryId, category);
      dispatch({ type: "ADD_CLUE", payload: { category, clue: clueData } });
      return clueData;
    },
    [state.categoryUsage]
  );

  const resetClues = useCallback(() => {
    dispatch({ type: "RESET_CLUES" });
  }, []);

  const calculateAvailablePoints = useMemo(() => {
    const numClues = Object.keys(state.clues).length;
    switch (numClues) {
      case 0:
        return POINTS.NO_CLUES;
      case 1:
        return POINTS.ONE_CLUE;
      case 2:
        return POINTS.TWO_CLUES;
      default:
        return POINTS.THREE_CLUES;
    }
  }, [state.clues]);

  return {
    clues: state.clues,
    categoryUsage: state.categoryUsage,
    addClue,
    resetClues,
    availablePoints: calculateAvailablePoints,
  };
};

// useGameError hook
export const useGameError = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_ERROR":
          return { ...state, error: action.payload };
        case "CLEAR_ERROR":
          return { ...state, error: null };
        default:
          return state;
      }
    },
    { error: null }
  );

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return { error: state.error, setError, clearError };
};
