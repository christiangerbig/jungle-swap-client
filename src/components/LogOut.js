import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../reducer/jungleSwapSlice";

const LogOut = () => {
  const intervalId = useSelector(state => state.jungleSwap.intervalId);
  const dispatch = useDispatch();
  const history = useHistory();

  // Log out, stop interval, reset variables and scroll to top as soon as page loads
  useEffect(
    () => dispatch(logOut({ intervalId, history })),
    []
  );

  return (<div />);
};

export default LogOut;