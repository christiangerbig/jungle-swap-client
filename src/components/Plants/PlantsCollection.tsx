import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectfFilteredPlants,
  selectNumberOfVisibleEntries,
  setNumberOfVisibleEntries,
} from "../../reducer/jungleSwapSlice";
import { Plant } from "../../app/typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const PlantsCollection = (): JSX.Element => {
  const filteredPlants = useAppSelector(selectfFilteredPlants);
  const numberOfVisibleEntries = useAppSelector(selectNumberOfVisibleEntries);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleClickButton = (): void => {
    dispatch(setNumberOfVisibleEntries(numberOfVisibleEntries + 6));
  };

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-3">
        {filteredPlants.map(
          (plant: Plant, index: number): JSX.Element | null => {
            const { _id } = plant;
            return index < numberOfVisibleEntries ? (
              <PlantThumbnail plant={plant} key={_id} />
            ) : null;
          }
        )}
      </div>
      {numberOfVisibleEntries < filteredPlants.length && (
        <div className="is-text-align-center">
          <button
            type="button"
            className="btn btn-sm is-width-medium form-control"
            onClick={handleClickButton}
          >
            {t("button.more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantsCollection;
