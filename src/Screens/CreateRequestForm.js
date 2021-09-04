import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { createRequest, setError } from "../reducer/jungleSwapSlice";

const CreateRequestForm = () => {
  const plant = useSelector(state => state.jungleSwap.plant);
  const error = useSelector(state => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Set variable and scroll to top as soon as page loads
  useEffect(
    () => {
      dispatch(setError(null));
      scroll.scrollToTop();
    },
    []
  );

  // Create request
  const handleCreateRequest = (event, { _id, creator }, history) => {
    event.preventDefault();
    const { message } = event.target;
    const newRequest = {
      seller: creator._id,
      plant: _id,
      message: message.value
    };
    dispatch(createRequest({ newRequest, history }));
  };

  const { _id, name } = plant;
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4"> Your message </h2>
        <h3 className="mb-4"> {name} </h3>
        <form onSubmit={event => handleCreateRequest(event, plant, history)}>
          <div>
            <textarea className="mb-4" name="message" cols="35" rows="7" />
          </div>
          {error && (<p className="warningColor"> {error} </p>)}
          <button className="btn btn-sm btn-outline-dark" type="submit"> Send </button>
          <Link to={`/plants/read/${_id}`}> <button className="btn btn-sm mx-2"> Go back </button> </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;