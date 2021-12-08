import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setMessage,
  updateMessage,
  setMessageChanges,
  decreaseAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";
import { fetchSingleMessage, protectRoute } from "../lib/utilities";

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

  useEffect(() => {
    protectRoute(dispatch);
    if (loggedInUser) {
      fetchSingleMessage(messageId, dispatch);
      scroll.scrollToTop();
    }
  }, []);

  const handleChangeMessageState = (message: Message): void => {
    const setBuyerMessageInactive = (message: Message): Message => {
      const clonedMessage: Message = JSON.parse(JSON.stringify(message));
      clonedMessage.messageState = false;
      dispatch(setMessage(clonedMessage));
      return clonedMessage;
    };

    const updateBuyerMessage = ({
      _id,
      buyer,
      seller,
      plant,
      request,
      reply,
      messageState,
    }: Message) => {
      const setMessageChangesAndReturnToRequestsPage = (
        message: Message
      ): void => {
        dispatch(setMessageChanges(message));
        dispatch(decreaseAmountOfRequests());
        history.push("/requests/fetch-all");
      };

      const updatedMessage: Message = {
        buyer,
        seller,
        plant,
        request,
        reply,
        messageState,
      };
      dispatch(updateMessage({ messageId: _id as MessageId, updatedMessage }))
        .unwrap()
        .then((message) => {
          setMessageChangesAndReturnToRequestsPage(message);
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    const updatedMessage = setBuyerMessageInactive(message);
    updateBuyerMessage(updatedMessage);
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  const { _id, buyer, plant, request, reply } = message as Message;
  if (isFetchingMessage || !buyer || !plant) {
    return (
      <div className="container d-flex align-items-center justify-content-center mt-5">
        <LoadingSpinner />
        <span> Loading request </span>
      </div>
    );
  }
  const { name } = plant as Plant;
  const { username } = buyer as User;

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Request for {name} </h2>
        <h5> by {username} </h5>
        <p className="textField p-3 mb-4"> {request} </p>
        <div hidden={reply ? false : true}>
          <h5> Your reply </h5>
          <p className="textField p-3 mb-4"> {reply} </p>
        </div>
        <div className="text-right px-3">
          <Link to={`/messages/update/${_id}`} hidden={!reply ? false : true}>
            <button className="btn btn-sm ml-2 smallWidth form-control mb-1">
              Reply
            </button>
          </Link>
          <button
            className="btn btn-sm ml-2 smallWidth form-control mb-1"
            onClick={() => {
              handleChangeMessageState(message);
            }}
          >
            Done
          </button>
        </div>
        <div className="text-right px-3">
          <Link to={"/requests/fetch-all"} onClick={scroll.scrollToTop}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
