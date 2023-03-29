import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";

interface GoBackButtonProps {
  clickHandler: MouseEventHandler;
}

const GoBackButton = ({ clickHandler }: GoBackButtonProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="text-right">
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
            px-4 mt-4 
          ]
        `}
        onClick={clickHandler}
      >
        {t("button.goBack")}
      </button>
    </div>
  );
};

export default GoBackButton;
