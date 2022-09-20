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

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Name missing":
        return t("errors.plant.form.nameMissing");
      case "Form: Description missing":
        return t("errors.plant.form.descriptiomMissing");
      case "Form: Size missing":
        return t("errors.plant.form.sizeMissing");
      case "Form: Location missing":
        return t("errors.plant.form.locationMissing");
      case "Form: Price missing":
        return t("errors.plant.form.priceMissing");
      case "Form: Image missing":
        return t("errors.plant.form.imageMissing");
      default:
        return t("errors.general");
    }
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 fullscreen">
      <div className="mt-5 col-12 col-md-6 offset-md-4">
        <h2 className="mb-5 text-left"> {t("createPlantForm.headline")} </h2>
        <form
          className="form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            handleUploadPlantImage(event);
          }}
        >
          <label htmlFor="enterName">{t("createPlantForm.name")}</label>
          <input
            type="text"
            id="enterName"
            name="name"
            placeholder={t("createPlantForm.enterPlaceholder")}
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterDescription">
            {t("createPlantForm.description")}
          </label>
          <input
            type="text"
            id="enterDescription"
            name="description"
            placeholder={t("createPlantForm.enterPlaceholder")}
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterSize">{t("createPlantForm.size")}</label>
          <input
            type="number"
            id="enterSize"
            name="size"
            placeholder={t("createPlantForm.enterPlaceholder")}
            min="1"
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterLocation">{t("createPlantForm.location")}</label>
          <select
            id="enterLocation"
            name="location"
            className="mb-4 form-control p-2"
          >
            <option> {t("selectLocation.title")} </option>
            <option value="sun"> {t("selectLocation.sun")} </option>
            <option value="shade"> {t("selectLocation.shade")} </option>
            <option value="sun and shade">
              {t("selectLocation.sunAndShade")}
            </option>
          </select>
          <label htmlFor="enterPrice">{t("createPlantForm.price")}</label>
          <input
            type="number"
            id="enterPrice"
            name="price"
            placeholder={t("createPlantForm.enterPlaceholder")}
            min="1"
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterImage">{t("createPlantForm.image")}</label>
          <input
            type="file"
            id="enterImage"
            name="plantImage"
            className="mb-4 form-control is-width-full"
          />
          {errorMessage && errorMessage.includes("Form") && (
            <span className="is-danger is-text-bold is-display-block">
              {printErrorMessage(errorMessage)}
            </span>
          )}
          <div className="col-12 text-right pr-0">
            <button
              type="submit"
              disabled={isUploadingPlantImage || isCreatingPlant ? true : false}
              className="ml-4 mb-2 btn btn-sm form-control is-width-s"
            >
              {t("button.create")}
            </button>
            <button
              className="ml-4 mb-2 btn btn-sm form-control is-width-s"
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
