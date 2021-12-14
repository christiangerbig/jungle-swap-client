import {
  deletePlantImage,
  setIsDeletingPlantImage,
} from "../reducer/jungleSwapSlice";
import { DestroyImageData } from "../typeDefinitions";

export class PlantImageIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }
  delete = (destroyImageData: DestroyImageData): void => {
    this.dispatch(setIsDeletingPlantImage(true));
    this.dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then(() => {
        return;
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };
}
