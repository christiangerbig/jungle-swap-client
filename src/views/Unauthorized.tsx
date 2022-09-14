import { useTranslation } from "react-i18next";

const Unauthorized = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="unauthorized">
      <div>
        <h1> {t("unauthorized.headline")} </h1>
        <h2> {t("unauthorized.subheadline1")} </h2>
        <h3> {t("unauthorized.subheadline2")} </h3>
      </div>
    </div>
  );
};

export default Unauthorized;
