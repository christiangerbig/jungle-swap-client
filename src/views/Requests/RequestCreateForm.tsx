import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useHandleMessage } from "../../app/custom-hooks/useHandleMessage";
import { setErrorMessage } from "../../reducer/jungleSwapSlice";
import { User, Plant, Message } from "../../app/typeDefinitions";
import { RootState } from "../../app/store";
import ErrorMessage from "../../components/helpers/ErrorMessage";

const RequestCreateForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isCreatingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isCreatingMessage
  );
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { protectRoute } = useRouting();
  const { createMessage } = useHandleMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;
  const { name } = plant as Plant;

  useEffect(() => {
    protectRoute((): void => {
      dispatch(setErrorMessage(null));
      scrollToTop();
    });
  }, []);

  const handleCreateMessageForRequest = (
    event: React.FormEvent<HTMLFormElement>,
    { _id, creator }: Plant
  ): void => {
    const { request } = event.target as any;
    const newMessage: Message = {
      seller: (creator as User)._id,
      plant: _id,
      request: request.value,
    };
    event.preventDefault();
    createMessage(newMessage, (): void => {
      goBack();
    });
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Request text missing":
        return t("errorTexts.messages.createRequest.form.requestTextMissing");
      default:
        return t("errorTexts.general");
    }
  };

  const buttonState = (): boolean => {
    return isCreatingMessage ? true : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4">
          {t("texts.requests.createRequest.form.headline")}
        </h2>
        <h3 className="mb-4">
          {t("texts.requests.createRequest.form.subheadline")} {name}
        </h3>
        <form
          className="pl-0 form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            handleCreateMessageForRequest(event, plant);
          }}
        >
          <div>
            <textarea
              name="request"
              cols={35}
              rows={7}
              className="mb-4 form-control is-width-full"
            />
          </div>
          <ErrorMessage
            message={errorMessage}
            outputFunction={convertErrorMessage}
          />
          <div className="text-right">
            <button
              type="submit"
              disabled={buttonState()}
              className="btn btn-sm mx-2 form-control is-width-medium"
            >
              {t("button.send")}
            </button>
            <button
              className="btn btn-sm mx-2 form-control is-width-medium"
              onClick={(): void => {
                goBack();
              }}
            >
              {t("button.goBack")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCreateForm;
