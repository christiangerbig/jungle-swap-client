import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { selectLoggedInUser } from "../../reducer/jungleSwapSlice";
import { Plant, User } from "../../app/typeDefinitions";
import PlantDetailsUserChoice from "./PlantDetailsUserChoice";
import PlantItem from "./PlantItem";

interface PlantItemsProps {
  plant: Plant;
}

const PlantItems = ({
  plant: { name, description, size, imageUrl, location, price, creator },
}: PlantItemsProps): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { _id } = loggedInUser as User;

  return (
    <div className="col">
      <div className="card is-card-width-large">
        <img
          src={imageUrl}
          loading="lazy"
          alt={name}
          className="card-img-top is-image-size-large"
        />
        <PlantItem
          keyword={t("texts.plants.plantDetails.name")}
          description={name}
        />
        <PlantItem
          keyword={t("texts.plants.plantDetails.description")}
          description={description}
        />
        <PlantItem
          keyword={t("texts.plants.plantDetails.size")}
          description={`${size} ${t("texts.plants.plantDetails.sizeUnit")}`}
        />
        <PlantItem
          keyword={t("texts.plants.plantDetails.likes")}
          description={location}
        />
        <div className="ml-2 mt-2">
          <span className="is-text-bold"></span>{" "}
        </div>
        <PlantItem
          keyword={t("texts.plants.plantDetails.price")}
          description={`${price} ${t("texts.plants.plantDetails.currency")}`}
        />
        <div className="ml-2 mt-2 col justify-content-center">
          <div className="row-2 justify-content-center">
            <div className="card-body text-right pt-0">
              <PlantDetailsUserChoice
                isCreator={(creator as User)._id === _id}
              />
              <button
                className={`
                  btn
                  btn-sm
                  form-control
                  is-width-medium
                  mx-2
                  mb-3
                `}
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
