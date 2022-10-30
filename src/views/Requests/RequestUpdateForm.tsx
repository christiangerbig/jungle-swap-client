import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useHandleMessage } from "../../app/custom-hooks/useHandleMessage";
import {
  selectErrorMessage,
  selectIsUpdatingMessage,
  selectLoggedInUser,
  selectMessage,
  setMessage,
} from "../../reducer/jungleSwapSlice";
import { Message, MessageId } from "../../app/typeDefinitions";
import ErrorMessage from "../../components/helpers/ErrorMessage";

const RequestUpdateForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const message = useAppSelector(selectMessage);
  const isUpdatingMessage = useAppSelector(selectIsUpdatingMessage);
  const errorMessage = useAppSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { protectRoute } = useRouting();
  const { updateMessage } = useHandleMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;
  const { request } = message as Message;

  useEffect(() => {
    protectRoute((): void => {
      scrollToTop();
    });
  }, []);

  const handleCreateReply = (
    { target }: React.ChangeEvent<HTMLTextAreaElement>,
    message: Message
  ): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = target.value;
    dispatch(setMessage(clonedMessage));
  };

  const handleUpdateMessage = (updatedMessage: Message): void => {
    updateMessage(updatedMessage._id as MessageId, updatedMessage, (): void => {
      goBack();
    });
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Reply text missing":
        return t("errorTexts.messages.updateRequest.form.replyTextMissing");
      default:
        return t("errorTexts.general");
    }
  };

  const buttonState = (): boolean => {
    return isUpdatingMessage ? true : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4">
          {t("texts.requests.updateRequest.form.headline")}
        </h2>
        <div className="card is-card-width-small mb-5">
          <div className="card-body">
            <p>{request}</p>
            <textarea
              name="reply"
              placeholder={t(
                "texts.requests.updateRequest.form.replyPlaceholder"
              )}
              cols={31}
              rows={6}
              className="mb-4 form-control is-width-full"
              onChange={(
                event: React.ChangeEvent<HTMLTextAreaElement>
              ): void => {
                handleCreateReply(event, message);
              }}
            />
            <ErrorMessage
              message={errorMessage}
              outputFunction={convertErrorMessage}
            />
            <div className="row justify-content-end px-3">
              <button
                disabled={buttonState()}
                className="btn btn-sm is-width-medium form-control mr-3 mb-2"
                onClick={(): void => {
                  handleUpdateMessage(message);
                }}
              >
                {t("button.submit")}
              </button>
              <button
                className="btn btn-sm is-width-medium form-control mb-2"
                onClick={(): void => {
                  goBack();
                }}
              >
                {t("button.goBack")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestUpdateForm;
