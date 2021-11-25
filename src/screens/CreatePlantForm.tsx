import { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addPlant,
  createPlant,
  Plant,
  checkUserLoggedIn,
  setError,
  setLoggedInUser,
  uploadPlantImage,
  setIsUploadingPlantImage,
  setIsCreatingPlant,
  UploadPlantImageResponse,
  setUploadImageData,
  UploadImageData,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const CreatePlantForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUploadingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUploadingPlantImage
  );
  const uploadImageData = useAppSelector(
    (state: RootState) => state.jungleSwap.uploadImageData
  );
  const isCreatingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isCreatingPlant
  );
  const error = useAppSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads if the user is logged in
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setError(null));
        scroll.scrollToTop();
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Create plant
  const handleCreatePlant = (event: any): void => {
    event.preventDefault();
    // Upload plant image
    const {name, description, size, location, price, plantImage} = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    dispatch(setIsUploadingPlantImage(true));
    dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: UploadPlantImageResponse) => {
        // Create new plant
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
            dispatch(setError(rejectedValue.message));
          });
      })
      .catch((rejectedValue: any) => {
        dispatch(setError(rejectedValue.message));
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
            handleCreatePlant(event);
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
          {error && <p className="warningColor"> {error} </p>}
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
