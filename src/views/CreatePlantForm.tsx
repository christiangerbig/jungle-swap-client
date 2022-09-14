import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
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
import { Routing } from "../lib/routing";

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
  const { t } = useTranslation();

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    }
  }, []);

  const handleCreatePlant = (
    { name, description, size, location, price }: any,
    { imageUrl, imagePublicId }: UploadImageData
  ): void => {
    const addPlantAndReturnToHomePage = (plant: Plant): void => {
      dispatch(addPlant(plant));
      history.push("/");
      scroll.scrollToBottom();
    };

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
        addPlantAndReturnToHomePage(plant);
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  const handleUploadPlantImage = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();
    const { plantImage } = event.target as any;
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
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            handleUploadPlantImage(event);
          }}
        >
          <label htmlFor="enterName"> {t("createPlantForm.name")} </label>
          <input
            type="text"
            id="enterName"
            name="name"
            placeholder={t("createPlantForm.enterPlaceholder")}
            className="mb-4 form-control"
          />
          <label htmlFor="enterDescription"> {t("createPlantForm.description")} </label>
          <input
            type="text"
            id="enterDescription"
            name="description"
            placeholder={t("createPlantForm.enterPlaceholder")}
            className="mb-4 form-control"
          />
          <label htmlFor="enterSize"> {t("createPlantForm.size")} </label>
          <input
            type="number"
            id="enterSize"
            name="size"
            placeholder={t("createPlantForm.enterPlaceholder")}
            min="1"
            className="mb-4 form-control"
          />
          <label htmlFor="enterLocation"> {t("createPlantForm.location")} </label>
          <select
            id="enterLocation"
            name="location"
            className="mb-4 form-control p-2"
          >
            <option> {t("selectLocation.title")} </option>
            <option value="sun"> {t("selectLocation.sun")} </option>
            <option value="shade"> {t("selectLocation.shade")} </option>
            <option value="sun and shade"> {t("selectLocation.sunAndShade")} </option>
          </select>
          <label htmlFor="enterPrice"> {t("createPlantForm.price")} </label>
          <input
            type="number"
            id="enterPrice"
            name="price"
            placeholder={t("createPlantForm.enterPlaceholder")}
            min="1"
            className="mb-4 form-control"
          />
          <label htmlFor="enterImage"> {t("createPlantForm.image")} </label>
          <input
            type="file"
            id="enterImage"
            name="plantImage"
            className="mb-4 form-control"
          />
          {errorMessage && <span className="warningColor">{errorMessage}</span>}
          <div className="col-12 text-right pr-0">
            <button
              type="submit"
              disabled={isUploadingPlantImage || isCreatingPlant ? true : false}
              className="btn btn-sm form-control smallWidth ml-4 mb-2"
            >
              {t("button.create")}
            </button>
            <button
              className="btn btn-sm form-control smallWidth ml-4 mb-2"
              onClick={() => {
                history.goBack();
              }}
            >
              {t("button.goBack")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
