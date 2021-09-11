import React, { useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  readRequest,
  deleteRequest,
  User,
  Plant,
  Request,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const RequestDetails: React.FC = () => {
  const request = useSelector((state: RootState) => state.jungleSwap.request);
  const { requestId }: any = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read request and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(readRequest(requestId));
    scroll.scrollToTop();
  }, []);

  const { _id, buyer, plant, message, reply } = request as Request;
  if (!buyer || !plant)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading request...
        </span>
      </div>
    );

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your request </h2>
        <h4> for: {(plant as Plant).name} </h4>
        <h5> by: {(buyer as User).username} </h5>
        <p> {message} </p>
        {reply && (
          <div>
            <h5> Your reply: </h5>
            <p> {reply} </p>
          </div>
        )}
        <div>
          {!reply && (
            <Link to={`/requests/update/${_id}`}>
              <button className="btn btn-sm ml-2 btn-outline-dark">
                Reply
              </button>
            </Link>
          )}
          <button
            className="btn btn-sm ml-2 btn-outline-dark"
            onClick={() => dispatch(deleteRequest({ requestId, history }))}
          >
            Delete
          </button>
        </div>
        <Link to={"/requests/fetch"} onClick={scroll.scrollToTop}>
          <button className="btn btn-sm mt-4"> Go back </button>
        </Link>
      </div>
    </div>
  );
};

export default RequestDetails;
