import React, { Component } from "react";
import { animateScroll as scroll } from "react-scroll";

class LogOut extends Component {
  
  componentDidMount() {
    this.props.onLogOut();
    scroll.scrollToTop();
  }

  render() {
    return (
      <div/>
    );
  }
}

export default LogOut;