import {
  addPlant,
  createPlant,
  deletePlant,
  fetchAllPlants,
  removePlant,
  setErrorMessage,
  setIsCreatingPlant,
  setIsDeletingPlant,
  setIsFetchingPlants,
  setIsUpdatingPlant,
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

  fetchAll = (): void => {
    this.dispatch(setIsFetchingPlants(true));
    this.dispatch(fetchAllPlants())
      .unwrap()
      .then((plants: Plant[]) => {
        this.dispatch(setPlants(plants));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  create = (
    { name, description, size, location, price }: any,
    { imageUrl, imagePublicId }: UploadImageData
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
      .then((plant: Plant) => {
        this.dispatch(addPlant(plant));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  update = ({
    _id,
    name,
    description,
    size,
    imageUrl,
    imagePublicId,
    location,
    price,
  }: Plant): void => {
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
      .then((updatedPlant: Plant) => {
        this.dispatch(setPlantChanges(updatedPlant));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  delete = (plantId: PlantId): void => {
    this.dispatch(setIsDeletingPlant(true));
    this.dispatch(deletePlant(plantId))
      .unwrap()
      .then(() => {
        this.dispatch(removePlant(plantId));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
