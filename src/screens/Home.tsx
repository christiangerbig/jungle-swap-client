import { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks";
import {
  setTitleSectionHeight,
  setAboutSectionHeight,
} from "../reducer/jungleSwapSlice";
import About from "../components/About";
import AllPlants from "../components/AllPlants";
import Title from "../components/Title";
import { fetchPlants } from "../lib/utilities";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const elementRef = useRef([]);

  useEffect(() => {
    const getTitleSectionHeight = (): void => {
      const titleSectionHeight = Math.round(
        (elementRef.current[0] as any).getBoundingClientRect().height
      );
      dispatch(setTitleSectionHeight(titleSectionHeight));
    };

    const getAboutSectionHeight = (): void => {
      const aboutSectionHeight = Math.round(
        (elementRef.current[1] as any).getBoundingClientRect().height
      );
      dispatch(setAboutSectionHeight(aboutSectionHeight));
    };

    fetchPlants(dispatch);
    getTitleSectionHeight();
    getAboutSectionHeight();
  }, []);

  return (
    <div>
      <section
        ref={(headerElement) => {
          (elementRef.current[0] as any) = headerElement;
        }}
        className="text-center pt-5 pb-5 headerImg"
      >
        <Title />
      </section>

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
