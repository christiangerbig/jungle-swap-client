import { useEffect } from "react";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouting } from "../../custom-hooks/useRouting";
import { useHandleMessage } from "../../custom-hooks/useHandleMessage";
import { decreaseAmountOfReplies } from "../../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../../typeDefinitions";
import { RootState } from "../../store";
import WaitSpinnerText from "../../components/spinners/WaitSpinnerText";
import Reply from "../../components/replies/Reply";

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
  const { goBack } = useHistory();
  const { protectRoute } = useRouting();
  const { fetchMessage, deleteMessage } = useHandleMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;
  const { _id, seller, plant, request, reply } = message as Message;

  useEffect(() => {
    protectRoute((): void => {
      fetchMessage(messageId, (): void => {
        scrollToTop();
      });
    });
  }, []);

  const handleDeleteMessage = (messageId: MessageId): void => {
    deleteMessage(messageId, (): void => {
      dispatch(decreaseAmountOfReplies());
      goBack();
    });
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
          {t("texts.replies.replyDetails.headline")} {name}
        </h2>
        <p className="text-field p-3 mb-4">{request}</p>
        <Reply
          headline={`${t("texts.replies.replyDetails.replyBy")} ${username}`}
          text={reply}
        />
        <div className="text-right px-3">
          <button
            disabled={buttonState()}
            className="btn btn-sm ml-2 is-width-medium form-control mb-1"
            onClick={(): void => {
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
            onClick={scrollToTop}
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
