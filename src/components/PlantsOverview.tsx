import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Plant } from "../typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const PlantsOverview = (): JSX.Element => {
  const filteredPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.filteredPlants
  );

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {filteredPlants.map((plant: Plant, index: number): JSX.Element => {
        return <PlantThumbnail plant={plant} key={index} />;
      })}
    </div>
  );
};

export default PlantsOverview;
