import { useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import WaitSpinner from "../components/WaitSpinner";
import MyPlantsOverview from "../components/MyPlantsOverview";

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
      scroll.scrollToTop();
    });
  }, []);

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-5">
        <h2>{t("myPlants.headline")}</h2>
      </div>
      {isFetchingPlants ? <WaitSpinner /> : <MyPlantsOverview />}
    </div>
  );
};

export default MyPlants;
