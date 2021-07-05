import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";

class RequestsPage extends Component {

  componentDidMount() {
    const {onFetchAllRequests, onResetNewRequestsReceived} = this.props;
    onFetchAllRequests();
    onResetNewRequestsReceived();
    scroll.scrollToTop();
  }
  
  render() {
    const {user, requests, currentRequestsNumber, onResetNewRequestsReceived} = this.props;
    if (!user) return (<Redirect to={"/signup"}/>);
    if (!requests) return (
      <div class="spinner-grow text-success m-5" role="status">
        <span class="visually-hidden"> Loading... </span>
      </div>
    );
    return (
      <div className="container row mt-5">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mb-5"> Your messages </h2>
          <Link to={"/"} onClick={() => {onResetNewRequestsReceived(); scroll.scrollToTop();}}> <button className="btn btn-sm mt-4"> Go back </button> </Link>
          {
            requests.map(
              (request) => {
                const {_id, buyer, seller, plant} = request;
                return (
                  (seller._id === user._id) ? (
                    <div className="card p-3 mt-4 " key={_id}>
                      <h4> Request for: {plant.name} </h4>
                      <h5> by: {buyer.username} </h5>
                      <div>
                        <Link className="btn btn-outline-dark" to={`/requests/read/${_id}`}> Details </Link>
                      </div>
                    </div>
                  ) : null
                );
              } 
            )
          }
          {
            (currentRequestsNumber === 0) ? null : <Link to={"/"} onClick={() => {onResetNewRequestsReceived(); scroll.scrollToTop();}}> <button className="btn btn-sm mt-4"> Go back </button> </Link>
          }
        </div>
      </div>
    );
  }
}

export default RequestsPage;