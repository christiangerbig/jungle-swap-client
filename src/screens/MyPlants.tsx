import { useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import WaitSpinner from "../components/WaitSpinner";
import MyPlantsCollection from "../components/MyPlantsCollection";

const MyPlants = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingPlants = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlants
  );

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
      {isFetchingPlants ? <WaitSpinner /> : <MyPlantsCollection />}
    </div>
  );
};

export default MyPlants;
