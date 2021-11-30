import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import {
  fetchAllPlants,
  fetchQueryPlants,
  setIsFetchingPlants,
  setPlants,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

const SearchPlant = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  // Handle plant query
  useEffect(() => {
    // Check if there is a plant query input by the user
    const checkPlantQuery = (query: string): void => {
      if (query) {
        dispatch(setIsFetchingPlants(true));
        dispatch(fetchQueryPlants(query))
          .unwrap()
          .then((plants: Plant[]) => {
            dispatch(setPlants(plants));
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      } else {
        dispatch(setIsFetchingPlants(true));
        dispatch(fetchAllPlants())
          .unwrap()
          .then((plants: Plant[]) => {
            dispatch(setPlants(plants));
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      }
    };

    checkPlantQuery(query);
  }, [query]);

  return (
    <div className="mb-4">
      <hr />
      <h4> Search a plant </h4>
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
  );
};

export default SearchPlant;
