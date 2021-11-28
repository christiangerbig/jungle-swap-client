import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsUserChange,
  setLoggedInUser,
  signIn,
  setIsNewRequest,
  setAmountOfRequests,
  setAmountOfReplies,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";
import { RootState } from "../store";

const SignIn = (): JSX.Element => {
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Reset variables and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(setErrorMessage(null));
    dispatch(setIsNewRequest(false));
    scroll.scrollToTop();
  }, []);

  // Sign in
  const handleSignIn = (event: any): void => {
    event.preventDefault();
    const { email, password } = event.target;
    const user: User = {
      email: email.value,
      password: password.value,
    };
    dispatch(signIn(user))
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        const { amountOfRequests, amountOfReplies } = user;
        dispatch(setAmountOfRequests(amountOfRequests));
        dispatch(setAmountOfReplies(amountOfReplies));
        dispatch(setIsUserChange(true));
        history.push("/");
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Sign In </h2>
        <form
          onSubmit={(event) => {
            handleSignIn(event);
          }}
        >
          <div className="form-group">
            <label htmlFor="InputEmail"> Email address </label>
            <input
              type="email"
              className="form-control"
              id="InputEmail"
              name="email"
              placeholder="Enter"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword"> Password </label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="InputPassword"
              placeholder="Enter"
            />
          </div>
          {errorMessage && <p className="warningColor"> {errorMessage} </p>}
          <button
            type="submit"
            className="btn btn-sm mt-4 smallWidth form-control"
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
