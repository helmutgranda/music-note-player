import React from "react";
import ReactDOM from "react-dom";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.fill";
import "core-js/modules/es.string.includes";
import "core-js/modules/es.string.trim";
import "core-js/modules/es.object.values";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
