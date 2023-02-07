import { useEffect } from "react";
import { useChat } from "../../app/custom-hooks/useChat";

const KommunicateChat = (): JSX.Element => {
  const { createLauncherIcon } = useChat();

  useEffect(() => {
    createLauncherIcon(document, (window as any).kommunicate || {});
  }, []);

  return <div />;
};

export default KommunicateChat;
