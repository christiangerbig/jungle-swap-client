import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useHandleMessage } from "../../custom-hooks/useHandleMessage";
import { PlantImageIO } from "../../lib/plantImageIO";
import { PlantIO } from "../../lib/plantIO";
import { Plant, PlantId } from "../../typeDefinitions";

const PlantDetailsCreatorChoice = (): JSX.Element => {
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isDeletingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingPlant
  );
  const isDeletingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingPlantImage
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );
  const isDeletingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();
  const handleMessage = useHandleMessage();
  const { t } = useTranslation();
  const { _id, imagePublicId } = plant as Plant;

  const handleDelete = (): void => {
    handleMessage.deleteRemaining(messages, _id as PlantId);
    const plantImageIO = new PlantImageIO(dispatch);
    plantImageIO.delete({ imagePublicId });
    const plantIO = new PlantIO(dispatch);
    plantIO.delete(_id as PlantId, (): void => {
      history.goBack();
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
        <button className="btn btn-sm ml-2 form-control is-width-medium mb-2">
          {t("button.update")}
        </button>
      </Link>
      <button
        disabled={buttonState()}
        className="btn btn-sm ml-2 form-control is-width-medium mb-2"
        onClick={handleDelete}
      >
        {t("button.delete")}
      </button>
    </div>
  );
};

export default PlantDetailsCreatorChoice;
