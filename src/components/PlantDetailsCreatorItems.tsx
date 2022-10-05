import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../hooks";
import { MessageIO } from "../lib/messageIO";
import { PlantImageIO } from "../lib/plantImageIO";
import { PlantIO } from "../lib/plantIO";
import { Plant, PlantId } from "../typeDefinitions";

const PlantDetailsCreatorItems = () => {
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
  const { t } = useTranslation();
  const { _id, imagePublicId } = plant as Plant;

  const handleDelete = () => {
    const messageIO = new MessageIO(dispatch);
    messageIO.deleteRemaining(messages, _id as PlantId);
    const plantImageIO = new PlantImageIO(dispatch);
    plantImageIO.delete({ imagePublicId });
    const plantIO = new PlantIO(dispatch);
    plantIO.delete(_id as PlantId);
    history.goBack();
  };

  return (
    <div className="p-0">
      <Link to={"/plants/update"} className="is-link">
        <button className="btn btn-sm ml-2 form-control is-width-medium mb-2">
          {t("button.update")}
        </button>
      </Link>
      <button
        disabled={
          isDeletingMessage || isDeletingPlantImage || isDeletingPlant
            ? true
            : false
        }
        className="btn btn-sm ml-2 form-control is-width-medium mb-2"
        onClick={handleDelete}
      >
        {t("button.delete")}
      </button>
    </div>
  );
};

export default PlantDetailsCreatorItems;
