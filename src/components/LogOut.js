import React, { useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";

const LogOut = ({ onLogOut, onClearNewRequest }) => {
  // Log out and scroll to top as soon as page loads
  useEffect(
    () => {
      onLogOut();
      onClearNewRequest();
      scroll.scrollToTop();
    },
    []
  );

  return (<div />);
}

export default LogOut;