import React, { Component } from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

class SignUp extends Component {

  componentDidMount() {
    this.props.onResetError();
    scroll.scrollToTop();
  }

  render() {
    const { error, onSignUp } = this.props;
    return (
      <div className="container row mt-5">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-5">Sign Up</h2>
          <form onSubmit={ onSignUp }>
            <div className="form-group">
              <label htmlFor="InputUsername"> Username </label>
              <input type="text" className="form-control" id="InputUsername" name="username"/>
            </div>
            <div className="form-group">
              <label htmlFor="InputEmail"> Email address </label>
              <input type="email" className="form-control" id="InputEmail" name="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="InputPassword"> Password </label>
              <input name="password" type="password" className="form-control" id="InputPassword"/>
            </div>
            {
              (error) ? <p style={{ color: "red" }}> { error } </p> : null            
            }
            <button type="submit" className="btn btn-primary mt-4 btn-outline-dark"> Sign up </button>
            <p className="padding"> Already have an account? </p>
            <Link to={ "/signin" }> Sign in </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;