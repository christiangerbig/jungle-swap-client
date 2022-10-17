import { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useHandlePlant } from "../../custom-hooks/useHandlePlant";
import { Plant, PlantId } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import PlantItems from "../../components/plants/PlantItems";

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
  const handlePlant = useHandlePlant();
  const { t } = useTranslation();
  const { creator } = plant as Plant;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      handlePlant.fetch(plantId, (): void => {
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
        <PlantItems plant={plant} />
      )}
    </div>
  );
};

export default PlantDetails;
