import React, { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { createPlant, setError, scrollToPlants } from "../Reducer/jungleSwapSlice";

const CreatePlantForm = () => {
  const loggedInUser = useSelector(state => state.jungleSwap.loggedInUser);
  const error = useSelector(state => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads and scroll to plants section during cleanup
  useEffect(
    () => {
      dispatch(setError(null));
      scroll.scrollToTop();
      return () => dispatch(scrollToPlants);
    },
    []
  );

  // Create plant
  const handleCreatePlant = event => {
    event.preventDefault();
    const { plantImage } = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    const { name, description, size, location, price } = event.target;
    const plant = {
      name: name.value,
      decription: description.value,
      size: size.value,
      location: location.value,
      price: price.value
    }
    dispatch(createPlant({ uploadForm, plant }));
    history.push("/");
  }

  if (!loggedInUser) return (<Redirect to={"/signup"} />);

  return (
    <div className="container row mt-5 fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-6">
        <h2 className="mb-5"> Create a plant </h2>
        <form onSubmit={handleCreatePlant}>
          <input className="mb-4" name="name" type="text" placeholder="Enter name" />
          <input className="mb-4" name="description" type="text" placeholder="Enter description" />
          <input className="mb-4 smallWidth" name="size" type="number" min="1" placeholder="Size" /> cm <br />
          <select className="mb-4 p-1" name="location" type="text">
            <option> Select location </option>
            <option value="sun"> sun </option>
            <option value="shade"> shade </option>
            <option value="sun and shade"> sun and shade </option>
          </select>
          <br />
          <input className="mb-4 smallWidth" name="price" type="number" min="1" placeholder="Price" /> € <br />
          <input className="mb-4" name="plantImage" type="file" />
          {error && (<p className="warningColor"> {error} </p>)}
          <div className="col-12">
            <button className="btn btn-sm btn-outline-dark" type="submit" > Create </button>
            <Link to={"/"}> <button className="btn btn-sm mx-5"> Go back </button> </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlantForm;