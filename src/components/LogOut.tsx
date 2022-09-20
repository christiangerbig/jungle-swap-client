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
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";
import { RootState } from "../store";
import { IntervalCounter } from "../lib/IntervalCounter";

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
    const logOutUser = (
      loggedInUser: User,
      intervalId: NodeJS.Timeout
    ): void => {
      const updateUserRequestsReplies = (loggedInUser: User): User => {
        const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
        clonedUser.amountOfRequests = amountOfRequests;
        clonedUser.amountOfReplies = amountOfReplies;
        dispatch(setLoggedInUser(clonedUser));
        return clonedUser;
      };

      const updateUserData = (loggedInUser: User): void => {
        const resetRequestReplyVariablesAndReturnToHomePage = (
          intervalId: NodeJS.Timeout
        ): void => {
          const resetRequestReplyVariables = (): void => {
            dispatch(setIsNewRequest(false));
            dispatch(setAmountOfRequests(0));
            dispatch(setAmountOfReplies(0));
          };

          const returnToHomePage = (): void => {
            history.push("/");
            scroll.scrollToTop();
          };

          dispatch(setLoggedInUser(null));
          const intervalCounter = new IntervalCounter(dispatch);
          intervalCounter.stop(intervalId);
          resetRequestReplyVariables();
          returnToHomePage();
        };

        dispatch(logOut(loggedInUser))
          .unwrap()
          .then(() => {
            resetRequestReplyVariablesAndReturnToHomePage(intervalId);
          })
          .catch((rejectedValue: any) => {
            dispatch(setErrorMessage(rejectedValue.message));
          });
      };

      const updatedUser = updateUserRequestsReplies(loggedInUser);
      updateUserData(updatedUser);
    };

    logOutUser(loggedInUser as User, intervalId as NodeJS.Timeout);
  }, []);

  return <div />;
};

export default LogOut;
