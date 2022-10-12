import { useState, useEffect, useContext, createContext } from "react";

type OnlineStatusProviderProps = {
  children: any;
};

const OnlineStatusContext = createContext(true);

export const OnlineStatusProvider = ({
  children,
}: OnlineStatusProviderProps): JSX.Element => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    const handleOfflineEventCallback = (): void => {
      setOnlineStatus(false);
    };

    const handleOnlineEventCallback = (): void => {
      setOnlineStatus(true);
    };

    window.addEventListener("offline", handleOfflineEventCallback);
    window.addEventListener("online", handleOnlineEventCallback);

    return () => {
      window.removeEventListener("offline", handleOfflineEventCallback);
      window.removeEventListener("online", handleOnlineEventCallback);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = (): boolean => {
  return useContext(OnlineStatusContext);
};
