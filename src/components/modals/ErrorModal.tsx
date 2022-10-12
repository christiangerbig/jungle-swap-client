import { useTranslation } from "react-i18next";
import ModalBody from "./ModalBody";

type ErrorModalProps = {
  errorMessage: string;
};

const ErrorModal = ({ errorMessage }: ErrorModalProps): JSX.Element => {
  const { t } = useTranslation();

  const convertErrorMessage = (errorMessage: string): string => {
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
    <div>
      <ModalBody
        headline={t("texts.errorModal.headline")}
        subheadline={t("texts.errorModal.subheadline")}
        errorText={convertErrorMessage(errorMessage)}
        isClose={true}
      />
    </div>
  );
};

export default ErrorModal;
