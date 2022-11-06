import { useAppDispatch } from "../hooks";
import {
  addPlant,
  createPlant,
  deletePlant,
  fetchAllPlants,
  fetchPlant,
  fetchQueryPlants,
  removePlant,
  setErrorMessage,
  setIsCreatingPlant,
  setIsDeletingPlant,
  setIsFetchingPlant,
  setIsFetchingPlants,
  setIsUpdatingPlant,
  setPlant,
  setPlantChanges,
  setPlants,
  updatePlant,
} from "../../reducer/jungleSwapSlice";
import { Plant, PlantId, UploadImageData } from "../typeDefinitions";

type HandlePlant = {
  createPlant: Function;
  fetchPlant: Function;
  fetchPlants: Function;
  updatePlant: Function;
  deletePlant: Function;
  searchPlant: Function;
};

export const useHandlePlant = (): HandlePlant => {
  const dispatch = useAppDispatch();

  const handlePlant = {
    createPlant: (
      { name, description, size, location, price }: any,
      { imageUrl, imagePublicId }: UploadImageData,
      callbackFunction: Function
    ): void => {
      const newPlant: Plant = {
        name: name.value,
        description: description.value,
        size: size.value,
        imageUrl,
        imagePublicId,
        location: location.value,
        price: price.value,
      };
      dispatch(setIsCreatingPlant(true));
      dispatch(createPlant(newPlant))
        .unwrap()
        .then((plant: Plant): void => {
          dispatch(addPlant(plant));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchPlant: (plantId: PlantId, callbackFunction: Function): void => {
      dispatch(setIsFetchingPlant(true));
      dispatch(fetchPlant(plantId))
        .unwrap()
        .then((plant: Plant): void => {
          dispatch(setPlant(plant));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchPlants: (callbackFunction?: Function): void => {
      dispatch(setIsFetchingPlants(true));
      dispatch(fetchAllPlants())
        .unwrap()
        .then((plants: Plant[]): void => {
          dispatch(setPlants(plants));
          if (typeof callbackFunction !== "undefined") {
            callbackFunction();
          }
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    updatePlant: (
      {
        _id,
        name,
        description,
        size,
        imageUrl,
        imagePublicId,
        location,
        price,
      }: Plant,
      callbackFunction: Function
    ): void => {
      const updatedPlant: Plant = {
        name,
        description,
        size,
        imageUrl,
        imagePublicId,
        location,
        price,
      };
      dispatch(setIsUpdatingPlant(true));
      dispatch(updatePlant({ plantId: _id as PlantId, updatedPlant }))
        .unwrap()
        .then((updatedPlant): void => {
          dispatch(setPlantChanges(updatedPlant));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deletePlant: (plantId: PlantId, callbackFunction: Function): void => {
      dispatch(setIsDeletingPlant(true));
      dispatch(deletePlant(plantId))
        .unwrap()
        .then((): void => {
          dispatch(removePlant(plantId));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    searchPlant: (query: string): void => {
      dispatch(setIsFetchingPlants(true));
      dispatch(fetchQueryPlants(query))
        .unwrap()
        .then((plants: Plant[]): void => {
          dispatch(setPlants(plants));
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },
  };
  return handlePlant;
};
