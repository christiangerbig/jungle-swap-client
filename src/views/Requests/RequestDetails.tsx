import { useEffect } from "react";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useMessage } from "../../app/custom-hooks/useMessage";
import {
  setMessage,
  decreaseAmountOfRequests,
  selectLoggedInUser,
  selectIsFetchingMessage,
  selectMessage,
} from "../../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../../app/typeDefinitions";
import WaitSpinnerText from "../../components/spinners/WaitSpinnerText";
import Reply from "../../components/replies/Reply";

const RequestDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isFetchingMessage = useAppSelector(selectIsFetchingMessage);
  const message = useAppSelector(selectMessage);
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { protectRoute } = useRouting();
  const { fetchMessage, updateMessage } = useMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;
  const { _id, buyer, plant, request, reply } = message as Message;

  useEffect(() => {
    protectRoute((): void => {
      fetchMessage(messageId, (): void => {
        scrollToTop();
      });
    });
  }, []);

  const handleChangeMessageState = (message: Message): void => {
    const setBuyerMessageInactive = (message: Message): Message => {
      const clonedMessage: Message = JSON.parse(JSON.stringify(message));
      clonedMessage.messageState = false;
      dispatch(setMessage(clonedMessage));
      return clonedMessage;
    };

    const updateBuyerMessage = (updatedMessage: Message) => {
      updateMessage(updatedMessage, (): void => {
        dispatch(decreaseAmountOfRequests());
        goBack();
      });
    };

    const updatedMessage = setBuyerMessageInactive(message);
    updateBuyerMessage(updatedMessage);
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  if (isFetchingMessage || !buyer || !plant) {
    return <WaitSpinnerText text={"Loading request"} />;
  }
  const { name } = plant as Plant;
  const { username } = buyer as User;

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5">
          {t("texts.requests.requestDetails.headline")} {name}
        </h2>
        <h5>
          {t("texts.requests.requestDetails.subheadline")} {username}
        </h5>
        <p className="text-field p-3 mb-4">{request}</p>
        <Reply
          headline={t("texts.requests.requestDetails.yourReply")}
          text={reply}
        />
        <div className="text-right px-3">
          {!reply && (
            <Link to={`/messages/update/${_id}`} className="is-link">
              <button className="btn btn-sm mx-2 is-width-medium form-control mb-1">
                {t("button.reply")}
              </button>
            </Link>
          )}
          <button
            className="btn btn-sm mx-2 is-width-medium form-control mb-1"
            onClick={(): void => {
              handleChangeMessageState(message);
            }}
          >
            {t("button.done")}
          </button>
        </div>
        <div className="text-right px-3">
          <Link
            to={"/requests/fetch-all"}
            className="is-link"
            onClick={scrollToTop}
          >
            <button className="btn btn-sm mt-4 mx-2 is-width-medium form-control">
              {t("button.goBack")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
