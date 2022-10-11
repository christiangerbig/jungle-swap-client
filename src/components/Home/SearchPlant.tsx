import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { PlantIO } from "../../lib/plantIO";
import { setFilteredPlants } from "../../reducer/jungleSwapSlice";
import { RootState } from "../../store";
import { Plant } from "../../typeDefinitions";

const SearchPlant = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const plants = useAppSelector((state: RootState) => state.jungleSwap.plants);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPlantQueryByName = (query: string): void => {
      const plantIO = new PlantIO(dispatch);
      if (query) {
        plantIO.search(query);
      } else {
        plantIO.fetchAll();
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
      <hr className="horizontal-rule" />
      <h4>{t("texts.home.searchPlant.headline")}</h4>
      <div className="d-flex">
        <input
          type="text"
          placeholder={t("texts.home.searchPlant.namePlaceholder")}
          value={query}
          className="is-width-medium form-control"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
        <select
          name="location"
          className="location-filter form-control ml-4"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setFilter(event.target.value);
          }}
        >
          <option value="">{t("select.location.title")}</option>
          <option value="sun">{t("select.location.sun")}</option>
          <option value="shade">{t("select.location.shade")}</option>
          <option value="sun and shade">
            {t("select.location.sunAndShade")}
          </option>
        </select>
      </div>
    </div>
  );
};

export default SearchPlant;
