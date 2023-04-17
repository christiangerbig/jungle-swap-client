import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      className={`
        [
          not-found 
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
        <h1 className="not-found__headline">{t("texts.notFound.headline")}</h1>
        <h2 className="[ not-found__subheadline1 ] [ mb-4 }">
          {t("texts.notFound.subheadline1")}
        </h2>
        <h3 className="[ not-found__subheadline2 ] [ text-uppercase mb-4 ]">
          {t("texts.notFound.subheadline2")}
        </h3>
        <Link to={"/"} className="navigation-link">
          <button
            className={`
              [ 
                button 
                button--width-small 
              ] 
              [ 
                btn 
                btn-sm 
                form-control 
                px-3 
              ]
            `}
          >
            {t("button.takeMeHome")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
