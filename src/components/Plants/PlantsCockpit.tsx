import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { selectIsFetchingPlants } from "../../reducer/jungleSwapSlice";
import WaitSpinner from "../spinners/WaitSpinner";
import PlantSearch from "./PlantSearch";
import PlantsCollection from "./PlantsCollection";

const PlantsCockpit = (): JSX.Element => {
  const isFetchingPlants = useAppSelector(selectIsFetchingPlants);
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-3">
        <h2>{t("texts.home.allPlants.headline")}</h2>
      </div>
      <PlantSearch />
      {isFetchingPlants ? <WaitSpinner /> : <PlantsCollection />}
    </div>
  );
};

export default PlantsCockpit;
