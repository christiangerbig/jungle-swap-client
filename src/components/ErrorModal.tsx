import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../hooks";
import { setErrorMessage } from "../reducer/jungleSwapSlice";

type ErrorModalProps = {
  errorMessage: string;
};

const ErrorModal = ({ errorMessage }: ErrorModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      // Authentification
      case "Error while creating user":
        return t("errors.signUp.errorWhileCreatingUser");
      case "User does not exist":
        return t("errors.signIn.userUnknown");
      case "Could not update user":
        return t("errors.logOut.noUserUpdate");
      // Plants
      case "Create plant failed":
        return t("errors.plant.createPlantFailed");
      case "Fetch plant failed":
        return t("errors.plant.fetchPlantFailed");
      case "Fetch all plants failed":
        return t("errors.plant.techAllPlantsFailed");
      case "Search plant failed":
        return t("errors.plant.searchPlantFailed");
      case "Update plant failed":
        return t("errors.plant.updatePlantFailed");
      case "Delete plant failed":
        return t("errors.plant.deletePlantFailed");
      // Messages
      case "Create message failed":
        return t("errors.message.createMessageFailed");
      case "Fetch message failed":
        return t("errors.message.fetchMessageFailed");
      case "Fetch all messages failed":
        return t("errors.message.fetchAllMessagesFailed");
      case "Update message failed":
        return t("errors.updateMessageFailed");
      case "Delete message failed":
        return t("errors.deleteMessageFailed");
      default:
        return t("errors.general");
    }
  };

  const closeModal = (): void => {
    dispatch(setErrorMessage(null));
  };

  return (
    <div className="error-modal">
      <div className="error-modal-box">
        <h1>{t("errorModal.headline")}</h1>
        <h2>{t("errorModal.subheadline")}</h2>
        <h3>{printErrorMessage(errorMessage)}</h3>
        <button
          className="btn btn-sm form-control is-width-xs mt-4 mb-3"
          onClick={() => {
            closeModal();
          }}
        >
          {t("button.proceed")}
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
