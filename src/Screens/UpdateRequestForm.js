import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { setRequest, updateRequest } from "../reducer/jungleSwapSlice";

const UpdateRequestForm = () => {
  const request = useSelector(state => state.jungleSwap.request);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(
    () => scroll.scrollToTop(),
    []
  );

  // Create reply
  const handleCreateReply = ({ target }, request) => {
    const cloneRequest = JSON.parse(JSON.stringify(request));
    cloneRequest.reply = target.value;
    dispatch(setRequest(cloneRequest));
  };

  // Update request
  const handleUpdateRequest = ({ _id, buyer, seller, plant, message, reply }, history) => {
    const updatedRequest = {
      buyer,
      seller,
      plant,
      message,
      reply
    };
    dispatch(updateRequest({ requestId: _id, updatedRequest, history }));
  };

  const { _id, message } = request;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Reply your request </h2>
        <div className="card cardSmallWidth mb-5">
          <div className="card-body">
            <p> {message} </p>
            <textarea className="mb-4" name="reply" cols="31" rows="6" placeholder="Your reply" onChange={event => handleCreateReply(event, request)} />
            <div className="row justify-content-around">
              <button className="btn btn-sm btn-outline-dark" onClick={() => handleUpdateRequest(request, history)}> Submit </button>
              <Link to={`/requests/read/${_id}`}> <button className="btn btn-sm mx-2"> Go back </button> </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequestForm;