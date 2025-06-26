import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Preloader from "./components/Preloader";
import "./i18n";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Vehicle from "./pages/Vehicle";
import VehicleComparison from "./pages/VehicleComparison";
import VehicleDetails from "./pages/VehicleDetails";
import { criteriaAll } from "./redux/CriteriaSlice";
import { uiConfigAll, updateEdge } from "./redux/UiConfigurationSlice";
// import LandingPage from "./pages/LandingPage/LandingPage"

function App({ root: shadowRoot }) {
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const spinnerAddedRef = useRef(false);
  const dispatch = useDispatch();
  const {
    uiConfigData = false,
    imprintUrl = false,
    privacyUrl = false,
    theme = false,
    loading: uiConfigLoading = false,
  } = useSelector((state) => state?.uiConfig) || {};
  const { criteriaAll: criteriaAllRes = [], loading: criteriaLoading = false } =
    useSelector((state) => state?.criteria) || {};

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  useEffect(() => {
    if (uiConfigData === false && !uiConfigLoading) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, uiConfigData, uiConfigLoading]);

  const [isValidApiKeyAndUrl, setIsValidApiKeyAndUrl] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => {
      setLoading(false);
    };
    window.addEventListener("load", handlePageLoad);
    return () => window.removeEventListener("load", handlePageLoad);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (localStorage.getItem("persist:root")) {
      let localStorageApiKey = JSON.parse(
        JSON.parse(localStorage.getItem("persist:root"))?.criteria,
      )?.storeApiKey;
      const rootElementApiKey = document
        ?.getElementById("am-marketplace")
        ?.getAttribute("apikey");
      if (localStorageApiKey !== rootElementApiKey) {
        localStorage.removeItem("persist:root");
        window.location.reload();
      }
    }
  }, []);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");
  const utmSource = queryParams.get("utm_source");
  const utmCampaign = queryParams.get("utm_campaign");

  useEffect(() => {
    if (utmSource) {
      sessionStorage.setItem("source", utmSource);
    }
    if (utmCampaign) {
      sessionStorage.setItem("campaign", utmCampaign);
    }
  }, [utmSource, utmCampaign]);

  useEffect(() => {
    if (spinnerAddedRef.current) return; // Prevent duplicate execution
    const ele = document.getElementById("am-marketplace");
    if (ele) {
      setIsValidApiKeyAndUrl(true);
      setLoading(true);
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const renderPage = () => {
    switch (view) {
      case "vehicle-details":
        return <VehicleDetails />;
      case "favorites":
        return <Favorites />;
      case "vehicle-comparison":
        return <VehicleComparison />;
      case "vehicles":
        return <Vehicle />;
      case "not-found":
        return <NotFound />;
      default:
        return (
          isValidApiKeyAndUrl && <Vehicle domainName={theme?.companyName} />
        );
    }
  };

  useEffect(() => {
    const ele = document.getElementById("pxc-accessories-section");
    const suggestedEle = document.getElementById("suggested-container");
    if (view !== "vehicle-details") {
      ele?.setAttribute("style", "display:none");
      suggestedEle?.setAttribute("style", "display:none");
    } else {
      ele?.setAttribute("style", "display:block");
      suggestedEle?.setAttribute("style", "display:block");
      suggestedEle?.setAttribute("style", "z-index:0");
    }
  }, [view]);

  useEffect(() => {
    // Set CSS variables when the component mounts
    document.documentElement.style.setProperty(
      "--toastify-color-light",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-dark",
      "#121212",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-info",
      "#3498db",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-success",
      "#07bc0c",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-warning",
      "#f1c40f",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-error",
      "#e74c3c",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-transparent",
      "hsla(0, 0%, 100%, 0.7)",
    );
    document.documentElement.style.setProperty(
      "--toastify-icon-color-info",
      "var(--toastify-color-info)",
    );
    document.documentElement.style.setProperty(
      "--toastify-icon-color-success",
      "var(--toastify-color-success)",
    );
    document.documentElement.style.setProperty(
      "--toastify-icon-color-warning",
      "var(--toastify-color-warning)",
    );
    document.documentElement.style.setProperty(
      "--toastify-icon-color-error",
      "var(--toastify-color-error)",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-width",
      "320px",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-offset",
      "16px",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-top",
      "max(var(--toastify-toast-offset), env(safe-area-inset-top))",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-right",
      "max(var(--toastify-toast-offset), env(safe-area-inset-right))",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-left",
      "max(var(--toastify-toast-offset), env(safe-area-inset-left))",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-bottom",
      "max(var(--toastify-toast-offset), env(safe-area-inset-bottom))",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-background",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-min-height",
      "64px",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-max-height",
      "800px",
    );
    document.documentElement.style.setProperty(
      "--toastify-toast-bd-radius",
      "6px",
    );
    document.documentElement.style.setProperty(
      "--toastify-font-family",
      "sans-serif",
    );
    document.documentElement.style.setProperty("--toastify-z-index", "9999");
    document.documentElement.style.setProperty(
      "--toastify-text-color-light",
      "#757575",
    );
    document.documentElement.style.setProperty(
      "--toastify-text-color-dark",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-text-color-info",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-text-color-success",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-text-color-warning",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-text-color-error",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--toastify-spinner-color",
      "#616161",
    );
    document.documentElement.style.setProperty(
      "--toastify-spinner-color-empty-area",
      "#e0e0e0",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-light",
      "linear-gradient(90deg, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-dark",
      "#bb86fc",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-info",
      "var(--toastify-color-info)",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-success",
      "var(--toastify-color-success)",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-warning",
      "var(--toastify-color-warning)",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-error",
      "var(--toastify-color-error)",
    );
    document.documentElement.style.setProperty(
      "--toastify-color-progress-bgo",
      "0.2",
    );
    document.documentElement.style.setProperty(
      "--swiper-theme-color",
      "#007aff",
    );
  }, []);

  useEffect(() => {
    const syncEdge = () => {
      const edge = localStorage.getItem("market-place-saved-edge");
      if (edge) {
        dispatch(updateEdge(edge));
      }
    };
    const handleStorage = (e) => {
      if (e.key === "market-place-saved-edge") {
        dispatch(updateEdge(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", syncEdge);

    syncEdge();

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", syncEdge);
    };
  }, [dispatch]);

  return (
    <>
      {loading && <Preloader />}
      <div className="text-[var(--text-dark-mode)] bg-[var(--whitesmoke-color)]">
        <ToastContainer className="Toast_container mt-12" />
        {renderPage()}
        <pxc-os-settings
          api-key={document
            ?.getElementById("am-marketplace")
            ?.getAttribute("apikey")}
          urls-imprint={imprintUrl}
          urls-privacy={privacyUrl}
        />
      </div>
    </>
  );
}

export default App;
