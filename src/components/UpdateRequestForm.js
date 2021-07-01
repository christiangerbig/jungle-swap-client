import React, { Component } from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

class UpdateRequestForm extends Component {

  componentDidMount() {
    scroll.scrollToTop();
  }

  render() {
    const { request, onUpdateRequest } = this.props;
    const { message } = request;
    return (
      <div className="container row mt-5 ">
        <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-4"> Reply your request </h2>
          <div className="card cardSmallWidth mb-5">
            <div className="card-body">
              <p> { message } </p>
              <div>
                <textarea className="mb-4" name="reply" cols="35" rows="4"/>
              </div>
              <div className="row justify-content-around">
                <button className="btn btn-sm btn-outline-dark" onClick={() => onUpdateRequest(request)}> Submit </button>
                <Link to={"/requests/fetch"}>
                  <button className="btn btn-sm mx-2"> Go back </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateRequestForm;