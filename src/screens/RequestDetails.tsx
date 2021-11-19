import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  readMessage,
  User,
  Plant,
  Message,
  setMessage,
  updateMessage,
  decreaseAmountOfRequests,
  setMessageChanges,
  checkUserLoggedIn,
  setLoggedInUser,
  MessageId,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const RequestDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const { messageId } = useParams<{ messageId: MessageId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Read message and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(readMessage(messageId))
          .unwrap()
          .then((message) => {
            dispatch(setMessage(message));
            scroll.scrollToTop();
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
        scroll.scrollToTop();
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Set message of the buyer inactive by the seller
  const handleSetMessageInactive = (message: Message, history: any) => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.messageState = false;
    dispatch(setMessage(clonedMessage));
    const { _id, buyer, seller, plant, request, reply, messageState } =
      clonedMessage;
    const updatedMessage: Message = {
      buyer,
      seller,
      plant,
      request,
      reply,
      messageState,
    };
    dispatch(updateMessage({ messageId: _id, updatedMessage }))
      .unwrap()
      .then((message) => {
        dispatch(setMessageChanges(message));
        dispatch(decreaseAmountOfRequests());
        history.push("/requests/fetch");
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/unauthorized"} />;
  }

  const { _id, buyer, plant, request, reply } = message as Message;
  if (!buyer || !plant) {
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading message...
        </span>
      </div>
    );
  }

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Request for {(plant as Plant).name} </h2>
        <h5> by {(buyer as User).username} </h5>
        <p className="textField p-3 mb-4"> {request} </p>
        {reply && (
          <div>
            <h5> Your reply </h5>
            <p className="textField p-3 mb-4"> {reply} </p>
          </div>
        )}
        <div className="text-right px-3">
          {!reply && (
            <Link to={`/messages/update/${_id}`}>
              <button className="btn btn-sm ml-2 smallWidth form-control mb-1">
                Reply
              </button>
            </Link>
          )}
          <button
            className="btn btn-sm ml-2 smallWidth form-control mb-1"
            onClick={() => {
              handleSetMessageInactive(message, history);
            }}
          >
            Done
          </button>
        </div>
        <div className="text-right px-3">
          <Link to={"/requests/fetch"} onClick={scroll.scrollToTop}>
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
