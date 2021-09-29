import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  imageChange,
  updatePlant,
  setPlant,
  Plant,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const UpdatePlantForm = () => {
  const plant = useSelector((state: RootState) => state.jungleSwap.plant);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(() => scroll.scrollToTop(), []);

  // Check which plant values changed
  const handlePlantEntryChange = (
    { target }: any,
    plant: Plant,
    itemNumber: number
  ) => {
    const clonePlant: Plant = JSON.parse(JSON.stringify(plant));
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
  };

  // Plant image changed
  const handleImageChange = ({ target }: any, plant: Plant) => {
    const image = target.files[0];
    const { imagePublicId } = plant as Plant;
    const destroyImageData = {
      imagePublicId,
    };
    dispatch(imageChange({ destroyImageData, image, plant }));
  };

  const handleUpdatePlant = (
    {
      _id,
      name,
      description,
      size,
      imageUrl,
      imagePublicId,
      location,
      price,
    }: Plant,
    history: any
  ) => {
    const updatedPlant: Plant = {
      name,
      description,
      size,
      imageUrl,
      imagePublicId,
      location,
      price,
    };
    dispatch(updatePlant({ plantId: _id, updatedPlant, history }));
  };

  const { _id, name, description, size, imageUrl, price } = plant as Plant;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Update your plant </h2>
        <div className="card cardMediumWidth mb-5">
          <img className="mb-2 smallPicSize" src={imageUrl} alt={name} />
          <div className="card-body">
            <label htmlFor="updateName"> Name </label>
            <input
              className="mb-4 form-control"
              type="text"
              onChange={(event) => handlePlantEntryChange(event, plant, 0)}
              value={name}
              id="updateName"
            />
            <label htmlFor="updateDescription"> Description </label>
            <input
              className="mb-4 form-control"
              type="text"
              onChange={(event) => handlePlantEntryChange(event, plant, 1)}
              value={description}
              id="updateDescription"
            />
            <label htmlFor="updateSize"> Size (cm) </label>
            <input
              className="mb-4 form-control"
              type="number"
              onChange={(event) => handlePlantEntryChange(event, plant, 2)}
              value={size}
              id="updateSize"
            />
            <label htmlFor="updateLocation"> Location </label>
            <select
              className="mb-4 form-control px-2"
              onChange={(event) => handlePlantEntryChange(event, plant, 3)}
              name="location"
              placeholder="Select"
              id="updateLocation"
            >
              <option value="sun"> sun </option>
              <option value="shade"> shade </option>
              <option value="sun and shade"> sun and shade </option>
            </select>
            <label htmlFor="updatePrice"> Price (EUR) </label>
            <input
              className="mb-4 form-control"
              name="price"
              type="number"
              min="1"
              onChange={(event) => handlePlantEntryChange(event, plant, 4)}
              value={price}
              id="updatePrice"
            />
            <label htmlFor="updateImage"> Image </label>
            <input
              className="mb-4 form-control"
              onChange={(event) => handleImageChange(event, plant)}
              type="file"
              id="updateImage"
            />
              <div className="col-12 text-right pr-0">
              <button
                className="btn btn-sm ml-4 form-control smallWidth mb-2"
                onClick={() => handleUpdatePlant(plant, history)}
              >
                Save
              </button>
              <Link to={`/plants/read/${_id}`}>
                <button className="btn btn-sm ml-4 smallWidth form-control mb-2">
                  Go back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePlantForm;
