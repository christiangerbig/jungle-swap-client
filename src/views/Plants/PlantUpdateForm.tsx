import { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setPlant, setDestroyImageData } from "../../reducer/jungleSwapSlice";
import { Plant, UploadImageData } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import { PlantImageIO } from "../../lib/plantImageIO";
import { PlantIO } from "../../lib/plantIO";
import WaitSpinner from "../../components/spinners/WaitSpinner";

const PlantUpdateForm = (): JSX.Element => {
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
  const selectElementRef = useRef<HTMLSelectElement | null>(null);
  const { t } = useTranslation();
  const { name, description, size, imageUrl, price } = plant as Plant;

  useEffect(() => {
    const setPlantLocation = ({ location }: Plant): void => {
      if (location) {
        (selectElementRef.current as HTMLSelectElement).value = location;
      }
    };

    const routing = new Routing(dispatch);
    routing.protect((): void => {
      setPlantLocation(plant);
      scroll.scrollToTop();
    });
  }, []);

  const handlePlantEntryChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    plant: Plant
  ): void => {
    const clonedPlant: Plant = JSON.parse(JSON.stringify(plant));
    switch (target.name) {
      case "name":
        clonedPlant.name = target.value;
        break;
      case "description":
        clonedPlant.description = target.value;
        break;
      case "size":
        clonedPlant.size = target.value as unknown as number;
        break;
      case "location":
        clonedPlant.location = target.value;
        break;
      case "price":
        clonedPlant.price = target.value as unknown as number;
    }
    dispatch(setPlant(clonedPlant));
  };

  const handlePlantImageChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    { imagePublicId }: Plant
  ): void => {
    const image = (target.files as any)[0];
    dispatch(setDestroyImageData({ imagePublicId }));
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    const plantImageIO = new PlantImageIO(dispatch);
    plantImageIO.create(
      uploadForm,
      ({ imageUrl, imagePublicId }: UploadImageData): void => {
        const clonedPlant = JSON.parse(JSON.stringify(plant));
        clonedPlant.imagePublicId = imagePublicId;
        clonedPlant.imageUrl = imageUrl;
        dispatch(setPlant(clonedPlant));
      }
    );
  };

  const handleUpdatePlant = () => {
    if (destroyImageData) {
      const plantImageIO = new PlantImageIO(dispatch);
      plantImageIO.delete(destroyImageData);
    }
    const plantIO = new PlantIO(dispatch);
    plantIO.update(plant, (): void => {
      history.goBack();
    });
  };

  const buttonState = (): boolean => {
    return isUploadingPlantImage || isDeletingPlantImage || isUpdatingPlant
      ? true
      : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-12 col-md-6 offset-md-6">
        <h2 className="mt-5 mb-4 text-left">
          {t("texts.plants.updatePlant.form.headline")}
        </h2>
        <div className="card is-card-width-large mb-5">
          {isUploadingPlantImage || isDeletingPlantImage || isUpdatingPlant ? (
            <WaitSpinner />
          ) : (
            <img
              src={imageUrl}
              alt={name}
              className="mb-2 is-image-size-medium"
            />
          )}
          <div className="card-body">
            <label htmlFor="updateName">
              {t("texts.plants.updatePlant.form.name")}
            </label>
            <input
              type="text"
              id="updateName"
              name="name"
              value={name}
              className="mb-4 form-control"
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateDescription">
              {t("texts.plants.updatePlant.form.description")}
            </label>
            <input
              type="text"
              id="updateDescription"
              name="description"
              value={description}
              className="mb-4 form-control"
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateSize">
              {t("texts.plants.updatePlant.form.size")}
            </label>
            <input
              type="number"
              id="updateSize"
              name="size"
              value={size}
              min="1"
              className="mb-4 form-control"
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateLocation">
              {t("texts.plants.updatePlant.form.location")}
            </label>
            <select
              ref={selectElementRef}
              id="updateLocation"
              name="location"
              className="mb-4 form-control px-2"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                handlePlantEntryChange(event, plant);
              }}
            >
              <option value="sun">{t("select.location.sun")}</option>
              <option value="shade">{t("select.location.shade")}</option>
              <option value="sun and shade">
                {t("select.location.sunAndShade")}
              </option>
            </select>
            <label htmlFor="updatePrice">
              {t("texts.plants.updatePlant.form.price")}
            </label>
            <input
              type="number"
              id="updatePrice"
              name="price"
              value={price}
              min="1"
              className="mb-4 form-control"
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handlePlantEntryChange(event, plant);
              }}
            />
            <label htmlFor="updateImage">
              {t("texts.plants.updatePlant.form.image")}
            </label>
            <input
              type="file"
              id="updateImage"
              name="plantImage"
              className="mb-4 form-control"
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handlePlantImageChange(event, plant);
              }}
            />
            <div className="col-12 text-right pr-0">
              <button
                disabled={buttonState()}
                className="btn btn-sm ml-4 form-control is-width-medium mb-2"
                onClick={handleUpdatePlant}
              >
                {t("button.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantUpdateForm;
