import { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { createPlant, Plant, setError } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const CreatePlantForm = () => {
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const error = useSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads and scroll to plants section during cleanup
  useEffect(() => {
    dispatch(setError(null));
    scroll.scrollToTop();
  }, []);

  // Create plant
  const handleCreatePlant = (event: any, history: any) => {
    event.preventDefault();
    const { name, description, size, plantImage, location, price } =
      event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    const plant: Plant = {
      name: name.value,
      description: description.value,
      size: size.value,
      location: location.value,
      price: price.value,
    };
    dispatch(createPlant({ uploadForm, plant, history }));
  };

  if (!loggedInUser) return <Redirect to={"/signup"} />;

  return (
    <div className="container row mt-5 fullscreen">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-6">
        <h2 className="mb-5 text-center"> Create a plant </h2>
        <form onSubmit={(event) => handleCreatePlant(event, history)}>
          <label htmlFor="enterName"> Name </label>
          <input
            className="mb-4 form-control"
            name="name"
            type="text"
            placeholder="Enter"
            id="enterName"
          />
          <label htmlFor="enterDescription"> Description </label>
          <input
            className="mb-4 form-control"
            name="description"
            type="text"
            placeholder="Enter"
            id="enterDescription"
          />
          <label htmlFor="enterSize"> Size (cm) </label>
          <input
            className="mb-4 form-control"
            name="size"
            type="number"
            min="1"
            placeholder="Enter"
            id="enterSize"
          />
          <label htmlFor="enterLocation"> Location </label>
          <select className="mb-4 form-control p-2" name="location" id="enterLocation">
            <option> Select location </option>
            <option value="sun"> sun </option>
            <option value="shade"> shade </option>
            <option value="sun and shade"> sun and shade </option>
          </select>
          <label htmlFor="enterPrice"> Price (EUR) </label>
          <input
            className="mb-4 form-control"
            name="price"
            type="number"
            min="1"
            placeholder="Enter"
            id="enterPrice"
          />
          <label htmlFor="enterImage"> Image </label>
          <input className="mb-4 form-control" name="plantImage" type="file" id="enterImage"/>
          {error && <p className="warningColor"> {error} </p>}
          <div className="col-12 text-right">
            <button className="btn btn-sm form-control smallWidth ml-4 mb-2" type="submit">
              Create
            </button>
            <Link to={"/"}>
              <button className="btn btn-sm form-control smallWidth ml-4 mb-2"> Go back </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
