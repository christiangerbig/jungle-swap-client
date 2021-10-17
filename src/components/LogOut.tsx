import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const LogOut = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.jungleSwap.loggedInUser);
  const intervalId: any = useSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const dispatch = useDispatch();
  const history = useHistory();

  // Log out, stop interval, reset variables and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(logOut({ user, intervalId, history }));
  }, []);

  return <div />;
};

export default LogOut;
