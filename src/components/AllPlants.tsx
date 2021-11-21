import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchAllPlants,
  fetchQueryPlants,
  Plant,
  setPlants,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import PlantThumbnail from "../components/PlantThumbnail";

const AllPlants = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();

  // Handle plant search result if user types in a query
  useEffect(() => {
    if (query) {
      dispatch(fetchQueryPlants(query))
        .unwrap()
        .then((plants: Plant[]) => {
          dispatch(setPlants(plants));
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    } else {
      dispatch(fetchAllPlants())
        .unwrap()
        .then((plants: Plant[]) => {
          dispatch(setPlants(plants));
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    }
  }, [query]);

  return (
    <div className="container mt-5">
      <div className="mt-5 mb-3">
        <h2> Plants </h2>
        <hr />
        <h4> Search a plant </h4>
      </div>
      <div className="mb-4">
        <input
          className="smallWidth form-control"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {plants &&
          plants.map((plant: Plant, index: number): JSX.Element => {
            return <PlantThumbnail plant={plant} key={index} />;
          })}
      </div>
    </div>
  );
};

export default AllPlants;
