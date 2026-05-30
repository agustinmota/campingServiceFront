import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { router } from "./router";
import { SessionWatcher } from "./shared/SessionWatcher";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionWatcher />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
