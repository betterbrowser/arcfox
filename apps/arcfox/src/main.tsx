import React from "react";
import ReactDOM from "react-dom/client";
import { Sidebar } from "./Sidebar.tsx";

ReactDOM.createRoot(document.getElementById("sidebar")!).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>
);
