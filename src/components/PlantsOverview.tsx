import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Plant } from "../typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const PlantsOverview = (): JSX.Element => {
  const [numberOfEntries, setNumberOfEntries] = useState(3);
  const filteredPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.filteredPlants
  );
  const { t } = useTranslation();

  const handleClickButton = (): void => {
    setNumberOfEntries(numberOfEntries + 3);
  };

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-3">
        {filteredPlants.map((plant: Plant, index: number): JSX.Element => {
          const { _id } = plant;
          return index < numberOfEntries ? (
            <PlantThumbnail plant={plant} key={_id} />
          ) : (
            <></>
          );
        })}
      </div>
      {numberOfEntries < filteredPlants.length ? (
        <div className="is-text-align-center">
          <button
            type="button"
            className="btn btn-sm is-width-medium form-control"
            onClick={handleClickButton}
          >
            {t("button.more")}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PlantsOverview;
