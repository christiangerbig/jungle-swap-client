import { useNavigation } from "../../custom-hooks/useNavigation";
import { useTranslation } from "react-i18next";

const GoBackButton = (): JSX.Element => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <div className="text-right pr-2">
      <button
        className="btn btn-sm mt-4 is-width-medium form-control"
        onClick={(): void => {
          navigation.goToHome();
        }}
      >
        {t("button.goBack")}
      </button>
    </div>
  );
};

export default GoBackButton;
