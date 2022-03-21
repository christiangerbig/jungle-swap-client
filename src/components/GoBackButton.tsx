import { useHistory } from "react-router";
import { MainPageScrolling } from "../lib/MainPageScrolling";

const GoBackButton = () => {
  const history = useHistory();

  const handleGoBack = () => {
    const pageScrolling = new MainPageScrolling(history);
    pageScrolling.toTop();
  };

  return (
    <div className="text-right pr-2">
      <button
        className="btn btn-sm mt-4 smallWidth form-control"
        onClick={handleGoBack}
      >
        Go back
      </button>
    </div>
  );
};

export default GoBackButton;
