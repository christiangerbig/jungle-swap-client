import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setErrorMessage } from "../../reducer/jungleSwapSlice";
import { UploadImageData } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import { PlantIO } from "../../lib/plantIO";
import { PlantImageIO } from "../../lib/plantImageIO";
import ErrorMessageOutput from "../../components/errors/ErrorMessageOutput";

const PlantCreateForm = (): JSX.Element => {
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
    routing.protect((): void => {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    });
  }, []);

  const handleUploadPlantImage = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    const { plantImage } = event.target as any;
    const image = plantImage.files[0];
    event.preventDefault();
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    const plantImageIO = new PlantImageIO(dispatch);
    plantImageIO.create(
      uploadForm,
      ({ imageUrl, imagePublicId }: UploadImageData): void => {
        const plantIO = new PlantIO(dispatch);
        plantIO.create(event.target, { imageUrl, imagePublicId }, (): void => {
          history.push("/plants/my-own");
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
        <form
          className="form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            handleUploadPlantImage(event);
          }}
        >
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
          {errorMessage && errorMessage.includes("Form") && (
            <ErrorMessageOutput outputFunction={convertErrorMessage} />
          )}
          <div className="col-12 text-right pr-0">
            <button
              type="submit"
              disabled={buttonState()}
              className="ml-4 mb-2 btn btn-sm form-control is-width-medium"
            >
              {t("button.create")}
            </button>
            <button
              className="ml-4 mb-2 btn btn-sm form-control is-width-medium"
              onClick={(): void => {
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

export default PlantCreateForm;
