import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useHandlePlant } from "../../custom-hooks/useHandlePlant";
import {
  setTitleSectionHeight,
  setAboutSectionHeight,
  setFilteredPlants,
} from "../../reducer/jungleSwapSlice";
import { RootState } from "../../store";
import HomeAbout from "../../components/home/HomeAbout";
import PlantsCockpit from "../../components/plants/PlantsCockpit";
import HomeTitle from "../../components/home/HomeTitle";

const Home = (): JSX.Element => {
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();
  const handlePlant = useHandlePlant();
  const elementRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const elementHeight = (elementRef: HTMLElement): number => {
      return Math.round(elementRef.getBoundingClientRect().height);
    };

    handlePlant.fetchAll((): void => {
      const titleSectionHeight = elementHeight(elementRef.current[0]);
      dispatch(setTitleSectionHeight(titleSectionHeight));
      const aboutSectionHeight = elementHeight(elementRef.current[1]);
      dispatch(setAboutSectionHeight(aboutSectionHeight));
    });
  }, []);

  useEffect(() => {
    dispatch(setFilteredPlants(plants));
  }, [plants]);

  return (
    <div>
      <section
        ref={(titleSection: HTMLElement): void => {
          (elementRef.current[0] as HTMLElement | null) = titleSection;
        }}
        className="text-center pt-5 pb-5 title-header has-fixed-background-image"
      >
        <HomeTitle />
      </section>

      <section
        ref={(aboutSection: HTMLElement): void => {
          (elementRef.current[1] as HTMLElement | null) = aboutSection;
        }}
      >
        <HomeAbout />
      </section>

      <section>
        <PlantsCockpit />
      </section>
    </div>
  );
};

export default Home;
