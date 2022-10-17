import { useAppDispatch } from "../hooks";
import { setDelayCounter, setIntervalId } from "../reducer/jungleSwapSlice";

type IntervalCounter = {
  stop: Function;
};

export const useIntervalCounter = (): IntervalCounter => {
  const dispatch = useAppDispatch();
  const intervalCounter = {
    stop(intervalId: NodeJS.Timeout): void {
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setDelayCounter(0));
    },
  };
  return intervalCounter;
};
