import React, { Component } from "react";
import { animateScroll as scroll } from "react-scroll";

class LogOut extends Component {
  
  componentDidMount() {
    const { onLogOut, onResetNewRequestsReceived } = this.props;
    onLogOut();
    onResetNewRequestsReceived();
    scroll.scrollToTop();
  }

  render() {
    return (
      <div/>
    );
  }
}

export default LogOut;