import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchPlants } from "../lib/utilities";
import {
  fetchQueryPlants,
  setFilteredPlants,
  setIsFetchingPlants,
  setPlants,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import { Plant } from "../typeDefinitions";

const SearchPlant = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPlantQueryByName = (query: string): void => {
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

    fetchPlantQueryByName(query);
  }, [query]);

  useEffect(() => {
    const filterPlantsByLocation = (filter: string, plants: Plant[]): void => {
      const filteredPlants = plants.filter(({ location }: Plant): boolean => {
        return filter === location || filter === "";
      });
      dispatch(setFilteredPlants(filteredPlants));
    };

    filterPlantsByLocation(filter, plants);
  }, [filter]);

  return (
    <div className="mb-4">
      <hr />
      <h4> Search a plant </h4>
      <div className="d-flex">
        <input
          type="text"
          placeholder="Enter name"
          value={query}
          className="smallWidth form-control"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <select
          name="location"
          className="extraSmallWidth form-control ml-4"
          onChange={(event) => {
            setFilter(event.target.value);
          }}
        >
          <option value=""> Select location </option>
          <option value="sun"> sun </option>
          <option value="shade"> shade </option>
          <option value="sun and shade"> sun and shade </option>
        </select>
      </div>
    </div>
  );
};

export default SearchPlant;
