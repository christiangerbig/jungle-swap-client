import React from "react";

function SignIn(props) {
  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
      <h2 className="mt-5 mb-5">Sign In</h2>
      <form onSubmit={ props.onSignIn }>
        <div className="form-group">
          <label htmlFor="InputEmail"> Email address </label>
          <input type="email" className="form-control" id="InputEmail" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="InputPassword"> Password </label>
          <input name="password" type="password" className="form-control" id="InputPassword" />
        </div>
        <button type="submit" className="btn btn-primary mt-4 btn-outline-dark"> Sign in </button>
      </form>
      </div>
    </div>
  );
}

export default SignIn;