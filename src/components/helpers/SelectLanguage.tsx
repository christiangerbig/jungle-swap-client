import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsLanguageChange,
  setIsLanguageChange,
} from "../../reducer/jungleSwapSlice";

const SelectLanguage = (): JSX.Element => {
  const isLanguageChange = useAppSelector(selectIsLanguageChange);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = ({ target: { value } }: any): void => {
    i18n.changeLanguage(value);
    dispatch(setIsLanguageChange(!isLanguageChange));
  };

  return (
    <div className="select-language">
      <FontAwesomeIcon icon={faLanguage} />
      <select
        className="[ select-language__select ] [ form-select ]"
        onChange={handleSelectLanguage}
      >
        <option value="" className="select-language__select__option">
          {t("select.language.placeholder")}
        </option>
        <option value="de" className="select-language__select__option">
          {t("select.language.german")}
        </option>
        <option value="en" className="select-language__select__option">
          {t("select.language.english")}
        </option>
      </select>
    </div>
  );
};

export default SelectLanguage;
