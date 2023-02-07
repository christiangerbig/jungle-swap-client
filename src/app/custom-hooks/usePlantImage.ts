import { useAppDispatch } from "../hooks";
import {
  deletePlantImage,
  setErrorMessage,
  setIsDeletingPlantImage,
  setIsUploadingPlantImage,
  uploadPlantImage,
} from "../../reducer/jungleSwapSlice";
import { DestroyImageData, UploadImageData } from "../typeDefinitions";

interface HandlePlantImage {
  createImage: Function;
  deleteImage: Function;
}

export const usePlantImage = (): HandlePlantImage => {
  const dispatch = useAppDispatch();

  return {
    createImage: (uploadForm: any, callbackFunction: Function): void => {
      dispatch(setIsUploadingPlantImage(true));
      dispatch(uploadPlantImage(uploadForm))
        .unwrap()
        .then((uploadImageData: UploadImageData): void => {
          callbackFunction(uploadImageData);
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deleteImage: (destroyImageData: DestroyImageData): void => {
      dispatch(setIsDeletingPlantImage(true));
      dispatch(deletePlantImage(destroyImageData))
        .unwrap()
        .then((): void => {
          return;
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },
  };
};
