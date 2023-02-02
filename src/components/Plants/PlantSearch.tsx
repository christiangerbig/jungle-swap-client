import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHandlePlant } from "../../app/custom-hooks/useHandlePlant";
import { selectPlants, setFilteredPlants } from "../../reducer/jungleSwapSlice";
import { Plant } from "../../app/typeDefinitions";

const PlantSearch = (): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const plants = useAppSelector(selectPlants);
  const dispatch = useAppDispatch();
  const { searchPlant, fetchPlants } = useHandlePlant();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPlantQueryByName = (query: string): void => {
      if (query) {
        searchPlant(query);
      } else {
        fetchPlants();
      }
    };

    fetchPlantQueryByName(query);
  }, [query]);

  useEffect(() => {
    const filterPlantsByLocation = (filter: string, plants: Plant[]): void => {
      const filteredPlants = plants.filter(
        ({ location }: Plant): boolean => filter === location || filter === ""
      );
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
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>): void => {
            setQuery(value);
          }}
        />
        <select
          name="location"
          className="location-filter form-control ml-4"
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLSelectElement>): void => {
            setFilter(value);
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

export default PlantSearch;
