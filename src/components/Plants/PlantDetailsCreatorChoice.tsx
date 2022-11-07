import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { useHandlePlant } from "../../app/custom-hooks/useHandlePlant";
import { useHandlePlantImage } from "../../app/custom-hooks/useHandlePlantImage";
import { useHandleMessage } from "../../app/custom-hooks/useHandleMessage";
import {
  selectIsDeletingMessage,
  selectIsDeletingPlant,
  selectIsDeletingPlantImage,
  selectMessages,
  selectPlant,
} from "../../reducer/jungleSwapSlice";
import { Plant, PlantId } from "../../app/typeDefinitions";

const PlantDetailsCreatorChoice = (): JSX.Element => {
  const plant = useAppSelector(selectPlant);
  const isDeletingPlant = useAppSelector(selectIsDeletingPlant);
  const isDeletingPlantImage = useAppSelector(selectIsDeletingPlantImage);
  const messages = useAppSelector(selectMessages);
  const isDeletingMessage = useAppSelector(selectIsDeletingMessage);
  const { goBack } = useHistory();
  const { deleteRemainingMessages } = useHandleMessage();
  const { deleteImage } = useHandlePlantImage();
  const { deletePlant } = useHandlePlant();
  const { t } = useTranslation();
  const { _id, imagePublicId } = plant as Plant;

  const handleDelete = (): void => {
    deleteRemainingMessages(messages, _id as PlantId);
    deleteImage({ imagePublicId });
    deletePlant(_id as PlantId, (): void => {
      goBack();
    });
  };

  const buttonState = (): boolean => {
    return isDeletingMessage || isDeletingPlantImage || isDeletingPlant
      ? true
      : false;
  };

  return (
    <div className="p-0">
      <Link to={"/plants/update"} className="is-link">
        <button className="btn btn-sm mx-2 form-control is-width-medium mb-2">
          {t("button.update")}
        </button>
      </Link>
      <button
        disabled={buttonState()}
        className="btn btn-sm mx-2 form-control is-width-medium mb-2"
        onClick={handleDelete}
      >
        {t("button.delete")}
      </button>
    </div>
  );
};

export default PlantDetailsCreatorChoice;
