import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchAllPlants,
  readUser,
  setHeaderContainerHeight,
  setAboutContainerHeight,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

import About from "../components/About";
import AllPlants from "../components/AllPlants";
import Title from "../components/Title";

const Home = (): JSX.Element => {
  const isFetchingUser = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingUser
  );
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();
  const elementRef = useRef([]);

  // Load plants and user data as soon as page loads
  useEffect(() => {
    dispatch(fetchAllPlants());
    !loggedInUser && dispatch(readUser());
    const headerElementHeight = Math.round(
      (elementRef.current[0] as any).getBoundingClientRect().height
    );
    dispatch(setHeaderContainerHeight(headerElementHeight));
    const aboutElementHeight = Math.round(
      (elementRef.current[1] as any).getBoundingClientRect().height
    );
    dispatch(setAboutContainerHeight(aboutElementHeight));
  }, []);

  return (
    <div>
      {!plants && (
        <div className="spinner-grow text-success m-5" role="status">
          <span className="visually-hidden">
            <br /> <br /> Loading plants...
          </span>
        </div>
      )}

      {isFetchingUser && (
        <div className="spinner-grow text-success m-5" role="status">
          <span className="visually-hidden">
            <br /> <br /> Loading user data...
          </span>
        </div>
      )}

      <header
        className="text-center pt-5 pb-5 headerImg"
        ref={(headerElement) => {
          (elementRef.current[0] as any) = headerElement;
        }}
      >
        <Title />
      </header>

      <section
        ref={(aboutElement) => {
          (elementRef.current[1] as any) = aboutElement;
        }}
      >
        <About />
      </section>

      <section>
        <AllPlants />
      </section>
    </div>
  );
};

export default Home;
