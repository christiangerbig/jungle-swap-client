import { useAppDispatch } from "../hooks";
import { setDelayCounter, setIntervalId } from "../../reducer/jungleSwapSlice";

interface IntervalCounterMethods {
  stopCounter: (intervalId: NodeJS.Timeout) => void;
}

export const useIntervalCounter = (): IntervalCounterMethods => {
  const dispatch = useAppDispatch();

  return {
    stopCounter: (intervalId: NodeJS.Timeout): void => {
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setDelayCounter(0));
    },
  };
};
