import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Routing } from "../../lib/routing";
import { PlantIO } from "../../lib/plantIO";
import WaitSpinner from "../../components/Spinners/WaitSpinner";
import MyPlantsOverview from "../../components/Plants/MyPlantsOverview";

const MyPlants = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      const plantIO = new PlantIO(dispatch);
      plantIO.fetchAll((): void => {
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
      {isFetchingPlants ? <WaitSpinner /> : <MyPlantsOverview />}
    </div>
  );
};

export default MyPlants;
