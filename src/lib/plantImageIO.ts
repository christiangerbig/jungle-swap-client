import {
  deletePlantImage,
  setErrorMessage,
  setIsDeletingPlantImage,
  setIsUploadingPlantImage,
  setPlant,
  uploadPlantImage,
} from "../reducer/jungleSwapSlice";
import { DestroyImageData, Plant, UploadImageData } from "../typeDefinitions";

export class PlantImageIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  create = (plant: Plant, uploadForm: any) => {
    const setImageDataForPlant = (
      plant: Plant,
      { imageUrl, imagePublicId }: UploadImageData
    ) => {
      const clonedPlant = JSON.parse(JSON.stringify(plant));
      clonedPlant.imagePublicId = imagePublicId;
      clonedPlant.imageUrl = imageUrl;
      this.dispatch(setPlant(clonedPlant));
    };

    this.dispatch(setIsUploadingPlantImage(true));
    this.dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then(({ imageUrl, imagePublicId }: UploadImageData) => {
        setImageDataForPlant(plant, { imageUrl, imagePublicId });
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  delete = (destroyImageData: DestroyImageData): void => {
    this.dispatch(setIsDeletingPlantImage(true));
    this.dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then(() => {
        return;
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
