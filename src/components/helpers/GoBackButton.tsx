import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { MainPageScrolling } from "../../lib/MainPageScrolling";

const GoBackButton = (): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleGoBack = (): void => {
    const pageScrolling = new MainPageScrolling(history);
    pageScrolling.toTop();
  };

  return (
    <div className="text-right pr-2">
      <button
        className="btn btn-sm mt-4 is-width-medium form-control"
        onClick={handleGoBack}
      >
        {t("button.goBack")}
      </button>
    </div>
  );
};

export default GoBackButton;
