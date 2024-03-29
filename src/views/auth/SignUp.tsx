import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAuthentification } from "../../app/custom-hooks/useAuthentification";
import {
  setIsUserChange,
  setErrorMessage,
  selectErrorMessage,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../app/typeDefinitions";
import ErrorMessage from "../../components/helpers/ErrorMessage";

const SignUp = (): JSX.Element => {
  const errorMessage = useAppSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { t } = useTranslation();
  const { signUp } = useAuthentification();
  const { scrollToTop } = scroll;

  useEffect(() => {
    dispatch(setErrorMessage(null));
    scrollToTop();
  }, []);

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>): void => {
    const {
      target: { username, email, password },
    } = event as any;
    const newUser: User = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value,
    };
    event.preventDefault();
    signUp(newUser, (): void => {
      dispatch(setIsUserChange(true));
      push("/");
    });
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Username missing":
        return t("errorTexts.auth.signUp.form.usernameMissing");
      case "Form: Email missing":
        return t("errorTexts.auth.signUp.form.emailMissing");
      case "Form: Password missing":
        return t("errorTexts.auth.signUp.form.passwordMissing");
      case "Form: Email format invalid":
        return t("errorTexts.auth.signUp.form.emailFormatInvalid");
      case "Form: Password invalid":
        return t("errorTexts.auth.signUp.form.passwordInvalid");
      case "Form: Username or email already exists":
        return t("errorTexts.auth.signUp.form.userAlreadyExists");
      default:
        return t("errorTexts.general");
    }
  };

  return (
    <div className="container row mt-5">
      <div className="col-11 col-md-5 offset-1 offset-md-5 mt-5">
        <h2 className="mb-5">{t("texts.auth.signUp.headline")}</h2>
        <form className="form-style" onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="InputUsername">
              {t("texts.auth.signUp.username")}
            </label>
            <input
              type="text"
              id="InputUsername"
              name="username"
              placeholder={t("texts.auth.signUp.enterPlaceholder")}
              className="form-control w-100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputEmail">{t("texts.auth.signUp.email")}</label>
            <input
              type="email"
              id="InputEmail"
              name="email"
              placeholder={t("texts.auth.signUp.enterPlaceholder")}
              className="form-control w-100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword">
              {t("texts.auth.signUp.password")}
            </label>
            <input
              type="password"
              id="InputPassword"
              name="password"
              placeholder={t("texts.auth.signUp.enterPlaceholder")}
              className="form-control w-100"
            />
          </div>
          <ErrorMessage
            message={errorMessage}
            outputFunction={convertErrorMessage}
          />
          <button
            type="submit"
            formNoValidate
            className={`
              [
                button
                button--width-small
              ]
              [
                btn
                btn-sm
                form-control
                px-4
                ml-0
                mt-4
              ]
            `}
          >
            {t("button.signUp")}
          </button>
          <p className="pt-1">{t("texts.auth.signUp.alreadyAccountCreated")}</p>
          <div className="text-right">
            <Link to={"/auth/sign-in"} className="navigation-link">
              <button
                className={`
                [
                  button
                  button--width-small
                ]
                [
                  btn
                  btn-sm
                  form-control
                  px-4
                  mt-0
                  mr-0
                ]
                `}
              >
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
