import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";

const CreateRequestForm = ({location, error, onCreateRequest, onClearError}) => {
  useEffect(
    () => {
      onClearError();
      scroll.scrollToTop();
    },
    []
  );

  const {plant} = location;
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your mesage </h2>
        <form onSubmit={(event) => onCreateRequest(event, plant)}>
          <div>
            <textarea className="mb-4" name="message" cols="35" rows="7"/>
          </div>
          {
            error ? <p className="warningColor"> {error} </p> : null            
          }
          <button className="btn btn-sm btn-outline-dark" type="submit"> Send </button>
          <Link to={`/plants/read/${plant._id}`}> <button className="btn btn-sm mx-2"> Go back </button> </Link>
        </form>
      </div>
    </div>
  );
}

export default CreateRequestForm;