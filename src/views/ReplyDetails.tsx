import { useEffect } from "react";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  decreaseAmountOfReplies,
  setMessage,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import WaitSpinnerText from "../components/WaitSpinnerText";

const ReplyDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const isFetchingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingMessage
  );
  const isDeletingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingMessage
  );
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { _id, seller, plant, request, reply } = message as Message;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      const messageIO = new MessageIO(dispatch);
      messageIO.fetch(messageId);
      !isFetchingMessage && scroll.scrollToTop();
    }
  }, []);

  const handleDeleteMessage = (messageId: MessageId): void => {
    const messageIO = new MessageIO(dispatch);
    messageIO.delete(messageId);
    if (!isDeletingMessage) {
      dispatch(decreaseAmountOfReplies());
      history.goBack();
    }
  };

  const buttonState = (): boolean => {
    return isDeletingMessage ? true : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  if (isFetchingMessage || !seller || !plant) {
    return <WaitSpinnerText text={"Loading reply"} />;
  }
  const { name } = plant as Plant;
  const { username } = seller as User;

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5">
          {t("replyDetails.headline")} {name}
        </h2>
        <p className="text-field p-3 mb-4">{request}</p>
        {reply ? (
          <div>
            <h5>
              {t("replyDetails.replyBy")} {username}
            </h5>
            <p className="text-field p-3 mb-4">{reply}</p>
          </div>
        ) : null}
        <div className="text-right px-3">
          <button
            disabled={buttonState()}
            className="btn btn-sm ml-2 is-width-medium form-control mb-1"
            onClick={() => {
              handleDeleteMessage(_id as MessageId);
            }}
          >
            {t("button.delete")}
          </button>
        </div>
        <div className="text-right px-3">
          <Link
            to={"/replies/fetch-all"}
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

export default ReplyDetails;
