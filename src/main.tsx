import React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter } from "react-router";
import App from "./App";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
