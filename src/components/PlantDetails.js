import React, { useEffect } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { readPlant, deletePlant, scrollToPlants } from "../Reducer/jungleSwapSlice";

const PlantDetails = () => {
  const loggedInUser = useSelector(state => state.jungleSwap.loggedInUser);
  const plant = useSelector(state => state.jungleSwap.plant);
  const { plantId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read plant data and scroll to top as soon as page loads  
  useEffect(
    () => {
      dispatch(readPlant(plantId));
      scroll.scrollToTop();
    },
    []
  );

  // Delete plant
  const handleDeletePlant = (imagePublicId, plantId) => {
    dispatch(deletePlant(imagePublicId, plantId));
    history.push("/");
    dispatch(scrollToPlants());
  }

  if (!loggedInUser) return (<Redirect to={"/signup"} />);

  const { _id, name, description, size, imageUrl, imagePublicId, location, price, creator } = plant;
  if (!creator) return (
    <div class="spinner-grow text-success m-5" role="status">
      <span class="visually-hidden"> <br/> <br/> Loading plant details... </span>
    </div>
  );


  return (
    <div className="container mt-5 row row-md-10 offset-md-4">
      <div className="mt-4 mb-3 pt-4 container">
        <h2> Plant details </h2>
      </div>
      <div className="col">
        <div className="card cardMediumWidth">
          {imageUrl && (<img className="card-img-top mediumPicSize" src={imageUrl} alt={name} />)}
          <div className="ml-2 mt-2"> <span> Name: </span> {name} </div>
          <div className="ml-2 mt-2"> <span> Description: </span> {description} </div>
          <div className="ml-2 mt-2"> <span> Size: </span> {size} cm </div>
          <div className="ml-2 mt-2"> <span> Likes: </span> {location} </div>
          <div className="ml-2 mt-2"> <span> Price: </span> {price} € </div>
          <div className="ml-2 mt-2 col justify-content-center">
            <div className="row-2 justify-content-center">
              <div className="card-body">
                {
                  loggedInUser._id === creator._id ? (
                    <div>
                      <Link to={"/plants/update"}> <button className="btn btn-sm ml-2 btn-outline-dark"> Update </button> </Link>
                      <button className="btn btn-sm ml-2 btn-outline-dark" onClick={() => handleDeletePlant(imagePublicId, _id)}> Delete </button>
                    </div>
                  ) : (
                    <div>
                      <Link to="/plants/checkout"> <button className="btn btn-sm ml-2 btn-outline-dark"> Buy </button> </Link>
                      <Link to="/requests/create"> <button className="btn btn-sm ml-2 btn-outline-dark"> Swap </button> </Link>
                    </div>
                  )
                }
                <Link to={"/"} onClick={() => dispatch(scrollToPlants())}> <button className="btn btn-sm ml-2"> Go back </button> </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantDetails;