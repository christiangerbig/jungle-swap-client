import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useHandlePlantImage } from "../../app/custom-hooks/useHandlePlantImage";
import { useHandlePlant } from "../../app/custom-hooks/useHandlePlant";
import {
  selectErrorMessage,
  selectIsCreatingPlant,
  selectIsUploadingPlantImage,
  selectLoggedInUser,
  setErrorMessage,
} from "../../reducer/jungleSwapSlice";
import { UploadImageData } from "../../app/typeDefinitions";
import ErrorMessage from "../../components/helpers/ErrorMessage";

const PlantCreateForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isUploadingPlantImage = useAppSelector(selectIsUploadingPlantImage);
  const isCreatingPlant = useAppSelector(selectIsCreatingPlant);
  const errorMessage = useAppSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { push, goBack } = useHistory();
  const { protectRoute } = useRouting();
  const { createImage } = useHandlePlantImage();
  const { createPlant } = useHandlePlant();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;

  useEffect(() => {
    protectRoute((): void => {
      dispatch(setErrorMessage(null));
      scrollToTop();
    });
  }, []);

  const handleUploadPlantImage = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    const { target } = event as any;
    const { plantImage } = target as any;
    const image = plantImage.files[0];
    event.preventDefault();
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    createImage(
      uploadForm,
      ({ imageUrl, imagePublicId }: UploadImageData): void => {
        createPlant(target, { imageUrl, imagePublicId }, (): void => {
          push("/plants/my-own");
        });
      }
    );
  };

  const convertErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Name missing":
        return t("errorTexts.plants.createPlant.form.nameMissing");
      case "Form: Description missing":
        return t("errorTexts.plants.createPlant.form.descriptionMissing");
      case "Form: Size missing":
        return t("errorTexts.plants.createPlant.form.sizeMissing");
      case "Form: Location missing":
        return t("errorTexts.plants.createPlant.form.locationMissing");
      case "Form: Price missing":
        return t("errorTexts.plants.createPlant.form.priceMissing");
      case "Form: Image missing":
        return t("errorTexts.plants.createPlant.form.imageMissing");
      default:
        return t("errorTexts.general");
    }
  };

  const buttonState = (): boolean => {
    return isUploadingPlantImage || isCreatingPlant ? true : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 fullscreen">
      <div className="mt-5 col-12 col-md-6 offset-md-4">
        <h2 className="mb-5 text-left">
          {t("texts.plants.createPlant.form.headline")}
        </h2>
        <form className="form-style" onSubmit={handleUploadPlantImage}>
          <label htmlFor="enterName">
            {t("texts.plants.createPlant.form.name")}
          </label>
          <input
            type="text"
            id="enterName"
            name="name"
            placeholder={t("texts.plants.createPlant.form.enterPlaceholder")}
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterDescription">
            {t("texts.plants.createPlant.form.description")}
          </label>
          <input
            type="text"
            id="enterDescription"
            name="description"
            placeholder={t("texts.plants.createPlant.form.enterPlaceholder")}
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterSize">
            {t("texts.plants.createPlant.form.size")}
          </label>
          <input
            type="number"
            id="enterSize"
            name="size"
            placeholder={t("texts.plants.createPlant.form.enterPlaceholder")}
            min="1"
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterLocation">
            {t("texts.plants.createPlant.form.location")}
          </label>
          <select
            id="enterLocation"
            name="location"
            className="mb-4 form-control p-2"
          >
            <option>{t("select.location.title")}</option>
            <option value="sun">{t("select.location.sun")}</option>
            <option value="shade">{t("select.location.shade")}</option>
            <option value="sun and shade">
              {t("select.location.sunAndShade")}
            </option>
          </select>
          <label htmlFor="enterPrice">
            {t("texts.plants.createPlant.form.price")}
          </label>
          <input
            type="number"
            id="enterPrice"
            name="price"
            placeholder={t("texts.plants.createPlant.form.enterPlaceholder")}
            min="1"
            className="mb-4 form-control is-width-full"
          />
          <label htmlFor="enterImage">
            {t("texts.plants.createPlant.form.image")}
          </label>
          <input
            type="file"
            id="enterImage"
            name="plantImage"
            className="mb-4 form-control is-width-full"
          />
          <ErrorMessage
            message={errorMessage}
            outputFunction={convertErrorMessage}
          />
          <div className="col-12 text-right pr-0">
            <button
              type="submit"
              disabled={buttonState()}
              className="mx-2 mb-2 btn btn-sm form-control is-width-medium"
            >
              {t("button.create")}
            </button>
            <button
              className="mx-2 mb-2 btn btn-sm form-control is-width-medium"
              onClick={(): void => {
                goBack();
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

export default PlantCreateForm;
