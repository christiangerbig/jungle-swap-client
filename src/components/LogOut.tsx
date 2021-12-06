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
    const logOutUser = (
      loggedInUser: User,
      intervalId: NodeJS.Timeout
    ): void => {
      const updateUserRequestsAndReplies = (loggedInUser: User): User => {
        const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
        clonedUser.amountOfRequests = amountOfRequests;
        clonedUser.amountOfReplies = amountOfReplies;
        dispatch(setLoggedInUser(clonedUser));
        return clonedUser;
      };

      const saveUserData = (loggedInUser: User): void => {
        const resetUserVariablesAndReturnToHomePage = (
          intervalId: NodeJS.Timeout
        ): void => {
          const resetRequestAndReplyVariables = (): void => {
            dispatch(setIsNewRequest(false));
            dispatch(setAmountOfRequests(0));
            dispatch(setAmountOfReplies(0));
          };

          const returnToHomePage = (): void => {
            history.push("/");
            scroll.scrollToTop();
          };

          dispatch(setLoggedInUser(null));
          stopIntervalCounter(intervalId, dispatch);
          resetRequestAndReplyVariables();
          returnToHomePage();
        };

        dispatch(logOut(loggedInUser))
          .unwrap()
          .then(() => {
            resetUserVariablesAndReturnToHomePage(intervalId);
          });
      };

      const updatedUser = updateUserRequestsAndReplies(loggedInUser);
      saveUserData(updatedUser);
    };

    if (loggedInUser && intervalId) {
      logOutUser(loggedInUser, intervalId);
    }
  }, []);

  return <div />;
};

export default LogOut;
