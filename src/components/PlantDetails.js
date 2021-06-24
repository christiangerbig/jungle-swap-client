import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import config from "../config";
import axios from "axios";

class PlantDetails extends Component {

  state = {
    plant: {}
  }

  componentDidMount() {
    const { plantId } = this.props.match.params;
    axios.get(
      `${config.API_URL}/api/plants/read/${plantId}`,
      { withCredentials: true }
    )
      .then(
        (response) => this.setState({ plant: response.data })  
      )
      .catch(
        () => console.log("Plant detail fetch failed")
      );
  }
  
  render() {
    const { plant } = this.state;
    const { user, onDeletePlant } = this.props;
    const { _id, name, description, size, image, location, price, creator } = plant;
    if (!user) {
      return <Redirect to={ "/signup" }/>
    }
    return (
      <div className="container mt-5 row row-md-10 offset-md-4">
        <div className="mt-4 mb-3 pt-4 container">
          <h2> Plant details </h2>
        </div>
        <div className="col">
          <div className="card cardMediumWidth">
            {
              (image) ? <img className="card-img-top mediumPicSize" src={ image } alt={ name }/> : null
            }
            <div className="ml-2 mt-2"> <span> Name: </span> { name } </div>
            <div className="ml-2 mt-2"> <span> Description: </span> { description } </div>
            <div className="ml-2 mt-2"> <span> Size: </span> { size } cm </div>
            <div className="ml-2 mt-2"> <span> Likes: </span> { location } </div>
            <div className="ml-2 mt-2"> <span> Price: </span> { price } € </div>
            <div className="ml-2 mt-2 col justify-content-center">
              <div className="row-2 justify-content-center">
                <div className="card-body">
                  {
                    (user._id === creator) ? (
                      <div>
                        <Link to={`/plants/update/${_id}`}> <button className="btn btn-sm ml-2 btn-outline-dark"> Update </button> </Link>
                        <button className="btn btn-sm ml-2 btn-outline-dark" onClick={() => onDeletePlant(_id)}> Delete </button>
                      </div>
                    ) : (
                      <div>
                        <Link to={{ pathname: `/plants/checkout/${_id}`, plant: plant }}>
                          <button className="btn btn-sm ml-2 btn-outline-dark"> Buy </button>
                        </Link>
                        <Link to={{ pathname: "/requests/create", plant: plant }}>
                          <button className="btn btn-sm ml-2 btn-outline-dark"> Swap </button>                      
                        </Link>
                      </div>
                    )
                  }
                  <Link to={ "/" }>
                    <button className="btn btn-sm ml-2"> Go back </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlantDetails;