import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SiteRouter from "./site-router";
import "./fonts/Saints-Regular.woff2";
import "react-toastify/dist/ReactToastify.css";
import "./fonts/Saints-Bold.woff2";
import { SignupProvider } from "./context/SignupProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SignupProvider>
      <SiteRouter />
    </SignupProvider>
  </React.StrictMode>
);
