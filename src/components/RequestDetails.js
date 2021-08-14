import React, { useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { readRequest, deleteRequest, decreaseAmountOfRequests } from "../Reducer/jungleSwapSlice";

const RequestDetails = () => {
  const request = useSelector(state => state.jungleSwap.request);
  const { requestId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read request and scroll to top as soon as page loads
  useEffect(
    () => {
      dispatch(readRequest(requestId));
      scroll.scrollToTop();
    },
    []
  );

  // Delete request
  const handleDeleteRequest = (requestId, history) => {
    dispatch(deleteRequest({ requestId, history }));
    dispatch(decreaseAmountOfRequests());
  }

  const { _id, buyer, plant, message, reply } = request;
  if (!buyer || !plant) return (
    <div class="spinner-grow text-success m-5" role="status">
      <span class="visually-hidden"> <br /> <br /> Loading request... </span>
    </div>
  );

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your request </h2>
        <h4> for: {plant.name} </h4>
        <h5> by: {buyer.username} </h5>
        <p> {message} </p>
        {
          reply && (
            <div>
              <h5> Your reply: </h5>
              <p> {reply} </p>
            </div>
          )
        }
        <div>
          {!reply && (<Link to={`/requests/update/${_id}`}> <button className="btn btn-sm ml-2 btn-outline-dark"> Reply </button> </Link>)}
          <button className="btn btn-sm ml-2 btn-outline-dark" onClick={() => handleDeleteRequest(_id, history)}> Delete </button>
        </div>
        <Link to={"/requests/fetch"} onClick={scroll.scrollToTop}> <button className="btn btn-sm mt-4"> Go back </button> </Link>
      </div>
    </div>
  );
}

export default RequestDetails;