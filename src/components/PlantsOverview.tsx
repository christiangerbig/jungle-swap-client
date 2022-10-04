import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setNumberOfVisibleEntries } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import { Plant } from "../typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const PlantsOverview = (): JSX.Element => {
  const filteredPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.filteredPlants
  );
  const numberOfVisibleEntries = useAppSelector(
    (state: RootState) => state.jungleSwap.numberOfVisibleEntries
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleClickButton = (): void => {
    dispatch(setNumberOfVisibleEntries(numberOfVisibleEntries + 3))
  };

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-3">
        {filteredPlants.map((plant: Plant, index: number): JSX.Element => {
          const { _id } = plant;
          return index < numberOfVisibleEntries ? (
            <PlantThumbnail plant={plant} key={_id} />
          ) : (
            <></>
          );
        })}
      </div>
      {numberOfVisibleEntries < filteredPlants.length ? (
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
