import { useAppSelector } from "../hooks";
import { Plant } from "../typeDefinitions";
import { RootState } from "../store";
import PlantThumbnail from "../components/PlantThumbnail";
import WaitSpinner from "./WaitSpinner";
import SearchPlant from "./SearchPlant";

const AllPlants = (): JSX.Element => {
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );
  const filteredPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.filteredPlants
  );

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-3">
        <h2> Plants </h2>
      </div>
      <SearchPlant />
      {isFetchingPlants ? (
        <WaitSpinner />
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredPlants.map((plant: Plant, index: number): JSX.Element => {
            return <PlantThumbnail plant={plant} key={index} />;
          })}
        </div>
      )}
    </div>
  );
};

export default AllPlants;
