import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setMessage,
  setIsUpdatingMessage,
  updateMessage,
  setMessageChanges,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import ErrorMessageOutput from "../components/ErrorMessageOutput";

const UpdateRequestForm = (): JSX.Element => {
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

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect();
    loggedInUser && scroll.scrollToTop();
  }, []);

  const handleCreateReply = (
    { target }: React.ChangeEvent<HTMLTextAreaElement>,
    message: Message
  ): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = target.value;
    dispatch(setMessage(clonedMessage));
  };

  const handleUpdateMessage = ({
    _id,
    buyer,
    seller,
    plant,
    request,
    reply,
    messageState,
  }: Message): void => {
    const setMessageChangesAndReturnToRequestPage = (
      message: Message
    ): void => {
      dispatch(setMessageChanges(message));
      history.goBack();
    };

    const updatedMessage: Message = {
      buyer,
      seller,
      plant,
      request,
      reply,
      messageState,
    };
    dispatch(setIsUpdatingMessage(true));
    dispatch(updateMessage({ messageId: _id as MessageId, updatedMessage }))
      .unwrap()
      .then((message) => {
        setMessageChangesAndReturnToRequestPage(message);
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Reply text missing":
        return t("errors.message.form.replyTextMissing");
      default:
        return t("errors.general");
    }
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  const { request } = message as Message;

  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> {t("updateRequestForm.headline")} </h2>
        <div className="card is-card-width-small mb-5">
          <div className="card-body">
            <p> {request} </p>
            <textarea
              name="reply"
              placeholder={t("updateRequestForm.replyPlaceholder")}
              cols={31}
              rows={6}
              className="mb-4 form-control is-width-full"
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleCreateReply(event, message);
              }}
            />
            {errorMessage && errorMessage.includes("Form") && (
              <ErrorMessageOutput printErrorMessage={printErrorMessage} />
            )}
            <div className="row justify-content-end px-3">
              <button
                disabled={isUpdatingMessage ? true : false}
                className="btn btn-sm is-width-medium form-control mr-3 mb-2"
                onClick={() => {
                  handleUpdateMessage(message);
                }}
              >
                {t("button.submit")}
              </button>
              <button
                className="btn btn-sm is-width-medium form-control mb-2"
                onClick={() => {
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

export default UpdateRequestForm;
