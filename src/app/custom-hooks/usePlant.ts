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

interface PlantMethods {
  createPlant: (
    plant: any,
    uploadImageData: UploadImageData,
    callback: () => void
  ) => void;
  fetchPlant: (plantId: PlantId, callback: () => void) => void;
  fetchPlants: (callback?: () => void) => void;
  updatePlant: (plant: Plant, callback: () => void) => void;
  deletePlant: (plantId: PlantId, callback: () => void) => void;
  searchPlant: (query: string) => void;
}

export const usePlant = (): PlantMethods => {
  const dispatch = useAppDispatch();

  return {
    createPlant: (
      { name, description, size, location, price }: any,
      { imageUrl, imagePublicId }: UploadImageData,
      callback: () => void
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
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchPlant: (plantId: PlantId, callback: () => void): void => {
      dispatch(setIsFetchingPlant(true));
      dispatch(fetchPlant(plantId))
        .unwrap()
        .then((plant: Plant): void => {
          dispatch(setPlant(plant));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchPlants: (callback?: () => void): void => {
      dispatch(setIsFetchingPlants(true));
      dispatch(fetchAllPlants())
        .unwrap()
        .then((plants: Plant[]): void => {
          dispatch(setPlants(plants));
          if (typeof callback !== "undefined") {
            callback();
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
      callback: () => void
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
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deletePlant: (plantId: PlantId, callback: () => void): void => {
      dispatch(setIsDeletingPlant(true));
      dispatch(deletePlant(plantId))
        .unwrap()
        .then((): void => {
          dispatch(removePlant(plantId));
          callback();
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
};
