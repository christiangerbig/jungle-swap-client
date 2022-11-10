import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

const SelectLanguage = (): JSX.Element => {
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = ({ target: { value } }: any): void => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="is-link">
      <FontAwesomeIcon icon={faLanguage} />
      <select
        className="form-select select-language"
        onChange={handleSelectLanguage}
      >
        <option disabled selected value="">
          {t("select.language.placeholder")}
        </option>
        <option value="de">{t("select.language.german")}</option>
        <option value="en">{t("select.language.english")}</option>
      </select>
    </div>
  );
};

export default SelectLanguage;
