import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PlantDetailsBuyerItems = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Link to="/plants/checkout" className="is-link">
        <button className="btn btn-sm ml-2 form-control is-width-medium mb-2">
          {t("button.buy")}
        </button>
      </Link>
      <Link to="/messages/create" className="is-link">
        <button className="btn btn-sm ml-2 form-control is-width-medium mb-2">
          {t("button.swap")}
        </button>
      </Link>
    </div>
  );
};

export default PlantDetailsBuyerItems;
