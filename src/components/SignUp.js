import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { setError, setIsNewRequest, signUp } from "../Reducer/jungleSwapSlice";

const SignUp = () => {
  const error = useSelector(state => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Clear variables and scroll to top as soon as page loads
  useEffect(
    () => {
      dispatch(setError(null));
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    },
    []
  );

  // Sign up
  const handleSignUp = event => {
    event.preventDefault();
    const { username, email, password } = event.target;
    const newUser = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value
    };
    dispatch(signUp({ newUser, history }));
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Sign Up </h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="InputUsername"> Username </label>
            <input type="text" className="form-control" id="InputUsername" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="InputEmail"> Email address </label>
            <input type="email" className="form-control" id="InputEmail" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword"> Password </label>
            <input name="password" type="password" className="form-control" id="InputPassword" />
          </div>
          {error && (<p className="warningColor"> {error} </p>)}
          <button type="submit" className="btn btn-primary mt-4 btn-outline-dark" formnovalidate="formnovalidate"> Sign up </button>
          <p className="padding"> Already have an account? </p>
          <Link to={"/signin"}> Sign in </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;