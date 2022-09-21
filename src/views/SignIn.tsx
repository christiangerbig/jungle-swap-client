import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsUserChange,
  setLoggedInUser,
  signIn,
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
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setErrorMessage(null));
    scroll.scrollToTop();
  }, []);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>): void => {
    const setUserVariablesAndReturnToHomePage = (user: User): void => {
      dispatch(setLoggedInUser(user));
      dispatch(setIsUserChange(true));
      const { amountOfRequests, amountOfReplies } = user;
      dispatch(setAmountOfRequests(amountOfRequests as number));
      dispatch(setAmountOfReplies(amountOfReplies as number));
      history.push("/");
    };

    event.preventDefault();
    const { email, password } = event.target as any;
    const user: User = {
      email: email.value,
      password: password.value,
    };
    dispatch(signIn(user))
      .unwrap()
      .then((user) => {
        setUserVariablesAndReturnToHomePage(user);
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Email missing":
        return t("errors.signIn.form.emailMissing");
      case "Form: Password missing":
        return t("errors.signIn.form.passwordMissing");
      case "Form: Email format invalid":
        return t("errors.signIn.form.emailFormatInvalid");
      case "Form: Passwords don't match":
        return t("errors.signIn.form.noMatchPasswords");
      default:
        return t("errors.general");
    }
  };

  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> {t("signIn.headline")} </h2>
        <form
          className="form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            handleSignIn(event);
          }}
        >
          <div className="form-group">
            <label htmlFor="InputEmail"> {t("signIn.email")} </label>
            <input
              type="email"
              id="InputEmail"
              name="email"
              placeholder={t("signIn.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword"> {t("signIn.password")} </label>
            <input
              type="password"
              id="InputPassword"
              name="password"
              placeholder={t("signIn.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          {errorMessage && errorMessage.includes("Form") && (
            <span className="is-danger is-text-bold is-display-block">
              {printErrorMessage(errorMessage)}
            </span>
          )}
          <button
            type="submit"
            formNoValidate
            className="btn btn-sm mt-4 is-width-medium form-control"
          >
            {t("button.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
