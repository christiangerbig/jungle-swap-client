import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  checkUserLoggedIn,
  setLoggedInUser,
  setIsFetchingMessage,
  fetchMessage,
  setMessage,
  setIsDeletingMessage,
  deleteMessage,
  removeMessage,
  decreaseAmountOfReplies,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";

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

  // Read message and scroll to top as soon as page loads if the user is logged in
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setIsFetchingMessage(true));
        dispatch(fetchMessage(messageId))
          .unwrap()
          .then((message) => {
            dispatch(setMessage(message));
            scroll.scrollToTop();
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Delete Message
  const handleDeleteMessage = (messageId: MessageId): void => {
    dispatch(setIsDeletingMessage(true));
    dispatch(deleteMessage(messageId))
      .unwrap()
      .then(() => {
        dispatch(removeMessage(messageId));
        dispatch(decreaseAmountOfReplies());
        history.push("/replies/fetch-all");
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  const { _id, seller, plant, request, reply } = message as Message;
  if (isFetchingMessage || !seller || !plant) {
    return (
      <div className="container d-flex align-items-center justify-content-center mt-5">
        <LoadingSpinner />
        <span> Loading reply </span>
      </div>
    );
  }
  const { name } = plant as Plant;
  const { username } = seller as User;

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your request for {name} </h2>
        <p className="textField p-3 mb-4"> {request} </p>
        {reply && (
          <div>
            <h5> Reply by {username} </h5>
            <p className="textField p-3 mb-4"> {reply} </p>
          </div>
        )}
        <div className="text-right px-3">
          <button
            className="btn btn-sm ml-2 smallWidth form-control mb-1"
            disabled={isDeletingMessage ? true : false}
            onClick={() => {
              _id && handleDeleteMessage(_id);
            }}
          >
            Delete
          </button>
        </div>
        <div className="text-right px-3">
          <Link to={"/replies/fetch-all"} onClick={scroll.scrollToTop}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReplyDetails;
