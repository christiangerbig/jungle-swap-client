import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setLoggedInUser,
  setIsNewRequest,
  setAmountOfRequests,
  setAmountOfReplies,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../typeDefinitions";
import { RootState } from "../../store";
import { IntervalCounter } from "../../lib/IntervalCounter";
import { Authentification } from "../../lib/authentification";

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
    const logOutUser = (): void => {
      const updateUserRequestsReplies = (loggedInUser: User): User => {
        const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
        clonedUser.amountOfRequests = amountOfRequests;
        clonedUser.amountOfReplies = amountOfReplies;
        dispatch(setLoggedInUser(clonedUser));
        return clonedUser;
      };

      const updateUserData = (loggedInUser: User): void => {
        const authentification = new Authentification(dispatch);
        authentification.logOut(loggedInUser, (): void => {
          const intervalCounter = new IntervalCounter(dispatch);
          intervalCounter.stop(intervalId as NodeJS.Timeout);
          dispatch(setIsNewRequest(false));
          dispatch(setAmountOfRequests(0));
          dispatch(setAmountOfReplies(0));
          history.push("/");
          scroll.scrollToTop();
        });
      };

      const updatedUser = updateUserRequestsReplies(loggedInUser as User);
      updateUserData(updatedUser);
    };

    logOutUser();
  }, []);

  return <div />;
};

export default LogOut;
