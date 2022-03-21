import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import WaitSpinner from "./WaitSpinner";
import SearchPlant from "./SearchPlant";
import PlantsOverview from "./PlantsOverview";

const AllPlants = (): JSX.Element => {
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-3">
        <h2> Plants </h2>
      </div>
      <SearchPlant />
      {isFetchingPlants ? <WaitSpinner /> : <PlantsOverview />}
    </div>
  );
};

export default AllPlants;
