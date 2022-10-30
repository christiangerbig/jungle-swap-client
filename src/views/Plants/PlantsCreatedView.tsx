import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useHandlePlant } from "../../app/custom-hooks/useHandlePlant";
import {
  selectIsFetchingPlants,
  selectLoggedInUser,
} from "../../reducer/jungleSwapSlice";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import PlantsCreatedCollection from "../../components/plants/PlantsCreatedCollection";

const PlantsCreatedView = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isFetchingPlants = useAppSelector(selectIsFetchingPlants);
  const { protectRoute } = useRouting();
  const { fetchPlants } = useHandlePlant();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;

  useEffect(() => {
    protectRoute((): void => {
      fetchPlants((): void => {
        scrollToTop();
      });
    });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-5">
        <h2>{t("texts.plants.myPlants.headline")}</h2>
      </div>
      {isFetchingPlants ? <WaitSpinner /> : <PlantsCreatedCollection />}
    </div>
  );
};

export default PlantsCreatedView;
