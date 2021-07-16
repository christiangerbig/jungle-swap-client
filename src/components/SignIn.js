import React, {useEffect} from "react";
import {animateScroll as scroll} from "react-scroll";

const SignIn = ({error, onSignIn, onClearError, onClearNewRequest}) => {
  useEffect(
    () => {
      onClearError();
      onClearNewRequest();
      scroll.scrollToTop();
    },
    []
  );

  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Sign In </h2>
        <form onSubmit={onSignIn}>
          <div className="form-group">
            <label htmlFor="InputEmail"> Email address </label>
            <input type="email" className="form-control" id="InputEmail" name="email"/>
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword"> Password </label>
            <input name="password" type="password" className="form-control" id="InputPassword"/>
          </div>
          {
            error ? <p className="warningColor"> {error} </p> : null            
          }
          <button type="submit" className="btn btn-primary mt-4 btn-outline-dark" formnovalidate="formnovalidate"> Sign in </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;