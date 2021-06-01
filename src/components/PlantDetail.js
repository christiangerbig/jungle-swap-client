import React, { Component, createRef } from "react";
import { Link, Redirect } from "react-router-dom";
import config from "../config";
import axios from "axios";

class PlantDetail extends Component {

  state = {
    plant: {}
  }

  componentDidMount() {
    let plantId = this.props.match.params.plantId;
    axios.get(
      `${config.API_URL}/api/plants/${plantId}`,
      { withCredentials: true }
    )
      .then(
        (response) => {
          this.setState({ plant: response.data });
        }
      )
      .catch(
        () => {
          console.log("Detail fetch failed");
        }
      );
  }

  render() {
    const { plant } = this.state;
    const { onDelete, user } = this.props;
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
              plant.image ? (
                <img className="card-img-top mediumPicSize" src={ plant.image } alt={ plant.name } />
              ) : (
                null
              )
            }
            <div className="ml-2 mt-2"> <span> Name: </span> { plant.name } </div>
            <div className="ml-2 mt-2"> <span> Description: </span> { plant.description } </div>
            <div className="ml-2 mt-2"> <span> Size: </span> { plant.size } cm </div>
            <div className="ml-2 mt-2"> <span> Likes: </span> { plant.location } </div>
            <div className="ml-2 mt-2"> <span> Price: </span> { plant.price } € </div>
            <div className="ml-2 mt-2 col justify-content-center">
              <div className="row-2 justify-content-center">
                <div className="card-body">
                  {
                    (user._id === plant.creator) ? (
                      <>
                        <Link to={`/plant/${plant._id}/edit`}> <button className="btn btn-sm ml-2 btn-outline-dark"> Edit </button> </Link>
                        <button className="btn btn-sm ml-2 btn-outline-dark"
                          onClick={
                            () => {
                              onDelete(plant._id);
                            }
                          }
                        > Delete </button>
                      </>
                    ) : (
                      <>
                        <Link to={
                            { 
                              pathname: `/plant/${plant._id}/checkout`, 
                              plant: plant 
                            }
                        }>
                          <button className="btn btn-sm ml-2 btn-outline-dark"> Buy </button>
                        </Link>
                        <Link to={
                          {
                            pathname: "/request-form",
                            plant: plant
                          }
                        }>
                          <button className="btn btn-sm ml-2 btn-outline-dark"> Swap </button>                      
                        </Link>
                      </>
                    )
                  }
                  <Link to={"/"}>
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

export default PlantDetail;