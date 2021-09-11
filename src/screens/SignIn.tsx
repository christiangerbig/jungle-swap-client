import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  setError,
  setIsNewRequest,
  signIn,
  User,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const SignIn: React.FC = () => {
  const error = useSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Clear variables and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(setError(null));
    dispatch(setIsNewRequest(false));
    scroll.scrollToTop();
  }, []);

  // Sign in
  const handleSignIn = (event: any, history: any) => {
    event.preventDefault();
    const { email, password } = event.target;
    const user: User = {
      email: email.value,
      password: password.value,
    };
    dispatch(signIn({ user, history }));
  };

  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Sign In </h2>
        <form onSubmit={(event) => handleSignIn(event, history)}>
          <div className="form-group">
            <label htmlFor="InputEmail"> Email address </label>
            <input
              type="email"
              className="form-control"
              id="InputEmail"
              name="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword"> Password </label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="InputPassword"
            />
          </div>
          {error && <p className="warningColor"> {error} </p>}
          <button
            type="submit"
            className="btn btn-primary mt-4 btn-outline-dark"
            formNoValidate
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;