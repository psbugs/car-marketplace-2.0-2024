import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useLocation,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getEdgeClass,
  getMatchingLanguages,
  hideNavWhenModalIsActive,
} from "../../utils";
import Flag from "react-world-flags";
import { useFavorites } from "../../hooks/useFavorites";
import { useCompares } from "../../hooks/useCompares";
import SVGSelector from "../common-components/SVGSelector";
import CustomModal from "../common-components/CustomModal";
import TradeInModalForm from "../TradeInModalForm/TradeInModalForm";

const Features = () => {
  const { t, i18n } = useTranslation();
  const { favData, comparablesData } = useSelector(
    (state) => state.transferCode,
  );
  const navigate = useNavigate();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { features = [] } = uiConfigData || {};
  const { locales } = uiConfigData?.i18n || false;
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");
  const comparablesDataItems = Array?.isArray(comparablesData?.items)
    ? comparablesData?.items
    : [];
  const filteredComparablesDataLength =
    comparablesDataItems?.filter((item) => Object.keys(item)?.length > 0)
      ?.length || 0;
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const favDataItems = Array.isArray(favData?.items) ? favData?.items : [];
  const filteredFavDataLength =
    favDataItems?.filter((item) => Object.keys(item).length > 0)?.length || 0;

  const redirectedUrlFromVehiclesPage = useSelector(
    (state) => state?.vehicles?.redirectedUrl,
  );
  const sessionFavData = sessionStorage?.getItem("favorites");
  const sessionComparablesData = sessionStorage?.getItem("comparables");
  const { clearFavorites } = useFavorites();
  const { clearComparables } = useCompares();

  useEffect(() => {
    if (favData?.items?.length !== 0 && sessionFavData === null) {
      clearFavorites();
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      comparablesData?.items?.length !== 0 &&
      sessionComparablesData === null
    ) {
      clearComparables();
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const path = event.composedPath();
      const isInsideDropdown = path.some(
        (el) =>
          el.classList?.contains("dropdown-container") ||
          el.classList?.contains("dropdown-item"),
      );

      if (!isInsideDropdown) {
        setLanguageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //eslint-disable-next-line
  }, []);

  const [isTradeInModalVisible, setTradeInModalVisible] = useState(false);
  const tradeInFormikRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const handleTradeInModalToggle = () => {
    if (tradeInFormikRef.current) {
      tradeInFormikRef.current.resetForm();
    }
    if (!isTradeInModalVisible) {
      newSearchParams.append("tradeIn", "true");
    } else {
      newSearchParams.delete("tradeIn");
    }

    setSearchParams(newSearchParams);
    const updatedModalState = !isTradeInModalVisible;
    setTradeInModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };
  const location = useLocation();

  useEffect(() => {
    const shouldShowModal = searchParams?.has("tradeIn");
    const shouldBlockModal = features && !features?.includes("TradeIn");

    if (!shouldBlockModal && isTradeInModalVisible !== shouldShowModal) {
      setTradeInModalVisible(shouldShowModal);
      hideNavWhenModalIsActive(shouldShowModal);
    }
    // eslint-disable-next-line
  }, [location?.search, features]);

  const featuresArr = [
    {
      icon: (
        <span>
          <SVGSelector name={"search-magnifying-glass-svg"} view={view} />
        </span>
      ),
      title: t("/.Search Result"),
      href: redirectedUrlFromVehiclesPage,
      classNames:
        features &&
        (features.includes("Favorites") ||
          features.includes("Comparison") ||
          features.includes("TradeIn") ||
          (features?.includes("LanguageSelector") &&
            locales &&
            locales?.length > 1))
          ? "border-r"
          : "",
    },
    features && features.includes("Favorites")
      ? {
          icon: (
            <span className="mr-3 relative">
              <SVGSelector
                name={"heart-svg"}
                pathStroke={
                  view === "favorites"
                    ? "var(--primary-dark-active-color) "
                    : "var(--davy-gray-color) "
                }
                svgWidth={24}
                svgHeight={28}
              />
              <span
                className={`absolute top-[-12px] right-[-21px] ${
                  filteredFavDataLength
                    ? "bg-[var(--primary-color)]"
                    : "bg-[var(--primary-color-20-single)]"
                } text-white w-5 h-5 ${getEdgeClass(edge, "rounded-full")} flex justify-center items-center text-xs`}
              >
                {filteredFavDataLength}
              </span>
            </span>
          ),
          title: t("/.Favorites"),
          href: "?view=favorites",
          classNames:
            features &&
            (features.includes("Comparison") ||
              features.includes("TradeIn") ||
              (features?.includes("LanguageSelector") &&
                locales &&
                locales?.length > 1))
              ? "border-r max-lg:border-r-0"
              : "",
        }
      : null,
    features && features.includes("Comparison")
      ? {
          icon: (
            <span className="mr-3 relative">
              <SVGSelector
                name="compare-svg"
                pathStroke={
                  view === "vehicle-comparison"
                    ? "var(--primary-dark-active-color) "
                    : "var(--davy-gray-color) "
                }
                svgWidth={24}
                svgHeight={28}
              />
              <span
                className={`flex justify-center items-center text-xs text-white w-5 h-5 absolute top-[-12px] right-[-21px] ${
                  filteredComparablesDataLength
                    ? "bg-[var(--primary-color)]"
                    : "bg-[var(--primary-color-20-single)]"
                } text-white w-5 h-5 ${getEdgeClass(edge, "rounded-full")} flex justify-center items-center text-xs`}
              >
                {filteredComparablesDataLength}
              </span>
            </span>
          ),
          title: t("/.Vehicle Comparison"),
          href: "?view=vehicle-comparison",
          classNames:
            features &&
            ((features && features.includes("TradeIn")) ||
              (features?.includes("LanguageSelector") &&
                locales &&
                locales?.length > 1))
              ? "border-r"
              : "",
        }
      : null,
    features && features.includes("TradeIn")
      ? {
          icon: (
            <SVGSelector
              name={"coins-svg"}
              pathFill={"var(--davy-gray-color)"}
              svgWidth={30}
              svgHeight={30}
            />
          ),
          classNames:
            features &&
            features?.includes("LanguageSelector") &&
            locales &&
            locales?.length > 1
              ? "border-r max-lg:border-r-0"
              : "",
          title: t("/vehicleDetails.Trade In"),
          handleClick: (evt) => {
            evt.preventDefault();
            handleTradeInModalToggle();
          },
        }
      : null,
    features &&
    features.includes("LanguageSelector") &&
    locales &&
    locales?.length > 1
      ? {
          icon: (
            <span>
              <SVGSelector name={"language-svg"} />
            </span>
          ),
          title: t("/.Language"),
          href: "",
          linkClassName: "relative",
          handleClick: (evt) => {
            evt.preventDefault();
            setLanguageDropdown(true);
          },
          dropdownDrawer: (
            <div
              className={`${languageDropdown && "border border-[var(--gray-color)]"}  ${getEdgeClass(edge)}  bg-[var(--white-dark-shade)] text-[var(--davy-gray-color)] dark:border-gray-600 origin-bottom absolute top-[85px] left-0 z-10 w-56 shadow-lg focus:outline-none dropdown-item max-lg:top-[60px] max-lg:left-[90px] max-md:left-[50px] max-sm:left-[15px]  max-sm:w-40`}
            >
              <div
                className={`py-1 dropdown-item ${
                  languageDropdown ? "block" : "hidden"
                }`}
              >
                {locales &&
                  getMatchingLanguages({ locales, t })?.map(
                    ({ id, label, code, ref }) => (
                      <span
                        key={id}
                        className=" text-[var(--davy-gray-color)] px-12 py-2 text-sm cursor-pointer flex gap-2 dropdown-item max-sm:px-6 items-center"
                        id={`menu-item-${id}`}
                        onClick={() => {
                          i18n.changeLanguage(ref);
                          setLanguageDropdown(false);
                          navigate(0);
                        }}
                      >
                        <span className="dropdown-item">
                          <Flag code={code} className="h-4 w-6" />
                        </span>
                        <p className="dropdown-item">{label}</p>
                      </span>
                    ),
                  )}
              </div>
            </div>
          ),
        }
      : null,
  ].filter(Boolean);

  return (
    <section className="py-4 max-md:pb-2" id="features-section">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div
          className={`${getEdgeClass(edge, "rounded-xl")} text-[var(--davy-gray-color)] justify-start text-lg bg-[var(--white-shade)] py-3 px-7 flex flex-wrap w-full items-center max-lg:gap-y-3 max-lg:bg-transparent max-lg:p-0 space-evenly max-lg:mb-5 max-lg:text-sm max-md:text-xs max-[280px]:flex-col max-md:mb-2`}
        >
          {featuresArr?.map((item, index) => {
            const isActive =
              (view === "favorites" && item?.title === t("/.Favorites")) ||
              (view === "vehicle-comparison" &&
                item?.title === t("/.Vehicle Comparison")) ||
              (!view && item?.title === t("/.Search Result"));
            return (
              <div
                className={`py-3 max-md:py-3 max-[280px]:w-full ${
                  item?.classNames
                }  max-lg:w-2/4 flex-auto relative  max-lg:bg-[var(--white-shade)] max-lg:h-[53px] flex justify-center items-center max-lg:gap-y-1 px-2 ${
                  index === 1 ? "max-lg:border-r-0" : ""
                }`}
                key={index}
              >
                <Link
                  to={item?.href}
                  className={`${
                    isActive
                      ? "text-[var(--primary-dark-active-color)]"
                      : "text-[var(--davy-gray-color)] "
                  } flex items-center gap-4 font-medium justify-center ${
                    item?.linkClassName
                  }`}
                  onClick={item?.handleClick}
                >
                  {item?.icon}
                  {item?.title}
                </Link>
                {item?.dropdownDrawer}
              </div>
            );
          })}
        </div>
      </div>
      {features &&
      features.includes("TradeIn") &&
      searchParams?.has("tradeIn") ? (
        <CustomModal
          customPopupWidth={1199}
          isVisible={isTradeInModalVisible}
          handleModalToggle={handleTradeInModalToggle}
          modalHeader={t("/vehicleDetails.Trade In")}
          modalContent={
            <TradeInModalForm
              formikRef={tradeInFormikRef}
              handleModalToggle={handleTradeInModalToggle}
              isTradeInModalVisible={isTradeInModalVisible}
            />
          }
        />
      ) : null}
    </section>
  );
};

export default Features;
