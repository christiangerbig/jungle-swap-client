import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsUserChange,
  setLoggedInUser,
  signUp,
  setIsNewRequest,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const SignUp = (): JSX.Element => {
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

  // Sign up
  const handleSignUp = (event: any): void => {
    event.preventDefault();
    const { username, email, password } = event.target;
    const newUser = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value,
    };
    dispatch(signUp(newUser))
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setIsUserChange(true));
        history.push("/");
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Sign Up </h2>
        <form
          onSubmit={(event) => {
            handleSignUp(event);
          }}
        >
          <div className="form-group">
            <label htmlFor="InputUsername"> Username </label>
            <input
              type="text"
              className="form-control"
              id="InputUsername"
              name="username"
              placeholder="Enter"
            />
          </div>
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
            Sign up
          </button>
          <p className="padding"> Already have an account? </p>
          <div className="text-right">
            <Link to={"/auth/sign-in"}>
              <button className="btn btn-sm ml-4 smallWidth form-control mt-0 mb-2">
                Sign In
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
