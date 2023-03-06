import { useNavigation } from "../../app/custom-hooks/useNavigation";
import { useTranslation } from "react-i18next";

const GoBackButton = (): JSX.Element => {
  const { t } = useTranslation();
  const { goToHome } = useNavigation();

  return (
    <div className="text-right pr-2">
      <button
        className="btn btn-sm button-go-back--width-medium mt-4 form-control"
        onClick={(): void => {
          goToHome();
        }}
      >
        {t("button.goBack")}
      </button>
    </div>
  );
};

export default GoBackButton;
