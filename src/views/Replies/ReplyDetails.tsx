import { useEffect, useMemo } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useMessage } from "../../app/custom-hooks/useMessage";
import { useNavigation } from "../../app/custom-hooks/useNavigation";
import {
  decreaseAmountOfReplies,
  selectIsDeletingMessage,
  selectIsFetchingMessage,
  selectLoggedInUser,
  selectMessage,
} from "../../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../../app/typeDefinitions";
import WaitSpinnerText from "../../components/spinners/WaitSpinnerText";
import Reply from "../../components/replies/Reply";
import GoBackButton from "../../components/helpers/GoBackButton";

const ReplyDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const message = useAppSelector(selectMessage);
  const isFetchingMessage = useAppSelector(selectIsFetchingMessage);
  const isDeletingMessage = useAppSelector(selectIsDeletingMessage);
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const { protectRoute } = useRouting();
  const { fetchMessage, deleteMessage } = useMessage();
  const { goToReplies } = useNavigation();
  const { scrollToTop } = scroll;
  const { _id, seller, plant, request, reply } = message as Message;

  useEffect(() => {
    // protectRoute((): void => {
    fetchMessage(messageId, (): void => {
      scrollToTop();
    });
    // });
  }, []);

  const buttonState = useMemo(
    (): boolean => (isDeletingMessage ? true : false),
    [isDeletingMessage]
  );

  const handleDeleteMessage = (messageId: MessageId): void => {
    deleteMessage(messageId, (): void => {
      dispatch(decreaseAmountOfReplies());
      goBack();
    });
  };

  const handleGoBack = (): void => {
    goToReplies();
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
      <div className="col-11 col-md-5 offset-1 offset-md-5 mt-5">
        <h2 className="mb-5">
          {t("texts.replies.replyDetails.headline")} {name}
        </h2>
        <p className="[ text-field ] [ p-3 mb-4 ]">{request}</p>
        <Reply
          headline={`${t("texts.replies.replyDetails.replyBy")} ${username}`}
          text={reply}
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
                mb-1
              ]
            `}
            onClick={(): void => {
              handleDeleteMessage(_id as MessageId);
            }}
          >
            {t("button.delete")}
          </button>
        </div>
        <div className="text-right px-3">
          <GoBackButton clickHandler={handleGoBack} />
        </div>
      </div>
    </div>
  );
};

export default ReplyDetails;
