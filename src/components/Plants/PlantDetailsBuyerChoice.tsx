import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PlantDetailsBuyerItems = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div>
      <Link to="/plants/checkout" className="is-link">
        <button
          className={`
            btn
            btn-sm
            form-control
            is-width-medium
            mx-2
            mb-2
          `}
        >
          {t("button.buy")}
        </button>
      </Link>
      <Link to="/messages/create" className="is-link">
        <button
          className={`
            btn
            btn-sm
            form-control
            is-width-medium
            mx-2
            mb-2
          `}
        >
          {t("button.swap")}
        </button>
      </Link>
    </div>
  );
};

export default PlantDetailsBuyerItems;
