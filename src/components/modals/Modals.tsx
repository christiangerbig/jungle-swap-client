import { useAppSelector } from "../../app/hooks";
import { useOnlineStatus } from "../../app/custom-hooks/useOnlineStatus";
import ErrorModal from "./ErrorModal";
import OfflineModal from "./OfflineModal";
import { selectErrorMessage } from "../../reducer/jungleSwapSlice";

const Modals = (): JSX.Element => {
  const errorMessage = useAppSelector(selectErrorMessage);
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return <ErrorModal message={errorMessage} />;
  }
  return <OfflineModal isOnline={isOnline} />;
};

export default Modals;
