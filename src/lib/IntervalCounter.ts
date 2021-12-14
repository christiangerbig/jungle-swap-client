import { setDelayCounter, setIntervalId } from "../reducer/jungleSwapSlice";

export class IntervalCounter {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }
  stop = (intervalId: NodeJS.Timeout): void => {
    clearInterval(intervalId);
    this.dispatch(setIntervalId(null));
    this.dispatch(setDelayCounter(0));
  };
}
