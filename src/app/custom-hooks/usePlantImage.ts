import { useAppDispatch } from "../hooks";
import {
  deletePlantImage,
  setErrorMessage,
  setIsDeletingPlantImage,
  setIsUploadingPlantImage,
  uploadPlantImage,
} from "../../reducer/jungleSwapSlice";
import { DestroyImageData, UploadImageData } from "../typeDefinitions";

interface PlantImageMethods {
  createImage: (
    uploadForm: any,
    callback: (uploadImageData: UploadImageData) => void
  ) => void;
  deleteImage: (destroyImageData: DestroyImageData) => void;
}

export const usePlantImage = (): PlantImageMethods => {
  const dispatch = useAppDispatch();

  return {
    createImage: (
      uploadForm: any,
      callback: (uploadImageData: UploadImageData) => void
    ): void => {
      dispatch(setIsUploadingPlantImage(true));
      dispatch(uploadPlantImage(uploadForm))
        .unwrap()
        .then((uploadImageData: UploadImageData): void => {
          callback(uploadImageData);
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
