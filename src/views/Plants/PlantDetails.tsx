import { useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { User, Plant, PlantId } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import { PlantIO } from "../../lib/plantIO";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import PlantDetailsUserItems from "./PlantDetailsUserItems";

const PlantDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isFetchingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlant
  );
  const { plantId } = useParams<{ plantId: PlantId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { name, description, size, imageUrl, location, price, creator } =
    plant as Plant;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      const plantIO = new PlantIO(dispatch);
      plantIO.fetch(plantId, (): void => {
        scroll.scrollToTop();
      });
    });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/sign-up"} />;
  }

  return (
    <div className="container mt-5 row row-md-10 offset-md-4">
      <div className="mt-4 mb-3 pt-4 container">
        <h2>{t("texts.plants.plantDetails.headline")}</h2>
      </div>
      {isFetchingPlant || !creator ? (
        <WaitSpinner />
      ) : (
        <div className="col">
          <div className="card is-card-width-large">
            <img
              src={imageUrl}
              loading="lazy"
              alt={name}
              className="card-img-top is-image-size-large"
            />
            <div className="ml-2 mt-2">
              <span className="is-text-bold">
                {t("texts.plants.plantDetails.name")}
              </span>{" "}
              {name}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">
                {t("texts.plants.plantDetails.description")}
              </span>{" "}
              {description}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">
                {t("texts.plants.plantDetails.size")}
              </span>{" "}
              {size} {t("texts.plants.plantDetails.sizeUnit")}
            </div>
            <div className="ml-2 mt-2">
              <span>{t("texts.plants.plantDetails.likes")}</span> {location}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">
                {t("texts.plants.plantDetails.price")}
              </span>{" "}
              {price} {t("texts.plants.plantDetails.currency")}
            </div>
            <div className="ml-2 mt-2 col justify-content-center">
              <div className="row-2 justify-content-center">
                <div className="card-body text-right pt-0">
                  <PlantDetailsUserItems
                    isCreator={loggedInUser._id === (creator as User)._id}
                  />
                  <button
                    className="btn btn-sm ml-2 form-control is-width-medium mb-3"
                    onClick={(): void => {
                      history.goBack();
                    }}
                  >
                    {t("button.goBack")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetails;
