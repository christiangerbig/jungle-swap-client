import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { imageChange, updatePlant, setPlant, scrollToPlants } from "../Reducer/jungleSwapSlice";

const UpdatePlantForm = () => {
  const plant = useSelector(state => state.jungleSwap.plant);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(
    () => scroll.scrollToTop(),
    []
  );

  // Check which plant values changed
  const handlePlantEntryChange = ({ target }, plant, itemNumber) => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    // eslint-disable-next-line default-case
    switch (itemNumber) {
      case 0:
        clonePlant.name = target.value;
        break;
      case 1:
        clonePlant.description = target.value;
        break;
      case 2:
        clonePlant.size = target.value;
        break;
      case 3:
        clonePlant.location = target.value;
        break;
      case 4:
        clonePlant.price = target.value;
    }
    dispatch(setPlant(clonePlant));
  }

  // Plant image changed
  const handleImageChange = ({ target }, plant) => {
    const image = target.files[0];
    const { imagePublicId } = plant;
    const destroyImageData = {
      imagePublicId
    }
    dispatch(imageChange({ destroyImageData, image, plant }));
  }

  const handleUpdatePlant = ({ _id, name, description, size, imageUrl, imagePublicId, location, price }) => {
    const updatedPlant = {
      name,
      description,
      size,
      imageUrl,
      imagePublicId,
      location,
      price
    };
    dispatch(updatePlant({ plantId: _id, updatedPlant, history }));
  }

  const { _id, name, description, size, imageUrl, price } = plant;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Update your plant </h2>
        <div className="card cardSmallWidth mb-5">
          <img className="mb-2 smallPicSize" src={imageUrl} alt={name} />
          <div className="card-body">
            <input className="mb-2" onChange={event => handleImageChange(event, plant)} type="file" />
            <input className="mb-2" type="text" onChange={event => handlePlantEntryChange(event, plant, 0)} value={name} />
            <input className="mb-2" type="text" onChange={event => handlePlantEntryChange(event, plant, 1)} value={description} />
            <input className="mb-2 smallWidth" type="number" onChange={event => handlePlantEntryChange(event, plant, 2)} value={size} /> cm <br />
            <select className="mb-2" onChange={event => handlePlantEntryChange(event, plant, 3)} name="location" type="text" placeholder="Select">
              <option value="sun"> sun </option>
              <option value="shade"> shade </option>
              <option value="sun and shade"> sun and shade </option>
            </select> <br />
            <input className="mb-4 smallWidth" name="price" type="number" min="1" onChange={event => handlePlantEntryChange(event, plant, 4)} value={price} /> €
            <div className="row justify-content-around">
              <button className="btn btn-sm btn-outline-dark" onClick={() => handleUpdatePlant(plant)}> Save changes </button>
              <Link to={`/plants/read/${_id}`}> <button className="btn btn-sm mx-2"> Go back </button> </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePlantForm;