import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="not-found has-background-image2">
      <div>
        <h1>{t("notFound.headline")}</h1>
        <h2>{t("notFound.subheadline1")}</h2>
        <h3>{t("notFound.subheadline2")}</h3>
        <Link to={"/"} className="is-link">
          <button className="ml-2 btn btn-sm is-width-medium form-control">
            {t("button.takeMeHome")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
