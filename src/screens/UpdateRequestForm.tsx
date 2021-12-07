import { useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setMessage,
  setIsUpdatingMessage,
  updateMessage,
  setMessageChanges,
} from "../reducer/jungleSwapSlice";
import { Message, MessageId } from "../typeDefinitions";
import { RootState } from "../store";
import { protectRoute } from "../lib/utilities";

const UpdateRequestForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const message = useAppSelector(
    (state: RootState) => state.jungleSwap.message
  );
  const isUpdatingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUpdatingMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    protectRoute(dispatch);
    loggedInUser && scroll.scrollToTop();
  }, []);

  const handleCreateReply = ({ target }: any, message: Message): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = target.value;
    dispatch(setMessage(clonedMessage));
  };

  const handleUpdateMessage = ({
    _id,
    buyer,
    seller,
    plant,
    request,
    reply,
    messageState,
  }: Message): void => {
    const setMessageChangesAndReturnToRequestPage = (
      message: Message
    ): void => {
      dispatch(setMessageChanges(message));
      const { _id } = message;
      history.push(`/requests/fetch/${_id}`);
    };

    const updatedMessage: Message = {
      buyer,
      seller,
      plant,
      request,
      reply,
      messageState,
    };
    dispatch(setIsUpdatingMessage(true));
    dispatch(updateMessage({ messageId: _id as MessageId, updatedMessage }))
      .unwrap()
      .then((message) => {
        setMessageChangesAndReturnToRequestPage(message);
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
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
              name="reply"
              placeholder="Your reply"
              cols={31}
              rows={6}
              className="mb-4 form-control"
              onChange={(event) => {
                handleCreateReply(event, message);
              }}
            />
            <div className="row justify-content-end px-3">
              <button
                disabled={isUpdatingMessage ? true : false}
                className="btn btn-sm smallWidth form-control mr-3 mb-2"
                onClick={() => {
                  handleUpdateMessage(message);
                }}
              >
                Submit
              </button>
              <Link to={`/requests/fetch/${_id}`}>
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
