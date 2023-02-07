import { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { usePlant } from "../../app/custom-hooks/usePlant";
import {
  selectIsFetchingPlant,
  selectLoggedInUser,
  selectPlant,
} from "../../reducer/jungleSwapSlice";
import { Plant, PlantId } from "../../app/typeDefinitions";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import PlantItems from "../../components/plants/PlantItems";

const PlantDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const plant = useAppSelector(selectPlant);
  const isFetchingPlant = useAppSelector(selectIsFetchingPlant);
  const { plantId } = useParams<{ plantId: PlantId }>();
  const { protectRoute } = useRouting();
  const { fetchPlant } = usePlant();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;
  const { creator } = plant as Plant;

  useEffect(() => {
    protectRoute((): void => {
      fetchPlant(plantId, (): void => {
        scrollToTop();
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
