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
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";
import { RootState } from "../store";
import { stopIntervalCounter } from "../lib/utilities";

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

  useEffect(() => {
    // Reset variables
    const resetVariables = (): void => {
      dispatch(setIsNewRequest(false));
      dispatch(setAmountOfRequests(0));
      dispatch(setAmountOfReplies(0));
    };

    // Update user amount of requests/replies
    const logOutUser = (
      loggedInUser: User | null,
      intervalId: NodeJS.Timeout | null
    ) => {
      const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
      clonedUser.amountOfRequests = amountOfRequests;
      clonedUser.amountOfReplies = amountOfReplies;
      dispatch(setLoggedInUser(clonedUser));
      dispatch(logOut(clonedUser))
        .unwrap()
        .then(() => {
          dispatch(setLoggedInUser(null));
          intervalId && stopIntervalCounter(intervalId, dispatch);
          resetVariables();
          history.push("/");
          scroll.scrollToTop();
        });
    };

    logOutUser(loggedInUser, intervalId);
  }, []);

  return <div />;
};

export default LogOut;
