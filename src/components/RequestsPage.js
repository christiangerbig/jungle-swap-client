import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class RequestsPage extends Component {

  componentDidMount() {
    this.props.onFetchAllRequests();
  }
  
  render() {
    const { user, requests } = this.props
    if (!user) {
      return <Redirect to={ "/signup" }/>
    }
    return (
      <div className="container row mt-5">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-5"> Your messages </h2>
          {
            requests.map(
              (request) => {
                const { _id, seller, plant, message} = request
                return (
                  (seller === user._id) ? (
                    <div className="card p-3 mt-4 " key={ _id }>
                      <h4> Request for { plant.name } </h4>
                      <p> { message } </p>
                    </div>
                  ) : (
                    null
                  )
                );
              } 
            )
          }
          <Link to={ `/` }> 
            <button className="btn btn-sm mt-4"> Go back </button> 
          </Link>
        </div>
      </div>
    );
  }
}

export default RequestsPage;