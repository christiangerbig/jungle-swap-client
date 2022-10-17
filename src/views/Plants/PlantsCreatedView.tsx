import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useHandlePlant } from "../../custom-hooks/useHandlePlant";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import PlantsCreatedCollection from "../../components/plants/PlantsCreatedCollection";

const PlantsCreatedView = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );
  const dispatch = useAppDispatch();
  const handlePlant = useHandlePlant();
  const { t } = useTranslation();

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      handlePlant.fetchAll((): void => {
        scroll.scrollToTop();
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
