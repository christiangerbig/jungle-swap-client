import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plant } from "../../app/typeDefinitions";

interface PlantThumbnailProps {
  plant: Plant;
}

const PlantThumbnail = ({
  plant: { _id, name, imageUrl, price },
}: PlantThumbnailProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="col mb-5">
      <div className="card h-100 text-center mx-auto">
        <img
          src={imageUrl}
          loading="lazy"
          alt={name}
          className="[ image image--size-large ] [ card-img-top ]"
        />
        <div className="card-body mb-5">
          <h5>{name}</h5>
          <p>
            {price} {t("texts.plants.plantThumbnail.currency")}
          </p>
          <Link to={`/plants/fetch/${_id}`} className="navigation-link">
            <button className="[ button--width-medium ] [ btn form-control px-3 ]">
              {t("link.details")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantThumbnail;
