import React, { Component } from "react";
import { Link } from "react-router-dom"


class RequestForm extends Component {
  render() {
    const { plant } = this.props.location;
    return (
      <div className="container row mt-5">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-5"> Your mesage </h2>
          <form onSubmit={(event) => this.props.onRequest(event, plant) }>
            <div>
              <textarea className="mb-4" name="message" cols="35" rows="4"/>
            </div>
            <button className="btn btn-sm btn-outline-dark" type="submit"> Send </button>
            <Link to={ `/plants/${plant._id}` }> 
                  <button className="btn btn-sm mx-2"> Go back </button> 
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default RequestForm;