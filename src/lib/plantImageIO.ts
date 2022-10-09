import {
  deletePlantImage,
  setErrorMessage,
  setIsDeletingPlantImage,
  setIsUploadingPlantImage,
  uploadPlantImage,
} from "../reducer/jungleSwapSlice";
import { DestroyImageData, UploadImageData } from "../typeDefinitions";

export class PlantImageIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  create = (uploadForm: any, callbackFunction: Function) => {
    this.dispatch(setIsUploadingPlantImage(true));
    this.dispatch(uploadPlantImage(uploadForm))
      .unwrap()
      .then((uploadImageData: UploadImageData): void => {
        callbackFunction(uploadImageData);
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  delete = (destroyImageData: DestroyImageData): void => {
    this.dispatch(setIsDeletingPlantImage(true));
    this.dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then((): void => {
        return;
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
