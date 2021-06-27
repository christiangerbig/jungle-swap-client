import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class PlantDetails extends Component {

  componentDidMount() {
    const { plantId } = this.props.match.params;
    this.props.onReadPlant(plantId);
  }

  render() {
    const { user, plant, onDeletePlant } = this.props;
    if (!user) {
      return <Redirect to={ "/signup" }/>
    }
    const { _id, name, description, size, image, location, price, creator } = plant;
    if (!creator) {
      return <div/>
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
                    (user._id === creator._id) ? (
                      <div>
                        <Link to={ "/plants/update" }> <button className="btn btn-sm ml-2 btn-outline-dark"> Update </button> </Link>
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