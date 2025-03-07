import { useState, useCallback } from "react";
import { RESET_TIMEOUT } from "../constants/gameConstants";

const useMapReset = () => {
  const [resetMap, setResetMap] = useState(false);
  const [resetClues, setResetClues] = useState(false);

  const resetMapAndClues = useCallback(() => {
    setResetMap(true);
    setResetClues(true);

    setTimeout(() => {
      setResetMap(false);
      setResetClues(false);
    }, RESET_TIMEOUT);
  }, []);

  return {
    resetMap,
    resetClues,
    resetMapAndClues,
  };
};

export default useMapReset;
