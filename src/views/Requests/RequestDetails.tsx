import { useEffect } from "react";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useMessage } from "../../app/custom-hooks/useMessage";
import { useNavigation } from "../../app/custom-hooks/useNavigation";
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
import GoBackButton from "../../components/helpers/GoBackButton";

const RequestDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isFetchingMessage = useAppSelector(selectIsFetchingMessage);
  const message = useAppSelector(selectMessage);
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const { protectRoute } = useRouting();
  const { fetchMessage, updateMessage } = useMessage();
  const { goToRequests } = useNavigation();
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

  const handleGoBack = (): void => {
    goToRequests();
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
      <div className="col-11 col-md-5 offset-1 offset-md-5 mt-5">
        <h2 className="mb-5">
          {t("texts.requests.requestDetails.headline")} {name}
        </h2>
        <h5>
          {t("texts.requests.requestDetails.subheadline")} {username}
        </h5>
        <p className="[ text-field ] [ p-3 mb-4 ]">{request}</p>
        <Reply
          headline={t("texts.requests.requestDetails.yourReply")}
          text={reply}
        />
        <div className="text-right px-3">
          {!reply && (
            <Link to={`/messages/update/${_id}`} className="navigation-link">
              <button
                className={`
                  [ 
                    button--width-medium 
                  ] 
                  [ 
                    btn 
                    btn-sm 
                    form-control 
                    px-4 
                    mx-2 
                    mb-1 
                  ]
                `}
              >
                {t("button.reply")}
              </button>
            </Link>
          )}
          <button
            className={`
              [ 
                button--width-medium 
              ] 
              [ 
                btn 
                btn-sm 
                form-control 
                px-4
                ml-2 
                mr-0 
                mb-1 
              ]
            `}
            onClick={(): void => {
              handleChangeMessageState(message);
            }}
          >
            {t("button.done")}
          </button>
        </div>
        <div className="text-right px-3">
          <GoBackButton clickHandler={handleGoBack} />
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
