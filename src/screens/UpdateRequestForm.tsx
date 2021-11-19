import { useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setMessage,
  updateMessage,
  Message,
  setMessageChanges,
  checkUserLoggedIn,
  setLoggedInUser,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const UpdateRequestForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(() => {
    scroll.scrollToTop();
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Create reply
  const handleCreateReply = ({ target }: any, message: Message): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = target.value;
    dispatch(setMessage(clonedMessage));
  };

  // Update message
  const handleUpdateMessage = ({
    _id,
    buyer,
    seller,
    plant,
    request,
    reply,
    messageState,
  }: Message): void => {
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
        history.push(`/requests/read/${_id}`);
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/unauthorized"} />;
  }

  const { _id, request } = message as Message;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Reply your request </h2>
        <div className="card cardSmallWidth mb-5">
          <div className="card-body">
            <p> {request} </p>
            <textarea
              className="mb-4 form-control"
              name="reply"
              cols={31}
              rows={6}
              placeholder="Your reply"
              onChange={(event) => {
                handleCreateReply(event, message);
              }}
            />
            <div className="row justify-content-end px-3">
              <button
                className="btn btn-sm smallWidth form-control mr-3 mb-2"
                onClick={() => {
                  handleUpdateMessage(message);
                }}
              >
                Submit
              </button>
              <Link to={`/requests/read/${_id}`}>
                <button className="btn btn-sm form-control mb-2">
                  Go back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequestForm;
