import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setLoggedInUser,
  checkUserLoggedIn,
  setPlant,
  setIsUpdatingPlant,
  updatePlant,
  setPlantChanges,
  setIsUploadingPlantImage,
  uploadPlantImage,
  setIsDeletingPlantImage,
  deletePlantImage,
  setDestroyImageData,
  scrollToPlants,
} from "../reducer/jungleSwapSlice";
import {
  Plant,
  UploadImageData,
  DestroyImageData,
} from "../reducer/typeDefinitions";
import { RootState } from "../store";
import LoadingSpinner from "../components/LoadingSpinner";

const UpdatePlantForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUploadingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUploadingPlantImage
  );
  const isDeletingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingPlantImage
  );
  const destroyImageData = useAppSelector(
    (state: RootState) => state.jungleSwap.destroyImageData
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isUpdatingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isUpdatingPlant
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads if the user ia logged in
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        scroll.scrollToTop();
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Check which plant values have changed
  const handlePlantEntryChange = (
    { target }: any,
    plant: Plant,
    itemNumber: number
  ): void => {
    const clonedPlant: Plant = JSON.parse(JSON.stringify(plant));
    // eslint-disable-next-line default-case
    switch (itemNumber) {
      case 0:
        clonedPlant.name = target.value;
        break;
      case 1:
        clonedPlant.description = target.value;
        break;
      case 2:
        clonedPlant.size = target.value;
        break;
      case 3:
        clonedPlant.location = target.value;
        break;
      case 4:
        clonedPlant.price = target.value;
    }
    dispatch(setPlant(clonedPlant));
  };

  // Plant image changed
  // Upload a new image and update plant values
  const handleImageChange = ({ target }: any, plant: Plant): void => {
    const image = target.files[0];
    const { imagePublicId } = plant as Plant;
    dispatch(setDestroyImageData({ imagePublicId }));
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    dispatch(setIsUploadingPlantImage(true));
    dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: UploadImageData) => {
        const clonedPlant = JSON.parse(JSON.stringify(plant));
        clonedPlant.imagePublicId = imagePublicId;
        clonedPlant.imageUrl = imageUrl;
        dispatch(setPlant(clonedPlant));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  // Delete old plant image
  const handleDeletePlantImage = (destroyImageData: DestroyImageData): void => {
    dispatch(setIsDeletingPlantImage(true));
    dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then(() => {
        return;
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  // Update plant values
  const handleUpdatePlant = ({
    _id,
    name,
    description,
    size,
    imageUrl,
    imagePublicId,
    location,
    price,
  }: Plant): void => {
    const updatedPlant: Plant = {
      name,
      description,
      size,
      imageUrl,
      imagePublicId,
      location,
      price,
    };
    dispatch(setIsUpdatingPlant(true));
    dispatch(updatePlant({ plantId: _id, updatedPlant }))
      .unwrap()
      .then((updatedPlant) => {
        dispatch(setPlantChanges(updatedPlant));
        history.push("/");
        dispatch(scrollToPlants());
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }
  const { name, description, size, imageUrl, price } = plant as Plant;

  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-12 col-md-6 offset-md-6">
        <h2 className="mt-5 mb-4 text-left"> Update your plant </h2>
        <div className="card cardMediumWidth mb-5">
          {isUploadingPlantImage || isDeletingPlantImage || isUpdatingPlant ? (
            <LoadingSpinner />
          ) : (
            <img className="mb-2 smallPicSize" src={imageUrl} alt={name} />
          )}
          <div className="card-body">
            <label htmlFor="updateName"> Name </label>
            <input
              className="mb-4 form-control"
              type="text"
              onChange={(event) => {
                handlePlantEntryChange(event, plant, 0);
              }}
              value={name}
              id="updateName"
            />
            <label htmlFor="updateDescription"> Description </label>
            <input
              className="mb-4 form-control"
              type="text"
              onChange={(event) => {
                handlePlantEntryChange(event, plant, 1);
              }}
              value={description}
              id="updateDescription"
            />
            <label htmlFor="updateSize"> Size (cm) </label>
            <input
              className="mb-4 form-control"
              type="number"
              onChange={(event) => {
                handlePlantEntryChange(event, plant, 2);
              }}
              value={size}
              id="updateSize"
            />
            <label htmlFor="updateLocation"> Location </label>
            <select
              className="mb-4 form-control px-2"
              onChange={(event) => {
                handlePlantEntryChange(event, plant, 3);
              }}
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
              onChange={(event) => {
                handlePlantEntryChange(event, plant, 4);
              }}
              value={price}
              id="updatePrice"
            />
            <label htmlFor="updateImage"> Image </label>
            <input
              className="mb-4 form-control"
              onChange={(event) => {
                handleImageChange(event, plant);
              }}
              type="file"
              id="updateImage"
            />
            <div className="col-12 text-right pr-0">
              <button
                className="btn btn-sm ml-4 form-control smallWidth mb-2"
                disabled={
                  isUploadingPlantImage ||
                  isDeletingPlantImage ||
                  isUpdatingPlant
                    ? true
                    : false
                }
                onClick={() => {
                  handleDeletePlantImage(destroyImageData);
                  handleUpdatePlant(plant);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePlantForm;
