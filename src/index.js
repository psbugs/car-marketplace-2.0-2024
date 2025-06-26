import versionData from "./version.json";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./hooks/ThemeProvider";
import PxcPromotionsPortal from "./portals/PxcPromotionsPortal";
import PxcSearchPortal from "./portals/PxcSearchPortal";
import "./i18n/i18n";
import Preloader from "./components/Preloader";
import Portal from "./components/Portal";
import "./components/VehicleAccessories/VehicleAccessories.css";
import VehicleAccessoriesPortal from "./components/VehicleAccessoriesPortal/VehicleAccessoriesPortal";
import VehicleOffersPortal from "./components/VehicleOffersPortal/VehicleOffersPortal";
const APP_VERSION = versionData.APP_VERSION;
const savedVersion = localStorage?.getItem("app_version");
if (savedVersion !== APP_VERSION) {
  localStorage?.clear();
  sessionStorage?.clear();
  localStorage?.setItem("app_version", APP_VERSION);
}

const REACT_APP_URL = process.env.REACT_APP_URL;
const NODE_ENV = process.env.NODE_ENV;

// Helper function to load CSS dynamically
const loadCSS = async (shadowRoot) => {
  try {
    const response = await fetch(`${REACT_APP_URL}/asset-manifest.json`);
    const manifest = await response.json();
    const cssFile = manifest.files["main.css"];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${REACT_APP_URL}/${cssFile}`;
    shadowRoot.appendChild(link);
  } catch (error) {
    console.error("Error loading CSS:", error);
  }
};

// Helper function to inject external stylesheets
const injectStylesheets = (shadowRoot) => {
  const stylesheets = [
    "/swiper-bundle.min.css",
    "/ReactToastify.min.css",
    "/InnerImageZoom.min.css",
    "/Calendar.css",
  ];

  stylesheets.forEach((cssFile) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${REACT_APP_URL}${cssFile}`;
    shadowRoot.appendChild(link);
  });
};

// Function to create and render React root in shadow DOM
const renderApp = async (containerId, Component) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.setAttribute(
    "class",
    "text-[var(--text-dark-mode)] bg-[var(--whitesmoke-color)] pxc-accessories-wrapper",
  );
  const mainContainer = document.createElement("div");
  const suggestedContainer = document.createElement("div");
  const vehicleAccessoriesContainer = document.createElement("div");
  mainContainer.id = "main-container";
  suggestedContainer.id = "suggested-container";
  vehicleAccessoriesContainer.id = "vehicle-accessories-container-container";
  container.appendChild(mainContainer);
  container.appendChild(vehicleAccessoriesContainer);
  container.appendChild(suggestedContainer);

  const shadowRoot = mainContainer.attachShadow({ mode: "open" });

  // Inject common stylesheets
  injectStylesheets(shadowRoot);

  // Load the CSS file for production or development environment
  if (NODE_ENV !== "development") {
    loadCSS(shadowRoot);
  } else {
    const style = document.createElement("style");
    const indexCssContent = document?.querySelector("style")?.textContent;
    style.textContent = indexCssContent;
    shadowRoot.appendChild(style);
  }

  window.addEventListener("routeChange", (event) => {
    const path = event.detail;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  const root = ReactDOM.createRoot(shadowRoot);

  return new Promise((resolve) => {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <ThemeProvider>
                <Suspense fallback={<Preloader />}>
                  <Component root={shadowRoot} />
                </Suspense>
              </ThemeProvider>
            </Router>
          </PersistGate>
        </Provider>
      </React.StrictMode>,
    );
    resolve();
  });
};

// Render different portals if containers exist
await renderApp("am-marketplace", App).then(() => {
  const containerEle = document?.getElementById("suggested-container");
  const vehicleAccessoriesEle = document?.getElementById(
    "vehicle-accessories-container-container",
  );
  if (containerEle) {
    const shadowRoot = containerEle.attachShadow({ mode: "open" });

    injectStylesheets(shadowRoot);
    if (NODE_ENV !== "development") {
      loadCSS(shadowRoot);
    } else {
      const style = document.createElement("style");
      const indexCssContent = document?.querySelector("style")?.textContent;
      style.textContent = indexCssContent;
      shadowRoot.appendChild(style);
    }

    const root = ReactDOM.createRoot(shadowRoot);
    root.render(
      <Portal
        domNode={shadowRoot}
        identifier="suggested-container-portal"
        clsName="pxc-portal text-[var(--text-dark-mode)] bg-[var(--whitesmoke-color)]"
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <ThemeProvider>
                <Suspense fallback={<Preloader />}>
                  <VehicleOffersPortal />
                </Suspense>
              </ThemeProvider>
            </Router>
          </PersistGate>
        </Provider>
      </Portal>,
    );
  }
  if (vehicleAccessoriesEle) {
    const root = ReactDOM.createRoot(vehicleAccessoriesEle);
    root.render(
      <Portal
        domNode={vehicleAccessoriesEle}
        identifier="vehicle-accessories-portal"
        clsName="pxc-accessories-wrapper"
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <ThemeProvider>
                <Suspense fallback={<Preloader />}>
                  <VehicleAccessoriesPortal />
                </Suspense>
              </ThemeProvider>
            </Router>
          </PersistGate>
        </Provider>
      </Portal>,
    );
  }
});

renderApp("filter-root", PxcSearchPortal);
renderApp("promotion-root", PxcPromotionsPortal);

// Measure performance
reportWebVitals();
