import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setPlant,
  setIsUpdatingPlant,
  updatePlant,
  setPlantChanges,
  setIsUploadingPlantImage,
  uploadPlantImage,
  setDestroyImageData,
  scrollToPlants,
} from "../reducer/jungleSwapSlice";
import { Plant, PlantId, UploadImageData } from "../typeDefinitions";
import { RootState } from "../store";
import { handleDeletePlantImage, protectRoute } from "../lib/utilities";
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

  useEffect(() => {
    protectRoute(dispatch);
    loggedInUser && scroll.scrollToTop();
  }, []);

  const handlePlantEntryChange = ({ target }: any, plant: Plant): void => {
    const clonedPlant: Plant = JSON.parse(JSON.stringify(plant));
    switch (target.name) {
      case "name":
        clonedPlant.name = target.value;
        break;
      case "decription":
        clonedPlant.description = target.value;
        break;
      case "size":
        clonedPlant.size = target.value;
        break;
      case "location":
        clonedPlant.location = target.value;
        break;
      case "price":
        clonedPlant.price = target.value;
    }
    dispatch(setPlant(clonedPlant));
  };

  const handlePlantImageChange = ({ target }: any, plant: Plant): void => {
    const setImageDataForPlant = (
      plant: Plant,
      { imageUrl, imagePublicId }: UploadImageData
    ) => {
      const clonedPlant = JSON.parse(JSON.stringify(plant));
      clonedPlant.imagePublicId = imagePublicId;
      clonedPlant.imageUrl = imageUrl;
      dispatch(setPlant(clonedPlant));
    };

    const image = target.files[0];
    const { imagePublicId } = plant as Plant;
    dispatch(setDestroyImageData({ imagePublicId }));
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    dispatch(setIsUploadingPlantImage(true));
    dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: UploadImageData) => {
        setImageDataForPlant(plant, { imageUrl, imagePublicId });
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

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
    const setPlantChangesAndReturnToPlantsSection = (updatedPlant: Plant): void => {
      dispatch(setPlantChanges(updatedPlant));
      history.push("/");
      dispatch(scrollToPlants());
    };

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
    dispatch(updatePlant({ plantId: _id as PlantId, updatedPlant }))
      .unwrap()
      .then((updatedPlant) => {
        setPlantChangesAndReturnToPlantsSection(updatedPlant);
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
            <img src={imageUrl} alt={name} className="mb-2 smallPicSize" />
          )}
          <div className="card-body">
            <label htmlFor="updateName"> Name </label>
            <input
              type="text"
              id="updateName"
              name="name"
              value={name}
              className="mb-4 form-control"
              onChange={(event) => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateDescription"> Description </label>
            <input
              type="text"
              id="updateDescription"
              name="description"
              value={description}
              className="mb-4 form-control"
              onChange={(event) => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateSize"> Size (cm) </label>
            <input
              type="number"
              id="updateSize"
              name="size"
              value={size}
              className="mb-4 form-control"
              onChange={(event) => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateLocation"> Location </label>
            <select
              id="updateLocation"
              name="location"
              placeholder="Select"
              className="mb-4 form-control px-2"
              onChange={(event) => {
                handlePlantEntryChange(event, plant);
              }}
            >
              <option value="sun"> sun </option>
              <option value="shade"> shade </option>
              <option value="sun and shade"> sun and shade </option>
            </select>
            <label htmlFor="updatePrice"> Price (EUR) </label>
            <input
              type="number"
              id="updatePrice"
              name="price"
              value={price}
              min="1"
              className="mb-4 form-control"
              onChange={(event) => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateImage"> Image </label>
            <input
              type="file"
              id="updateImage"
              className="mb-4 form-control"
              onChange={(event) => {
                handlePlantImageChange(event, plant);
              }}
            />
            <div className="col-12 text-right pr-0">
              <button
                disabled={
                  isUploadingPlantImage ||
                  isDeletingPlantImage ||
                  isUpdatingPlant
                    ? true
                    : false
                }
                className="btn btn-sm ml-4 form-control smallWidth mb-2"
                onClick={() => {
                  handleDeletePlantImage(destroyImageData, dispatch);
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
