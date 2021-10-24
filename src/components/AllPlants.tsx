import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchAllPlants,
  fetchQueryPlants,
  Plant,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import PlantThumbnail from "../components/PlantThumbnail";

const AllPlants = () => {
  const [query, setQuery] = useState("");
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();

  // Handle plant search result if user types in query
  useEffect(() => {
    query ? dispatch(fetchQueryPlants(query)) : dispatch(fetchAllPlants());
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
          plants.map((plant: Plant): JSX.Element => {
            return <PlantThumbnail plant={plant} />;
          })}
      </div>
    </div>
  );
};

export default AllPlants;
