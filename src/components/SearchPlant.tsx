import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import { fetchPlants } from "../lib/utilities";
import {
  fetchQueryPlants,
  setIsFetchingPlants,
  setPlants,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

const SearchPlant = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPlantQuery = (query: string): void => {
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
        fetchPlants(dispatch);
      }
    };

    fetchPlantQuery(query);
  }, [query]);

  return (
    <div className="mb-4">
      <hr />
      <h4> Search a plant </h4>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        className="smallWidth form-control"
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
    </div>
  );
};

export default SearchPlant;
