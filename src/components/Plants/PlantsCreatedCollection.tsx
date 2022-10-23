import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Plant, User } from "../../app/typeDefinitions";
import PlantThumbnail from "./PlantThumbnail";

const PlantsCreatedCollection = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-3">
      {plants.map((plant: Plant): JSX.Element | null => {
        const { _id, creator } = plant;
        return (creator as User)._id === (loggedInUser as User)._id ? (
          <PlantThumbnail plant={plant} key={_id} />
        ) : null;
      })}
    </div>
  );
};

export default PlantsCreatedCollection;
