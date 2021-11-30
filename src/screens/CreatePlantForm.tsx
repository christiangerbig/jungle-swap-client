import { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addPlant,
  createPlant,
  setErrorMessage,
  uploadPlantImage,
  setIsUploadingPlantImage,
  setIsCreatingPlant,
} from "../reducer/jungleSwapSlice";
import { Plant, UploadImageData } from "../typeDefinitions";
import { RootState } from "../store";
import { protectPage } from "../lib/utilities";

const CreatePlantForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUploadingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUploadingPlantImage
  );
  const isCreatingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isCreatingPlant
  );
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    // Scroll to top as soon as page loads if the user is logged in
    protectPage(dispatch);
    if (loggedInUser) {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    }
  }, []);

  // Create plant
  const handleCreatePlant = (
    { name, description, size, location, price }: any,
    { imageUrl, imagePublicId }: UploadImageData
  ): void => {
    const newPlant: Plant = {
      name: name.value,
      description: description.value,
      size: size.value,
      imageUrl,
      imagePublicId,
      location: location.value,
      price: price.value,
    };
    dispatch(setIsCreatingPlant(true));
    dispatch(createPlant(newPlant))
      .unwrap()
      .then((plant: Plant) => {
        dispatch(addPlant(plant));
        history.push("/");
        scroll.scrollToBottom();
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  // Upload plant image
  const handleUploadImage = (event: any): void => {
    event.preventDefault();
    const { plantImage } = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    dispatch(setIsUploadingPlantImage(true));
    dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: UploadImageData) => {
        handleCreatePlant(event.target, { imageUrl, imagePublicId });
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 fullscreen">
      <div className="mt-5 col-12 col-md-6 offset-md-6">
        <h2 className="mb-5 text-left"> Create a plant </h2>
        <form
          onSubmit={(event) => {
            handleUploadImage(event);
          }}
        >
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
          <select
            className="mb-4 form-control p-2"
            name="location"
            id="enterLocation"
          >
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
          <input
            className="mb-4 form-control"
            name="plantImage"
            type="file"
            id="enterImage"
          />
          {errorMessage && <p className="warningColor"> {errorMessage} </p>}
          <div className="col-12 text-right pr-0">
            <button
              className="btn btn-sm form-control smallWidth ml-4 mb-2"
              type="submit"
              disabled={isUploadingPlantImage || isCreatingPlant ? true : false}
            >
              Create
            </button>
            <Link to={"/"}>
              <button className="btn btn-sm form-control smallWidth ml-4 mb-2">
                Go back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
