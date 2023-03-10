import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { usePlant } from "../../app/custom-hooks/usePlant";
import { selectPlants, setFilteredPlants } from "../../reducer/jungleSwapSlice";
import { Plant } from "../../app/typeDefinitions";
import { MultiSelect } from "react-multi-select-component";

interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const PlantSearch = (): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);
  const plants = useAppSelector(selectPlants);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { searchPlant, fetchPlants } = usePlant();

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
    const filterPlantsByLocation = (
      selectedOptions: DropdownOption[],
      plants: Plant[]
    ): void => {
      const selectedLocations = selectedOptions.map(
        (option: DropdownOption): string => option.value
      );
      const filteredPlants = plants.filter(({ location }: Plant): boolean => {
        const matchedLocation = selectedLocations.filter(
          (selectedLocation: string): boolean => selectedLocation === location
        );
        return matchedLocation.length !== 0 ? true : false;
      });
      dispatch(setFilteredPlants(filteredPlants));
    };

    filterPlantsByLocation(selectedOptions, plants);
  }, [selectedOptions]);

  const optionsChoice: DropdownOption[] = [
    {
      label: t("multiSelect.location.sun"),
      value: "sun",
    },
    {
      label: t("multiSelect.location.shade"),
      value: "shade",
    },
    {
      label: t("multiSelect.location.sunAndShade"),
      value: "sun and shade",
    },
  ];

  const localizationTexts: any = {
    allItemsAreSelected: `${t("multiSelect.localization.allItemsAreSelected")}`,
    clearSearch: t("multiSelect.localization.clearSearch"),
    noOptions: t("multiSelect.localization.noOptions"),
    search: t("multiSelect.localization.search"),
    selectAll: t("multiSelect.localization.selectAll"),
    selectAllFiltered: t("multiSelect.localization.selectAllFiltered"),
    selectSomeItems: t("multiSelect.localization.selectSomeItems"),
    create: t("multiSelect.localization.create"),
  };

  return (
    <div className="mb-4">
      <hr className="[ horizontal-ruler ] [ pb-5 ]" />
      <h4 className="mb-4">{t("texts.home.searchPlant.headline")}</h4>
      <div className="[ plant-search ] [ d-flex flex-row ]">
        <input
          type="text"
          placeholder={t("texts.home.searchPlant.namePlaceholder")}
          value={query}
          className="plant-search__field form-control"
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>): void => {
            setQuery(value);
          }}
        />
        <MultiSelect
          labelledBy="location-select"
          options={optionsChoice}
          value={selectedOptions}
          overrideStrings={localizationTexts}
          onChange={(options: DropdownOption[]): void => {
            setSelectedOptions(options);
          }}
          disableSearch={true}
          className="[ location-filter location-filter--no-border ] [ form-control p-0 ml-4  ] "
        />
      </div>
    </div>
  );
};

export default PlantSearch;
