import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="notFound">
      <div>
        <h1> {t("notFound.headline")} </h1>
        <h2> {t("notFound.subheadline1")} </h2>
        <h3> {t("notFound.subheadline2")} </h3>
        <Link to={"/"}>
          <button className="btn btn-sm ml-2 smallWidth form-control">
            {t("link.takeMeHome")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
