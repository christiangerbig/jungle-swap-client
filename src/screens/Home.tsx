import { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks";
import {
  fetchAllPlants,
  setHeaderContainerHeight,
  setAboutContainerHeight,
  setPlants,
  Plant,
  setIsFetchingPlants,
} from "../reducer/jungleSwapSlice";
import About from "../components/About";
import AllPlants from "../components/AllPlants";
import Title from "../components/Title";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const elementRef = useRef([]);

  // Load plants and user data as soon as page loads
  useEffect(() => {
    dispatch(setIsFetchingPlants(true));
    dispatch(fetchAllPlants())
      .unwrap()
      .then((plants: Plant[]) => {
        dispatch(setPlants(plants));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
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
