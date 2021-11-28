import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setLoggedInUser,
  logOut,
  setIsNewRequest,
  setAmountOfRequests,
  setAmountOfReplies,
  setIntervalId,
  setDelayCounter,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";
import { RootState } from "../store";

const LogOut = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const intervalId = useAppSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const amountOfReplies = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfReplies
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Update user amount of requests/replies, log out and stop interval as soon as page loads
  useEffect(() => {
    const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
    clonedUser.amountOfRequests = amountOfRequests;
    clonedUser.amountOfReplies = amountOfReplies;
    dispatch(setLoggedInUser(clonedUser));
    dispatch(logOut(clonedUser))
      .unwrap()
      .then(() => {
        dispatch(setLoggedInUser(null));
        if (intervalId) {
          clearInterval(intervalId);
          dispatch(setIntervalId(null));
          dispatch(setDelayCounter(0));
        }
        dispatch(setIsNewRequest(false));
        dispatch(setAmountOfRequests(0));
        dispatch(setAmountOfReplies(0));
        history.push("/");
        scroll.scrollToTop();
      });
  }, []);

  return <div />;
};

export default LogOut;
