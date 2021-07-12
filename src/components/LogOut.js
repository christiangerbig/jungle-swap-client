import React, {useEffect} from "react";
import {animateScroll as scroll} from "react-scroll";

const LogOut = ({onLogOut, onClearRequestsReceived}) => {
  useEffect(
    () => {
      onLogOut();
      onClearRequestsReceived();
      scroll.scrollToTop();
    },
    []
  );

  return (<div/>);
}

export default LogOut;