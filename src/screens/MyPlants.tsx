import { useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Plant, User } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import WaitSpinner from "../components/WaitSpinner";
import PlantThumbnail from "../components/PlantThumbnail";

const MyPlants = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect();
    loggedInUser && scroll.scrollToTop();
  }, []);

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-5">
        <h2> My plants </h2>
      </div>
      {isFetchingPlants ? (
        <WaitSpinner />
      ) : (
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
      )}
    </div>
  );
};

export default MyPlants;
