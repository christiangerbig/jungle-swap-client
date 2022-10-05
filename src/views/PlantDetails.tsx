import { useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import WaitSpinner from "../components/WaitSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsFetchingPlant,
  fetchPlant,
  setPlant,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { User, Plant, PlantId } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import PlantDetailsCreatorItems from "../components/PlantDetailsCreatorItems";
import PlantDetailsBuyerItems from "../components/PlantDetailsBuyerItems";

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
    const fetchPlantData = (plantId: PlantId): void => {
      const setPlantAndScrollToTop = (plant: Plant): void => {
        dispatch(setPlant(plant));
        scroll.scrollToTop();
      };

      dispatch(setIsFetchingPlant(true));
      dispatch(fetchPlant(plantId))
        .unwrap()
        .then((plant: Plant) => {
          setPlantAndScrollToTop(plant);
        })
        .catch((rejectedValue: any) => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    };

    const routing = new Routing(dispatch);
    routing.protect();
    loggedInUser && fetchPlantData(plantId);
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/sign-up"} />;
  }

  return (
    <div className="container mt-5 row row-md-10 offset-md-4">
      <div className="mt-4 mb-3 pt-4 container">
        <h2>{t("plantDetails.headline")}</h2>
      </div>
      {isFetchingPlant || !creator ? (
        <WaitSpinner />
      ) : (
        <div className="col">
          <div className="card is-card-width-large">
            <img
              src={imageUrl}
              alt={name}
              className="card-img-top is-image-size-large"
            />
            <div className="ml-2 mt-2">
              <span className="is-text-bold">{t("plantDetails.name")}</span>{" "}
              {name}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">
                {t("plantDetails.description")}
              </span>{" "}
              {description}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">{t("plantDetails.size")}</span>{" "}
              {size} {t("plantDetails.sizeUnit")}
            </div>
            <div className="ml-2 mt-2">
              <span>{t("plantDetails.likes")}</span> {location}
            </div>
            <div className="ml-2 mt-2">
              <span className="is-text-bold">{t("plantDetails.price")}</span>{" "}
              {price} {t("plantDetails.currency")}
            </div>
            <div className="ml-2 mt-2 col justify-content-center">
              <div className="row-2 justify-content-center">
                <div className="card-body text-right pt-0">
                  {loggedInUser._id === (creator as User)._id ? (
                    <PlantDetailsCreatorItems />
                  ) : (
                    <PlantDetailsBuyerItems />
                  )}
                  <button
                    className="btn btn-sm ml-2 form-control is-width-medium mb-3"
                    onClick={() => {
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
