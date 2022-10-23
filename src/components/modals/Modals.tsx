import { useAppSelector } from "../../app/hooks";
import { useOnlineStatus } from "../../app/custom-hooks/useOnlineStatus";
import { RootState } from "../../app/store";
import ErrorModal from "./ErrorModal";
import OfflineModal from "./OfflineModal";

const Modals = (): JSX.Element => {
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return <ErrorModal message={errorMessage} />;
  }
  return <OfflineModal isOnline={isOnline} />;
};

export default Modals;
