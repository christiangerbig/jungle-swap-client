import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Plant, User } from "../typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const MyPlantsOverview = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {plants.map((plant: Plant, index: number): JSX.Element => {
        const { creator } = plant;
        return (creator as User)._id === (loggedInUser as User)._id ? (
          <PlantThumbnail plant={plant} key={index} />
        ) : (
          <></>
        );
      })}
    </div>
  );
};

export default MyPlantsOverview;
