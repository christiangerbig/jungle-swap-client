import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import WaitSpinner from "../Spinners/WaitSpinner";
import SearchPlant from "./SearchPlant";
import PlantsOverview from "../Plants/PlantsOverview";

const AllPlants = (): JSX.Element => {
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-3">
        <h2>{t("texts.home.allPlants.headline")}</h2>
      </div>
      <SearchPlant />
      {isFetchingPlants ? <WaitSpinner /> : <PlantsOverview />}
    </div>
  );
};

export default AllPlants;
