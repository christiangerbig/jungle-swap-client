import { useTranslation } from "react-i18next";

const Unauthorized = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      className={`
        [
          unauthorized
        ]
        [
          position-absolute 
          d-flex 
          justify-content-center 
          align-items-center 
          w-100  
          overflow-hidden
          text-center
        ]
      `}
    >
      <div>
        <h1 className="unauthorized__headline">
          {t("texts.unauthorized.headline")}
        </h1>
        <h2 className="[ unauthorized__subheadline1 ] [ mb-4 ]">
          {t("texts.unauthorized.subheadline1")}
        </h2>
        <h3 className="[ unauthorized__subheadline2 ] [ text-uppercase ]">
          {t("texts.unauthorized.subheadline2")}
        </h3>
      </div>
    </div>
  );
};

export default Unauthorized;
