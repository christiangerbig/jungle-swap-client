import React, {useEffect} from "react";
import {animateScroll as scroll} from "react-scroll";

const LogOut = ({onLogOut, onClearNewRequest}) => {
  useEffect(
    () => {
      onLogOut();
      onClearNewRequest();
      scroll.scrollToTop();
    },
    []
  );

  return (<div/>);
}

export default LogOut;