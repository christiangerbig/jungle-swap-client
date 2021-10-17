import { useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  readMessage,
  deleteMessage,
  User,
  Plant,
  Message,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const ReplyDetails = (): JSX.Element => {
  const message = useSelector((state: RootState) => state.jungleSwap.message);
  const { messageId }: any = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read message and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(readMessage(messageId));
    scroll.scrollToTop();
  }, []);

  const { _id, buyer, seller, plant, request, reply } = message as Message;
  if (!buyer || !plant)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading replies...
        </span>
      </div>
    );

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
            onClick={() => dispatch(deleteMessage({ messageId, history }))}
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
