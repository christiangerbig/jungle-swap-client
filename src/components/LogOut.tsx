import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const LogOut = () => {
  const intervalId: any = useSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const dispatch = useDispatch();
  const history = useHistory();

  // Log out, stop interval, reset variables and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(logOut({ intervalId, history }));
  }, []);

  return <div />;
};

export default LogOut;
