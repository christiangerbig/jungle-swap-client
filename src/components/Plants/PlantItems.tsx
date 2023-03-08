import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import { selectLoggedInUser } from "../../reducer/jungleSwapSlice";
import { Plant, User } from "../../app/typeDefinitions";
import PlantDetailsUserChoice from "./PlantDetailsUserChoice";
import PlantItem from "./PlantItem";
import GoBackButton from "../helpers/GoBackButton";

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

  const handleGoBack = (): void => {
    goBack();
  };

  return (
    <div className="col">
      <div className="[ thumbnail-card--width-large ] [ card ]">
        <img
          src={imageUrl}
          loading="lazy"
          alt={name}
          className="[ thumbnail-card--width-large ] [ card-img-top ]"
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
          <span className="font-weight-bold"></span>{" "}
        </div>
        <PlantItem
          keyword={t("texts.plants.plantDetails.price")}
          description={`${price} ${t("texts.plants.plantDetails.currency")}`}
        />
        <div className="col justify-content-center ml-2 mt-2">
          <div className="row-2 justify-content-center">
            <div className="card-body text-right pt-0">
              <PlantDetailsUserChoice
                isCreator={(creator as User)._id === _id}
              />
              <GoBackButton clickHandler={handleGoBack} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantItems;
