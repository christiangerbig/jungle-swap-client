import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

class RequestsPage extends Component {

  componentDidMount() {
    const { onFetchAllRequests, onResetNewRequestsReceived } = this.props;
    onFetchAllRequests();
    onResetNewRequestsReceived();
    scroll.scrollToTop();
  }
  
  render() {
    const { user, requests, currentRequestsNumber, onDeleteRequest } = this.props
    if (!user) {
      return <Redirect to={ "/signup" }/>
    }
    if (!requests) {
      return <div/>
    }
    return (
      <div className="container row mt-5">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mb-5"> Your messages </h2>
          <Link to={ "/" } onClick={ scroll.scrollToTop }> 
            <button className="btn btn-sm mt-4"> Go back </button> 
          </Link>
          {
            requests.map(
              (request) => {
                const { _id, buyer, seller, plant, message } = request
                return (
                  (seller._id === user._id) ? (
                    <div className="card p-3 mt-4 " key={ _id }>
                      <h4> Request for: { plant.name } </h4>
                      <h5> User: { buyer.username } </h5>
                      <p> { message } </p>
                      <div>
                        <Link to={ "/requests/update" }> <button className="btn btn-sm ml-2 btn-outline-dark"> Reply </button> </Link>
                        <button className="btn btn-sm ml-2 btn-outline-dark" onClick={ () => onDeleteRequest(_id) }> Delete </button>
                      </div>
                    </div>
                  ) : null
                );
              } 
            )
          }
          {
            (currentRequestsNumber !== 0) ? (
              <Link to={ "/" } onClick={ scroll.scrollToTop }> 
                <button className="btn btn-sm mt-4"> Go back </button> 
              </Link>
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default RequestsPage;