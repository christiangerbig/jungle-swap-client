import { useAppDispatch } from "../hooks";
import { setDelayCounter, setIntervalId } from "../../reducer/jungleSwapSlice";

interface IntervalCounter {
  stopCounter: Function;
}

export const useIntervalCounter = (): IntervalCounter => {
  const dispatch = useAppDispatch();

  const intervalCounter = {
    stopCounter: (intervalId: NodeJS.Timeout): void => {
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setDelayCounter(0));
    },
  };
  return intervalCounter;
};
