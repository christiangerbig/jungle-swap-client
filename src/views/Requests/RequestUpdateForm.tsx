import { useEffect, useMemo } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useMessage } from "../../app/custom-hooks/useMessage";
import {
  selectErrorMessage,
  selectIsUpdatingMessage,
  selectLoggedInUser,
  selectMessage,
  setMessage,
} from "../../reducer/jungleSwapSlice";
import { Message } from "../../app/typeDefinitions";
import ErrorMessage from "../../components/helpers/ErrorMessage";
import GoBackButton from "../../components/helpers/GoBackButton";

const RequestUpdateForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const message = useAppSelector(selectMessage);
  const isUpdatingMessage = useAppSelector(selectIsUpdatingMessage);
  const errorMessage = useAppSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const { protectRoute } = useRouting();
  const { updateMessage } = useMessage();
  const { scrollToTop } = scroll;
  const { request } = message as Message;

  useEffect(() => {
    protectRoute((): void => {
      scrollToTop();
    });
  }, []);

  const buttonState = useMemo(
    (): boolean => (isUpdatingMessage ? true : false),
    [isUpdatingMessage]
  );

  const handleCreateReply = (
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
    message: Message
  ): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = value;
    dispatch(setMessage(clonedMessage));
  };

  const handleUpdateMessage = (updatedMessage: Message): void => {
    updateMessage(updatedMessage, (): void => {
      goBack();
    });
  };

  const handleGoBack = () => {
    goBack();
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Reply text missing":
        return t("errorTexts.messages.updateRequest.form.replyTextMissing");
      default:
        return t("errorTexts.general");
    }
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 ">
      <div className="col-11 col-md-5 offset-1 offset-md-5 mt-2">
        <h2 className="mt-5 mb-4">
          {t("texts.requests.updateRequest.form.headline")}
        </h2>
        <div className="[ thumbnail-card thumbnail-card--width-medium ] [ card mb-5 ]">
          <div className="card-body">
            <p>{request}</p>
            <textarea
              name="reply"
              placeholder={t(
                "texts.requests.updateRequest.form.replyPlaceholder"
              )}
              cols={31}
              rows={6}
              className="form-control w-100 mb-4"
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
            <div className="text-right px-3">
              <button
                disabled={buttonState}
                className={`
                  [
                    button--width-medium
                  ]
                  [
                    btn 
                    btn-sm 
                    form-control 
                    px-4
                    mr-0
                    mb-2
                  ]                
                `}
                onClick={(): void => {
                  handleUpdateMessage(message);
                }}
              >
                {t("button.submit")}
              </button>
              <GoBackButton clickHandler={handleGoBack} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestUpdateForm;
