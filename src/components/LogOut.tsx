import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logOut, setUser, User } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const LogOut = (): JSX.Element => {
  const loggedInUser = useAppSelector((state: RootState) => state.jungleSwap.loggedInUser);
  const intervalId: any = useAppSelector(
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

// Update user and log out as soon as page loads
  useEffect(() => {
    const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
    clonedUser.amountOfRequests = amountOfRequests;
    clonedUser.amountOfReplies = amountOfReplies;
    dispatch(setUser(clonedUser));
    dispatch(logOut({ user: clonedUser, intervalId, history }));
  }, []);

  return <div />;
};

export default LogOut;
