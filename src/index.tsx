import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./app/i18next.config";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Suspense fallback="loading">
          <App />
        </Suspense>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.querySelector("#root")
);
