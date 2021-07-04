import React, { Component } from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

class RequestDetails extends Component {

  componentDidMount() {
    const { requestId } = this.props.match.params;
    this.props.onReadRequest(requestId);
    scroll.scrollToTop();
  }

  render() {
    const { request, onDeleteRequest } = this.props;
    const { _id, buyer, plant, message, reply } = request;
    if (!buyer || !plant) {
      return (
        <div class="spinner-grow text-success m-5" role="status">
          <span class="visually-hidden"> Loading... </span>
        </div>
      );
    }
    return (
      <div className="container row mt-5 ">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Your request </h2>
        <h4> for: { plant.name } </h4>
        <h5> by: { buyer.username } </h5>
        <p> { message } </p>
        {
          (reply) ? (
            <div>
              <h5> Your reply: </h5>
              <p> { reply } </p>
            </div>
          ) : null
        }
        <div>
          {                  
            (reply) ? null : <Link to={ `/requests/update/${_id}` }> <button className="btn btn-sm ml-2 btn-outline-dark"> Reply </button> </Link>
          }
          <button className="btn btn-sm ml-2 btn-outline-dark" onClick={ () => onDeleteRequest(_id) }> Delete </button>
        </div>
        <Link to={ "/requests/fetch" } onClick={ scroll.scrollToTop }> <button className="btn btn-sm mt-4"> Go back </button> </Link>
      </div>
      </div>
    );
  }
}

export default RequestDetails;