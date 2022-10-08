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
} from "../reducer/jungleSwapSlice";
import { Plant, PlantId, UploadImageData } from "../typeDefinitions";

export class PlantIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  create = (
    { name, description, size, location, price }: any,
    { imageUrl, imagePublicId }: UploadImageData,
    callbackFunction: Function,
    callbackFunctionError: Function,
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
    this.dispatch(setIsCreatingPlant(true));
    this.dispatch(createPlant(newPlant))
      .unwrap()
      .then((plant: Plant): void => {
        this.dispatch(addPlant(plant));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
        callbackFunctionError();
      });
  };

  fetch = (plantId: PlantId): void => {
    this.dispatch(setIsFetchingPlant(true));
    this.dispatch(fetchPlant(plantId))
      .unwrap()
      .then((plant: Plant): void => {
        this.dispatch(setPlant(plant));
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetchAll = (): void => {
    this.dispatch(setIsFetchingPlants(true));
    this.dispatch(fetchAllPlants())
      .unwrap()
      .then((plants: Plant[]): void => {
        this.dispatch(setPlants(plants));
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  update = (
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
    this.dispatch(setIsUpdatingPlant(true));
    this.dispatch(updatePlant({ plantId: _id as PlantId, updatedPlant }))
      .unwrap()
      .then((updatedPlant: Plant): void => {
        this.dispatch(setPlantChanges(updatedPlant));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  delete = (plantId: PlantId, callbackFunction: Function): void => {
    this.dispatch(setIsDeletingPlant(true));
    this.dispatch(deletePlant(plantId))
      .unwrap()
      .then((): void => {
        this.dispatch(removePlant(plantId));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  search = (query: string): void => {
    this.dispatch(setIsFetchingPlants(true));
    this.dispatch(fetchQueryPlants(query))
      .unwrap()
      .then((plants: Plant[]): void => {
        this.dispatch(setPlants(plants));
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
