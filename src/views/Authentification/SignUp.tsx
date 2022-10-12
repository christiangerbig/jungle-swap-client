import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setIsUserChange,
  setErrorMessage,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Authentification } from "../../lib/authentification";
import ErrorMessageOutput from "../../components/errors/ErrorMessageOutput";

const SignUp = (): JSX.Element => {
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

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>): void => {
    const { username, email, password } = event.target as any;
    const newUser: User = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value,
    };
    event.preventDefault();
    const authentification = new Authentification(dispatch);
    authentification.signUp(newUser, (): void => {
      dispatch(setIsUserChange(true));
      history.push("/");
    });
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Username missing":
        return t("errorTexts.authentification.signUp.form.usernameMissing");
      case "Form: Email missing":
        return t("errorTexts.authentification.signUp.form.emailMissing");
      case "Form: Password missing":
        return t("errorTexts.authentification.signUp.form.passwordMissing");
      case "Form: Email format invalid":
        return t("errorTexts.authentification.signUp.form.emailFormatInvalid");
      case "Form: Password invalid":
        return t("errorTexts.authentification.signUp.form.passwordInvalid");
      case "Form: Username or email already exists":
        return t("errorTexts.authentification.signUp.form.userAlreadyExists");
      default:
        return t("errorTexts.general");
    }
  };

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5">{t("texts.authentification.signUp.headline")}</h2>
        <form
          className="form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            handleSignUp(event);
          }}
        >
          <div className="form-group">
            <label htmlFor="InputUsername">
              {t("texts.authentification.signUp.username")}
            </label>
            <input
              type="text"
              id="InputUsername"
              name="username"
              placeholder={t("texts.authentification.signUp.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputEmail">
              {t("texts.authentification.signUp.email")}
            </label>
            <input
              type="email"
              id="InputEmail"
              name="email"
              placeholder={t("texts.authentification.signUp.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword">
              {t("texts.authentification.signUp.password")}
            </label>
            <input
              type="password"
              id="InputPassword"
              name="password"
              placeholder={t("texts.authentification.signUp.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          {errorMessage && errorMessage.includes("Form") && (
            <ErrorMessageOutput outputFunction={convertErrorMessage} />
          )}
          <button
            type="submit"
            formNoValidate
            className="btn btn-sm mt-4 is-width-medium form-control"
          >
            {t("button.signUp")}
          </button>
          <p className="is-padding-top">
            {t("texts.authentification.signUp.alreadyAccountCreated")}
          </p>
          <div className="text-right">
            <Link to={"/auth/sign-in"} className="is-link">
              <button className="btn btn-sm ml-4 is-width-medium form-control mt-0 mb-2">
                {t("button.signIn")}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
