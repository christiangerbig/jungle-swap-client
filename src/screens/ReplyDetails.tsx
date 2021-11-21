import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  readMessage,
  deleteMessage,
  User,
  Plant,
  Message,
  setMessage,
  removeMessage,
  decreaseAmountOfReplies,
  checkUserLoggedIn,
  setLoggedInUser,
  MessageId,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const ReplyDetails = (): JSX.Element => {
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
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  const { _id, seller, plant, request, reply } = message as Message;

  if (isFetchingMessage && !seller && !plant) {
    return (
      <div className="container mt-5">
        <LoadingSpinner spinnerText={"Loading reply..."} />
      </div>
    );
  }

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your request for {(plant as Plant).name} </h2>
        <p className="textField p-3 mb-4"> {request} </p>
        {reply && (
          <div>
            <h5> Reply by {(seller as User).username} </h5>
            <p className="textField p-3 mb-4"> {reply} </p>
          </div>
        )}
        <div className="text-right px-3">
          <button
            className="btn btn-sm ml-2 smallWidth form-control mb-1"
            onClick={() => {
              dispatch(deleteMessage(_id))
                .unwrap()
                .then(() => {
                  dispatch(removeMessage(_id));
                  dispatch(decreaseAmountOfReplies());
                  history && history.push("/replies/fetch");
                })
                .catch((rejectedValue: any) => {
                  console.log(rejectedValue.message);
                });
            }}
          >
            Delete
          </button>
        </div>
        <div className="text-right px-3">
          <Link to={"/replies/fetch"} onClick={scroll.scrollToTop}>
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
