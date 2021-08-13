import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { logOut, setIsNewRequest, setIntervalId, setMinutesCounter } from "../Reducer/jungleSwapSlice";

const LogOut = () => {
  const intervalId = useSelector(state => state.jungleSwap.intervalId);
  const dispatch = useDispatch();
  const history = useHistory();

  // Log out, stop interval, reset variables and scroll to top as soon as page loads
  useEffect(
    () => {
      dispatch(logOut());
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setMinutesCounter(0));
      dispatch(setIsNewRequest(false));
      history.push("/");
      scroll.scrollToTop();
    },
    []
  );

  return (<div />);
}

export default LogOut;