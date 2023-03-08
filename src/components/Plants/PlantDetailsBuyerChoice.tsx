import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PlantDetailsBuyerItems = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div>
      <Link to="/plants/checkout" className="navigation-link">
        <button
          className={`
            [ 
              button--width-medium 
            ]
            [ 
              btn
              btn-sm
              form-control
              px-4
              mx-2
              mb-2 
            ]          
          `}
        >
          {t("button.buy")}
        </button>
      </Link>
      <Link to="/messages/create" className="navigation-link">
        <button
          className={`
            [ 
              button--width-medium 
            ]
            [ 
              btn
              btn-sm
              form-control
              px-4
              mx-2
              mb-2 
            ]   
          `}
        >
          {t("button.swap")}
        </button>
      </Link>
    </div>
  );
};

export default PlantDetailsBuyerItems;
