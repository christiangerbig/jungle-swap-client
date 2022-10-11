import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks";
import { setErrorMessage } from "../../reducer/jungleSwapSlice";

type ErrorModalProps = {
  errorMessage: string;
};

const ErrorModal = ({ errorMessage }: ErrorModalProps): JSX.Element => {
  const divElementRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleCloseModal = (): void => {
    dispatch(setErrorMessage(null));
  };

  const handleClickOutside = (event: any): void => {
    if (divElementRef.current === event.target) {
      handleCloseModal();
    }
  };

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      // Authentification
      case "Error while creating user":
        return t("errorTexts.authentification.signUp.errorWhileCreatingUser");
      case "User does not exist":
        return t("errorTexts.authentification.signIn.userUnknown");
      case "Could not update user":
        return t("errorTexts.authentification.logOut.noUserUpdate");
      // Plants
      case "Create plant failed":
        return t("errorTexts.plants.createPlantFailed");
      case "Fetch plant failed":
        return t("errorTexts.plants.fetchPlantFailed");
      case "Fetch all plants failed":
        return t("errorTexts.plants.techAllPlantsFailed");
      case "Search plant failed":
        return t("errorTexts.plants.searchPlantFailed");
      case "Update plant failed":
        return t("errorTexts.plants.updatePlantFailed");
      case "Delete plant failed":
        return t("errorTexts.plants.deletePlantFailed");
      // Messages
      case "Create message failed":
        return t("errorTexts.messages.createMessageFailed");
      case "Fetch message failed":
        return t("errorTexts.messages.fetchMessageFailed");
      case "Fetch all messages failed":
        return t("errorTexts.messages.fetchAllMessagesFailed");
      case "Update message failed":
        return t("errorTexts.updateMessageFailed");
      case "Delete message failed":
        return t("errorTexts.deleteMessageFailed");
      default:
        return t("errorTexts.general");
    }
  };

  return (
    <div
      ref={divElementRef}
      className="error-modal"
      onClick={(event) => {
        handleClickOutside(event);
      }}
    >
      <div className="error-modal-box">
        <h1>{t("texts.errorModal.headline")}</h1>
        <h2>{t("texts.errorModal.subheadline")}</h2>
        <h3>{printErrorMessage(errorMessage)}</h3>
        <button
          className="btn btn-sm form-control is-width-small mt-4 mb-3"
          onClick={handleCloseModal}
        >
          {t("button.proceed")}
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
