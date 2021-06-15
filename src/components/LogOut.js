import React, { Component } from "react";

class LogOut extends Component {
  
  componentDidMount() {
    this.props.onLogOut();
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default LogOut;