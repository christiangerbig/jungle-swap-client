import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Plant, User } from "../../app/typeDefinitions";
import PlantDetailsUserChoice from "./PlantDetailsUserChoice";

type PlantItemsProps = {
  plant: Plant;
};

const PlantItems = ({ plant }: PlantItemsProps): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const { name, description, size, imageUrl, location, price, creator } = plant;
  const { _id } = creator as User;

  return (
    <div className="col">
      <div className="card is-card-width-large">
        <img
          src={imageUrl}
          loading="lazy"
          alt={name}
          className="card-img-top is-image-size-large"
        />
        <div className="ml-2 mt-2">
          <span className="is-text-bold">
            {t("texts.plants.plantDetails.name")}
          </span>{" "}
          {name}
        </div>
        <div className="ml-2 mt-2">
          <span className="is-text-bold">
            {t("texts.plants.plantDetails.description")}
          </span>{" "}
          {description}
        </div>
        <div className="ml-2 mt-2">
          <span className="is-text-bold">
            {t("texts.plants.plantDetails.size")}
          </span>{" "}
          {size} {t("texts.plants.plantDetails.sizeUnit")}
        </div>
        <div className="ml-2 mt-2">
          <span>{t("texts.plants.plantDetails.likes")}</span> {location}
        </div>
        <div className="ml-2 mt-2">
          <span className="is-text-bold">
            {t("texts.plants.plantDetails.price")}
          </span>{" "}
          {price} {t("texts.plants.plantDetails.currency")}
        </div>
        <div className="ml-2 mt-2 col justify-content-center">
          <div className="row-2 justify-content-center">
            <div className="card-body text-right pt-0">
              <PlantDetailsUserChoice
                isCreator={(loggedInUser as User)._id === _id}
              />
              <button
                className="btn btn-sm ml-2 form-control is-width-medium mb-3"
                onClick={(): void => {
                  goBack();
                }}
              >
                {t("button.goBack")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantItems;
