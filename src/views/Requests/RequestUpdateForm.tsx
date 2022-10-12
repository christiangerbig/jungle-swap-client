import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setMessage } from "../../reducer/jungleSwapSlice";
import { Message, MessageId } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import { MessageIO } from "../../lib/messageIO";
import ErrorMessageOutput from "../../components/errors/ErrorMessageOutput";

const RequestUpdateForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const isUpdatingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUpdatingMessage
  );
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { request } = message as Message;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      scroll.scrollToTop();
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
    const messageIO = new MessageIO(dispatch);
    messageIO.update(
      updatedMessage._id as MessageId,
      updatedMessage,
      (): void => {
        history.goBack();
      }
    );
  };

  const printErrorMessage = (errorMessage: string): string => {
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
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                handleCreateReply(event, message);
              }}
            />
            {errorMessage && errorMessage.includes("Form") && (
              <ErrorMessageOutput printErrorMessage={printErrorMessage} />
            )}
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
                  history.goBack();
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
