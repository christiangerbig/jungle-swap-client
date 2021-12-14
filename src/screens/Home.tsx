import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setTitleSectionHeight,
  setAboutSectionHeight,
  setFilteredPlants,
} from "../reducer/jungleSwapSlice";
import About from "../components/About";
import AllPlants from "../components/AllPlants";
import Title from "../components/Title";
import { RootState } from "../store";
import { PlantIO } from "../lib/plantIO";

const Home = (): JSX.Element => {
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
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

    const plantIO = new PlantIO(dispatch);
    plantIO.fetchAll();
    getTitleSectionHeight();
    getAboutSectionHeight();
  }, []);

  useEffect(() => {
    dispatch(setFilteredPlants(plants));
  }, [plants]);

  return (
    <div>
      <section
        ref={(titleSection) => {
          (elementRef.current[0] as any) = titleSection;
        }}
        className="text-center pt-5 pb-5 headerImg"
      >
        <Title />
      </section>

      <section
        ref={(aboutSection) => {
          (elementRef.current[1] as any) = aboutSection;
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
