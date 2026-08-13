import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

// CONTEXT
import { MainContextProvider } from "./contexts/MainContext.tsx";

const container = document.getElementById("root");

if (!container) {
  throw new Error("'#root' Element not found!");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <MainContextProvider>
        <App />
      </MainContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registrado:", reg))
      .catch((err) => console.error("Erro no Service Worker:", err));
  });
}
