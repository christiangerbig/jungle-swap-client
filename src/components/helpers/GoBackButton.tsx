import { useNavigation } from "../../app/custom-hooks/useNavigation";
import { useTranslation } from "react-i18next";

const GoBackButton = (): JSX.Element => {
  const { goToHome } = useNavigation();
  const { t } = useTranslation();

  return (
    <div className="text-right pr-2">
      <button
        className="btn btn-sm mt-4 is-width-medium form-control"
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
