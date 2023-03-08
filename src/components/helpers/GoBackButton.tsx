import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";

interface GoBackButtonProps {
  clickHandler: MouseEventHandler;
}

const GoBackButton = ({ clickHandler }: GoBackButtonProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="text-right pr-2">
      <button
        className="[ button--width-medium ] [ btn btn-sm px-4 mt-4 form-control ]"
        onClick={clickHandler}
      >
        {t("button.goBack")}
      </button>
    </div>
  );
};

export default GoBackButton;
