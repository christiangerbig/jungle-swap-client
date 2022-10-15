import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { OnlineStatusProvider } from "./custom-hooks/useOnlineStatus";

import "./i18n";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <OnlineStatusProvider>
        <Router>
          <App />
        </Router>
      </OnlineStatusProvider>
    </Provider>
  </React.StrictMode>,
  document.querySelector("#root")
);
