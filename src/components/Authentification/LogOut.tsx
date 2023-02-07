import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAuthentification } from "../../app/custom-hooks/useAuthentification";
import { useIntervalCounter } from "../../app/custom-hooks/useIntervalCounter";
import {
  setIsNewRequest,
  setAmountOfRequests,
  setAmountOfReplies,
  selectLoggedInUser,
  selectIntervalId,
  selectAmountOfRequests,
  selectAmountOfReplies,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../app/typeDefinitions";

const LogOut = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const intervalId = useAppSelector(selectIntervalId);
  const amountOfRequests = useAppSelector(selectAmountOfRequests);
  const amountOfReplies = useAppSelector(selectAmountOfReplies);
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { logOut, updateUserRequestsReplies } = useAuthentification();
  const { stopCounter } = useIntervalCounter();
  const { scrollToTop } = scroll;

  useEffect(() => {
    const updatedUser = updateUserRequestsReplies(
      loggedInUser as User,
      amountOfRequests,
      amountOfReplies
    );
    logOut(updatedUser, (): void => {
      stopCounter(intervalId as NodeJS.Timeout);
      dispatch(setIsNewRequest(false));
      dispatch(setAmountOfRequests(0));
      dispatch(setAmountOfReplies(0));
      push("/");
      scrollToTop();
    });
  }, []);

  return <div />;
};

export default LogOut;
