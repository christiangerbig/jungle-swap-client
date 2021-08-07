import React, { useEffect } from "react";

const KommunicateChat = () => {
  // Create launcher icon as soon as page loads
  useEffect(
    () => {
      (
        (d, m) => {
          const kommunicateSettings = {
            "appId": "10b22c52854a305b79bbdecc356bea5",
            "popupWidget": true,
            "automaticChatOpenOnNavigation": true
          };
          const s = document.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
          const h = document.getElementsByTagName("head")[0];
          h.appendChild(s);
          window.kommunicate = m;
          m._globals = kommunicateSettings;
        }
      )
        (
          document,
          window.kommunicate || {}
        );
    },
    []
  );

  return (<div />);
}

export default KommunicateChat;