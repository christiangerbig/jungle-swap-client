import { useState, useEffect } from "react";

export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const handleOfflineEventCallback = (): void => {
      setIsOnline(false);
    };

    const handleOnlineEventCallback = (): void => {
      setIsOnline(true);
    };

    window.addEventListener("offline", handleOfflineEventCallback);
    window.addEventListener("online", handleOnlineEventCallback);

    return () => {
      window.removeEventListener("offline", handleOfflineEventCallback);
      window.removeEventListener("online", handleOnlineEventCallback);
    };
  }, []);

  return isOnline;
};
