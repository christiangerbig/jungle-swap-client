import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { setMessage, updateMessage, Message } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const UpdateRequestForm = (): JSX.Element => {
  const message = useSelector((state: RootState) => state.jungleSwap.message);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(() => scroll.scrollToTop(), []);

  // Create reply
  const handleCreateReply = ({ target }: any, message: Message): void => {
    const clonedMessage: Message = JSON.parse(JSON.stringify(message));
    clonedMessage.reply = target.value;
    dispatch(setMessage(clonedMessage));
  };

  // Update message
  const handleUpdateMessage = (
    { _id, buyer, seller, plant, request, reply, messageState }: Message,
    history: any
  ): void => {
    const updatedMessage: Message = {
      buyer,
      seller,
      plant,
      request,
      reply,
      messageState,
    };
    dispatch(updateMessage({ messageId: _id, updatedMessage }));
    history.push(`/requests/read/${{ messageId: _id }}`);
  };

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
              onChange={(event) => handleCreateReply(event, message)}
            />
            <div className="row justify-content-end px-3">
              <button
                className="btn btn-sm smallWidth form-control mr-3 mb-2"
                onClick={() => handleUpdateMessage(message, history)}
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
