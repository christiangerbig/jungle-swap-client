import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAuthentification } from "../../app/custom-hooks/useAuthentification";
import {
  setIsUserChange,
  setAmountOfRequests,
  setAmountOfReplies,
  setErrorMessage,
  selectErrorMessage,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../app/typeDefinitions";
import ErrorMessage from "../../components/helpers/ErrorMessage";

const SignIn = (): JSX.Element => {
  const errorMessage = useAppSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { t } = useTranslation();
  const { signIn } = useAuthentification();
  const { scrollToTop } = scroll;

  useEffect(() => {
    dispatch(setErrorMessage(null));
    scrollToTop();
  }, []);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>): void => {
    const {
      target: { email, password },
    } = event as any;
    const user: User = {
      email: email.value,
      password: password.value,
    };
    event.preventDefault();
    signIn(user, (): void => {
      dispatch(setIsUserChange(true));
      const { amountOfRequests, amountOfReplies } = user;
      dispatch(setAmountOfRequests(amountOfRequests as number));
      dispatch(setAmountOfReplies(amountOfReplies as number));
      push("/");
    });
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Email missing":
        return t("errorTexts.authentification.signIn.form.emailMissing");
      case "Form: Password missing":
        return t("errorTexts.authentification.signIn.form.passwordMissing");
      case "Form: Email format invalid":
        return t("errorTexts.authentification.signIn.form.emailFormatInvalid");
      case "Form: Passwords don't match":
        return t("errorTexts.authentification.signIn.form.noMatchPasswords");
      default:
        return t("errorTexts.general");
    }
  };

  return (
    <div className="container row mt-5 custom fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5">{t("texts.authentification.signIn.headline")}</h2>
        <form className="form-style" onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="InputEmail">
              {t("texts.authentification.signIn.email")}
            </label>
            <input
              type="email"
              id="InputEmail"
              name="email"
              placeholder={t("texts.authentification.signIn.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword">
              {t("texts.authentification.signIn.password")}
            </label>
            <input
              type="password"
              id="InputPassword"
              name="password"
              placeholder={t("texts.authentification.signIn.enterPlaceholder")}
              className="form-control is-width-full"
            />
          </div>
          <ErrorMessage
            message={errorMessage}
            outputFunction={convertErrorMessage}
          />
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
