import React, {useEffect} from "react";
import {animateScroll as scroll} from "react-scroll";

const LogOut = ({onLogOut, onResetNewRequestsReceived}) => {
  useEffect(
    () => {
      onLogOut();
      onResetNewRequestsReceived();
      scroll.scrollToTop();
    },
    []
  );

  return (<div/>);
}

export default LogOut;