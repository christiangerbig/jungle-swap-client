import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  updatePlant,
  setPlant,
  Plant,
  deletePlantImage,
  uploadPlantImage,
  setPlantChanges,
  scrollToPlants,
  checkUserLoggedIn,
  setLoggedInUser,
  setIsUploadingImage,
  ImagePublicId,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const UpdatePlantForm = (): JSX.Element => {
  const [oldImagePublicId, setOldImagePublicId] = useState("");
  const [newImagePublicId, setNewImagePublicId] = useState("");
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUploadingImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isUploadingImage
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(() => {
    scroll.scrollToTop();
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
    return () => {
      if (newImagePublicId) {
        const destroyImageData = {
          imagePublicId: newImagePublicId,
        };
        dispatch(deletePlantImage(destroyImageData))
          .unwrap()
          .then(() => {
            return;
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      }
    };
  }, []);

  // Check which plant values changed
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
  const handleImageChange = ({ target }: any, plant: Plant): void => {
    const image = target.files[0];
    const { imagePublicId } = plant as Plant;
    imagePublicId && setOldImagePublicId(imagePublicId);
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    dispatch(setIsUploadingImage(true));
    dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: any) => {
        setNewImagePublicId(imagePublicId);
        const clonedPlant = JSON.parse(JSON.stringify(plant));
        clonedPlant.imagePublicId = imagePublicId;
        clonedPlant.imageUrl = imageUrl;
        dispatch(setPlant(clonedPlant));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  const handleUpdatePlant = (
    oldImagePublicId: ImagePublicId,
    {
      _id,
      name,
      description,
      size,
      imageUrl,
      imagePublicId,
      location,
      price,
    }: Plant
  ): void => {
    const destroyImageData = {
      imagePublicId: oldImagePublicId,
    };
    dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then(() => {
        const updatedPlant: Plant = {
          name,
          description,
          size,
          imageUrl,
          imagePublicId,
          location,
          price,
        };
        setNewImagePublicId("");
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
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  const { _id, name, description, size, imageUrl, price } = plant as Plant;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-12 col-md-6 offset-md-6">
        <h2 className="mt-5 mb-4 text-left"> Update your plant </h2>
        <div className="card cardMediumWidth mb-5">
          {isUploadingImage ? (
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
                disabled={isUploadingImage ? true : false}
                onClick={() => {
                  handleUpdatePlant(oldImagePublicId, plant);
                }}
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
