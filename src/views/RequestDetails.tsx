import { useEffect } from "react";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setMessage,
  decreaseAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import WaitSpinnerText from "../components/WaitSpinnerText";

const RequestDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingMessage
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { _id, buyer, plant, request, reply } = message as Message;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      const messageIO = new MessageIO(dispatch);
      messageIO.fetch(messageId, (): void => {
        scroll.scrollToTop();
      });
    }
  }, []);

  const handleChangeMessageState = (message: Message): void => {
    const setBuyerMessageInactive = (message: Message): void => {
      const clonedMessage: Message = JSON.parse(JSON.stringify(message));
      clonedMessage.messageState = false;
      dispatch(setMessage(clonedMessage));
    };

    const updateBuyerMessage = (updatedMessage: Message) => {
      const messageIO = new MessageIO(dispatch);
      messageIO.update(
        updatedMessage._id as MessageId,
        updatedMessage,
        history as any,
        (history: any): void => {
          dispatch(decreaseAmountOfRequests());
          history.goBack();
        }
      );
    };

    setBuyerMessageInactive(message);
    updateBuyerMessage(message);
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
          {t("requestDetails.headline")} {name}
        </h2>
        <h5>
          {t("requestDetails.subheadline")} {username}
        </h5>
        <p className="text-field p-3 mb-4">{request}</p>
        {reply ? (
          <div>
            <h5>{t("requestDetails.yourReply")}</h5>
            <p className="text-field p-3 mb-4">{reply}</p>
          </div>
        ) : null}
        <div className="text-right px-3">
          {!reply ? (
            <Link to={`/messages/update/${_id}`} className="is-link">
              <button className="btn btn-sm ml-2 is-width-medium form-control mb-1">
                {t("button.reply")}
              </button>
            </Link>
          ) : null}
          <button
            className="btn btn-sm ml-2 is-width-medium form-control mb-1"
            onClick={() => {
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
            onClick={scroll.scrollToTop}
          >
            <button className="btn btn-sm mt-4 is-width-medium form-control">
              {t("button.goBack")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
