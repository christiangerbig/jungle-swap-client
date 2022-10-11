import { useEffect } from "react";

type KommunicateSettings = {
  appId: string;
  popupWidget: boolean;
  automaticChatOpenOnNavigation: boolean;
};

const KommunicateChat = (): JSX.Element => {
  useEffect(() => {
    const createLauncherIcon = (htmlDocument: Document, method: any): void => {
      const kommunicateSettings: KommunicateSettings = {
        appId: "10b22c52854a305b79bbdecc356bea5",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      const scriptElement = htmlDocument.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.async = true;
      scriptElement.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      const headElement = htmlDocument.getElementsByTagName("head")[0];
      headElement.appendChild(scriptElement);
      (window as any).kommunicate = method;
      method._globals = kommunicateSettings;
    };

    createLauncherIcon(document, (window as any).kommunicate || {});
  }, []);

  return <div />;
};

export default KommunicateChat;
