import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";

const UpdatePlantForm = ({plant, onImageChange, onPlantEntryChange, onUpdatePlant}) => {
  // Scroll to top as soon as page loads
  useEffect(
    () => scroll.scrollToTop(),
    []
  );

  const {_id, name, description, size, image, price} = plant;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Update your plant </h2>
        <div className="card cardSmallWidth mb-5">
          <img className="mb-2 smallPicSize" src={image} alt={name}/>
          <div className="card-body">
            <input className="mb-2" onChange={event => onImageChange(event, plant)} type="file"/>
            <input className="mb-2"  type="text" onChange={event => onPlantEntryChange(event, 0)} value={ name }/>
            <input className="mb-2"  type="text" onChange={event => onPlantEntryChange(event, 1)} value={description}/>
            <input className="mb-2 smallWidth"  type="number" onChange={event => onPlantEntryChange(event, 2)} value={size}/> cm <br/>
            <select  className="mb-2" onChange={event => onPlantEntryChange(event, 3)} name="location" type="text" placeholder="Select">
              <option value="sun"> sun </option>
              <option value="shade"> shade </option>
              <option value="sun and shade"> sun and shade </option>
            </select> <br/>
            <input className="mb-4 smallWidth" name="price" type="number" min="1" onChange={event => onPlantEntryChange(event, 4)} value={price}/> € 
            <div className="row justify-content-around">
              <button className="btn btn-sm btn-outline-dark" onClick={() => onUpdatePlant(plant)}> Save changes </button>
              <Link to={`/plants/read/${_id}`}> <button className="btn btn-sm mx-2"> Go back </button> </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePlantForm;