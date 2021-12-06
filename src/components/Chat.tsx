import { useEffect } from "react";

interface KommunicateSettings {
  appId: string;
  popupWidget: boolean;
  automaticChatOpenOnNavigation: boolean;
}

const KommunicateChat = (): JSX.Element => {
  useEffect(() => {
    const createLauncherIcon = (document: any, method: any) => {
      const kommunicateSettings: KommunicateSettings = {
        appId: "10b22c52854a305b79bbdecc356bea5",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      const scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.async = true;
      scriptElement.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      const headElement = document.getElementsByTagName("head")[0];
      headElement.appendChild(scriptElement);
      (window as any).kommunicate = method;
      method._globals = kommunicateSettings;
    };

    createLauncherIcon(document, (window as any).kommunicate || {});
  }, []);

  return <div />;
};

export default KommunicateChat;
