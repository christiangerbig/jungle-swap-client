import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plant } from "../../typeDefinitions";

type PlantThumbnailProps = {
  plant: Plant;
};

const PlantThumbnail = ({ plant }: PlantThumbnailProps): JSX.Element => {
  const { _id, name, imageUrl, price } = plant;
  const { t } = useTranslation();

  return (
    <div className="col mb-5">
      <div className="card card-medium-width text-center h-100">
        <img
          src={imageUrl}
          alt={name}
          className="card-img-top is-image-size-large"
        />
        <div className="card-body mb-5">
          <h5>{name}</h5>
          <p>
            {price} {t("texts.plants.plantThumbnail.currency")}
          </p>
          <Link
            className="btn form-control is-width-medium is-link"
            to={`/plants/fetch/${_id}`}
          >
            {t("link.details")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantThumbnail;
