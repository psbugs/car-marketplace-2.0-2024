import React, { useMemo, useRef, useState } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import {
  colorNameMap,
  colorsForItsSubFilter,
  darkMode,
  defaultImg,
  priceValue,
} from "../../constants/common-constants";
import {
  capitalizeFirstLetter,
  convertNumberFormat,
  extractMonthAndYear,
  getEdgeClass,
  hideNavWhenModalIsActive,
  scrollToTopFunction,
} from "../../utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../../components/common-components/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../components/common-components/SVGSelector";
import { useCompares } from "../../hooks/useCompares";
import TestDriveModalForm from "../../components/TestDriveModalForm";
import CustomModal from "../../components/common-components/CustomModal";
import { showTestDriveForm } from "../../redux/TestDriveSlice";

const VehicleListCard = ({
  cars,
  idx,
  loadedImage,
  onImageLoad,
  isFavoritesPage,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isComparable, toggleComparison } = useCompares();
  const { t } = useTranslation();
  const {
    manufacturer = false,
    model = false,
    modelExtension = false,
    contact = false,
    mediaItems = false,
    kw = false,
    hp = false,
    dateOfFirstRegistration = false,
    paintColor = false,
    mileage = false,
    previousUsageType = false,
    sealOfQuality = false,
    sealOfQualityImageUrl = false,
    gearbox = false,
    campaignPriceMarket = false,
    leasingOptions = false,
    financingOptions = false,
    paintColoring = false,
    consumerPrice = false,
    wltpEnVkvText = false,
    fuel = false,
  } = cars || {};
  const {
    address1 = false,
    address2 = false,
    zip = false,
    town = false,
  } = contact || {};
  const { uiConfigData = false, edge = false } = useSelector(
    (state) => state.uiConfig,
  );
  const { features = [] } = uiConfigData || {};

  const priceDetails = priceValue({
    consumerPrice,
    campaignPriceMarket,
    uiConfigData,
  });

  const getLinearGradientColorForEachItem = (itemToGetColor) => {
    const germanColorName = colorNameMap?.[itemToGetColor];
    return colorsForItsSubFilter
      ?.filter((item) => item?.label === germanColorName)
      ?.map((item) => item.hashCode)[0];
  };

  const { i18n = false } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const skip = parseInt(queryParams.get("skip")) || 0;
  const index = skip ? parseInt(skip + idx) : idx;
  const navigate = useNavigate();

  const [isTestDriveModalVisible, setIsTestDriveModalVisible] = useState(false);
  const testDriveFormikRef = useRef(null);
  const dispatch = useDispatch();

  const handleTestDriveModalToggle = () => {
    if (testDriveFormikRef.current) {
      testDriveFormikRef.current.resetForm();
    }
    dispatch(showTestDriveForm());

    const updatedModalState = !isTestDriveModalVisible;
    setIsTestDriveModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };

  const handleClick = (path, e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("routeChange", { detail: path }));
    scrollToTopFunction();
  };
  const imageUrl = useMemo(() => {
    if (!mediaItems?.[0]?.downloadUrl) return defaultImg;

    const base = mediaItems[0].downloadUrl.split("&bg=")[0];
    const bg = darkMode ? "1E1E1E" : "ffffff";
    return `${base}&w=380&h=280&bg=${bg}&q=81`;
  }, [mediaItems, darkMode]);

  return (
    <div className="flex items-end flex-col">
      <Link
        to={`?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}`}
        className="w-full"
        onClick={(e) =>
          handleClick(
            `?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}`,
            e,
          )
        }
      >
        <li
          className={`bg-[var(--white-dark-shade)] flex box_shadow max-lg:flex-col ${getEdgeClass(edge)}`}
          key={idx}
        >
          <figure
            className={`flex items-center max-md:pl-0 max-md:overflow-hidden max-lg:p-0 bg-[var(--white-dark-shade)] ${getEdgeClass(edge)}`}
          >
            {!loadedImage && (
              <div
                className={`skeleton-item h-[214px] w-[288px] bg-gray-300 animate-pulse max-lg:w-full ${getEdgeClass(edge)}`}
              ></div>
            )}
            <div className={`${getEdgeClass(edge)} max-lg:w-full `}>
              <img
                className={`h-[214px] w-[310px] object-contain max-lg:w-full max-lg:h-full max-lg:px-4 ${getEdgeClass(edge, "rounded-2xl")} ${!loadedImage ? "opacity-0 absolute" : "opacity-1 static"}`}
                src={imageUrl}
                loading="lazy"
                alt={`${manufacturer && manufacturer?.resourceName} ${
                  model && model?.name
                } ${modelExtension && modelExtension}`}
                onLoad={() => onImageLoad(cars?.id)}
                onError={() => onImageLoad(cars?.id)}
              />
            </div>
          </figure>
          <div
            className={`p-4 pr-0 w-2/4 max-2xl:w-full max-lg:pr-4 relative ${getEdgeClass(edge)}`}
          >
            <div className="flex gap-2 items-center flex-wrap">
              {previousUsageType && previousUsageType?.name ? (
                <span
                  className={`h-[42px] flex items-center justify-center border text-[0.9rem] text-[var(--text-black-white)] border-[var(--text-black-white)] p-1 px-[0.7rem]`}
                >
                  {capitalizeFirstLetter(previousUsageType?.name)}{" "}
                </span>
              ) : null}
              {sealOfQualityImageUrl ? (
                <img
                  src={sealOfQualityImageUrl}
                  alt={sealOfQuality}
                  className="h-[44px]"
                />
              ) : null}
            </div>
            <div className="flex justify-between items-start break-words leading-none gap-1">
              <div className="max-w-[600px]">
                <Tooltip
                  text={`${manufacturer && manufacturer?.resourceName} 
              ${model && model?.name} 
               ${modelExtension && modelExtension}`}
                >
                  <h4
                    className={`text-lg font-semibold text-[var(--secondary-color)] word-break-break-word leading-6 ${
                      !wltpEnVkvText ? "line-clamp-2" : "line-clamp-1"
                    }`}
                  >
                    {`${manufacturer && manufacturer?.resourceName} 
              ${model && model?.name} 
               ${modelExtension && modelExtension}`}
                  </h4>
                </Tooltip>
                <span className="text-[var(--davy-gray-color)] text-xs line-clamp-2 flex items-center ms-[-2px] gap-1">
                  <SVGSelector name={"cards-location-pin-svg"} />
                  {`${address1 ? address1 : ""} ${
                    address2 ? `${address2} •` : ""
                  }, ${zip ? zip : ""}  ${town ? town : ""}`}
                </span>
              </div>
              {features &&
              (features.includes("Favorites") ||
                features.includes("Comparison")) ? (
                <div className="flex gap-1">
                  {!isFavoritesPage && features.includes("Favorites") ? (
                    <div
                      className="cursor-pointer rounded-full px-2 py-2 bg-[var(--primary-color-20-single)] max-w-max"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        toggleFavorite(cars?.id);
                      }}
                    >
                      <SVGSelector
                        name="heart-svg"
                        pathFill={
                          isFavorite(cars?.id)
                            ? "var(--primary-dark-color)"
                            : "none"
                        }
                        pathStroke={
                          isFavorite(cars?.id)
                            ? "var(--primary-dark-color)"
                            : "var(--davy-gray-color)"
                        }
                        svgWidth={16}
                        svgHeight={16}
                      />
                    </div>
                  ) : null}
                  {!isFavoritesPage && features.includes("Comparison") ? (
                    <div
                      className="cursor-pointer rounded-full px-2 py-2 bg-[var(--primary-color-20-single)] max-w-max"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        toggleComparison(cars?.id);
                      }}
                    >
                      <SVGSelector
                        name={"compare-svg"}
                        pathFill={
                          isComparable(cars?.id)
                            ? "var(--primary-dark-color)"
                            : "none"
                        }
                        pathStroke={
                          isComparable(cars?.id)
                            ? "var(--primary-dark-color)"
                            : "var(--davy-gray-color)"
                        }
                        svgWidth={16}
                        svgHeight={16}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div
              className={`hidden p-2 flex-[230px] bg-[var(--white-light-smoke-color)] mt-3 max-sm:flex-auto max-lg:block max-lg:pb-16 max-md:pb-14 ${getEdgeClass(edge)}`}
            >
              <div className="max-lg:grid max-lg:grid-cols-3 max-lg:pb-2 max-md:grid-cols-2 max-sm:grid-cols-1">
                {dateOfFirstRegistration && dateOfFirstRegistration?.date ? (
                  <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                    <span>
                      <SVGSelector name={"calender-svg"} />
                    </span>
                    <Tooltip
                      text={extractMonthAndYear(dateOfFirstRegistration?.date)}
                    >
                      <p className="text-xs line-clamp-1">
                        {extractMonthAndYear(dateOfFirstRegistration?.date)}
                      </p>
                    </Tooltip>
                  </div>
                ) : null}
                <div className="flex items-center gap-[0.2rem] text-xs font-semibold mt-4">
                  <span>
                    <SVGSelector name={"speedometer-svg"} />
                  </span>
                  {/* Using toLocaleString directly please do not remove it  */}
                  <Tooltip
                    text={`${mileage?.toLocaleString(currency?.locale)} km`}
                  >
                    <p className="text-xs line-clamp-1">
                      {`${mileage?.toLocaleString(currency?.locale)} km`}
                    </p>
                  </Tooltip>
                </div>{" "}
                {kw || hp ? (
                  <div className="flex items-center gap-[0.2rem] text-xs font-semibold mt-4">
                    <span>
                      <SVGSelector name={"engine-warning-light-svg"} />
                    </span>
                    <Tooltip
                      text={
                        kw && hp
                          ? `${kw} kW (${hp} ${t("/vehicles.HP")})`
                          : null
                      }
                    >
                      <p className="text-xs line-clamp-1">
                        {`${kw} kW ${hp ? `(${hp} ${t("/vehicles.HP")})` : ""}`}
                      </p>
                    </Tooltip>
                  </div>
                ) : null}{" "}
                {gearbox && gearbox.name ? (
                  <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                    <span>
                      <SVGSelector name={"gear-svg"} />
                    </span>
                    <Tooltip text={gearbox?.name && gearbox?.name}>
                      <p className="text-xs line-clamp-1 capitalize">
                        {gearbox?.name && gearbox?.name}
                      </p>
                    </Tooltip>
                  </div>
                ) : null}
                {paintColor && (
                  <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                    <span>
                      <SVGSelector
                        name={"color-display-svg"}
                        pathFill={getLinearGradientColorForEachItem(
                          capitalizeFirstLetter(paintColoring?.name),
                        )}
                      />
                    </span>
                    <Tooltip text={paintColor && paintColor}>
                      <p className="text-xs line-clamp-1 capitalize">
                        {paintColor && paintColor}
                      </p>
                    </Tooltip>
                  </div>
                )}
                {fuel && fuel?.name && (
                  <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                    <SVGSelector name="fuel-pump-svg" />
                    <Tooltip text={fuel?.name}>
                      <p className="text-xs line-clamp-1 capitalize">
                        {fuel?.name}
                      </p>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`flex gap-2 justify-evenly flex-wrap my-4  max-sm:my-0 bg-[var(--primary-dark-color)] text-[var(--text-white-black)] p-2 ${
                !wltpEnVkvText
                  ? "bottom-0 absolute w-[96.5%] max-lg:w-[95.5%] max-sm:w-[91.5%]"
                  : ""
              } ${getEdgeClass(edge)} `}
            >
              <div className="ps-4 max-xl:ps-2">
                <h4 className="font-semibold text-xl max-lg:text-[18px] max-xl:text-sm ">
                  {priceDetails && priceDetails?.totalPrice
                    ? convertNumberFormat(priceDetails?.totalPrice, currency)
                    : ""}
                </h4>
                {priceDetails && priceDetails?.vatDeductible ? (
                  <p className="text-[10px] text-[var(--white-shade)] max-xl:text-[7px]">
                    <span>{t("/vehicles.VAT Reportable")}</span>
                  </p>
                ) : null}
              </div>
              {(leasingOptions && leasingOptions?.[0]?.instalment) ||
              (financingOptions && financingOptions?.[0]?.instalment) ? (
                <hr className="h-11 w-[1px] bg-[var(--white-dark-shade)]" />
              ) : (
                ""
              )}
              {leasingOptions && leasingOptions?.[0]?.instalment ? (
                <div className="ps-4 max-xl:ps-2">
                  <h4 className="font-semibold max-lg:text-[18px] text-xl max-xl:text-sm">
                    {convertNumberFormat(
                      leasingOptions?.[0]?.instalment,
                      currency,
                    )}
                    <sup
                      onClick={(evt) => {
                        evt.stopPropagation();
                        scrollToTopFunction();
                        evt.preventDefault();
                        navigate(
                          `?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}&tab=leasing`,
                        );
                      }}
                    >
                      <span>
                        <SVGSelector name={"i-info-svg"} />
                      </span>
                    </sup>
                  </h4>
                  <p className="text-[10px] text-[var(--white-shade)] max-xl:text-[7px]">
                    <span>{t("/vehicles.Leases/month")}</span>
                  </p>
                </div>
              ) : null}
              {leasingOptions &&
              leasingOptions?.[0]?.instalment &&
              financingOptions &&
              financingOptions?.[0]?.instalment ? (
                <hr className="h-11 w-[1px] bg-[var(--white-dark-shade)]" />
              ) : (
                ""
              )}
              {financingOptions && financingOptions?.[0]?.instalment ? (
                <div className="ps-4 max-xl:ps-2">
                  <h4 className="font-semibold  text-xl max-lg:text-[18px] max-xl:text-sm ">
                    {convertNumberFormat(
                      financingOptions?.[0]?.instalment,
                      currency,
                    )}
                    <sup
                      onClick={(evt) => {
                        evt.stopPropagation();
                        scrollToTopFunction();
                        evt.preventDefault();
                        navigate(
                          `?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}&tab=financing`,
                        );
                      }}
                    >
                      <span>
                        <SVGSelector name={"i-info-svg"} />
                      </span>
                    </sup>
                  </h4>
                  <p className="text-[10px] text-[var(--white-shade)] max-xl:text-[7px]">
                    <span>{t("/vehicles.Financing/month")}</span>
                  </p>
                </div>
              ) : null}
            </div>
            {wltpEnVkvText ? (
              <div
                className={`text-[var(--davy-gray-color)] mt-2 inline hyphens-auto ${getEdgeClass(edge)}`}
              >
                <span className="text-sm">{wltpEnVkvText}</span>
              </div>
            ) : null}
          </div>
          <div
            className={`p-2 flex-[230px] bg-[var(--white-light-smoke-color)] m-3 max-sm:flex-auto max-lg:hidden ${getEdgeClass(edge)}`}
          >
            {dateOfFirstRegistration && dateOfFirstRegistration?.date ? (
              <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                <span>
                  <SVGSelector name={"calender-svg"} />
                </span>
                <Tooltip text={dateOfFirstRegistration?.date}>
                  <p className="text-xs line-clamp-1">
                    {extractMonthAndYear(dateOfFirstRegistration?.date)}
                  </p>
                </Tooltip>
              </div>
            ) : null}
            <div className="flex items-center gap-[0.2rem] text-xs font-semibold mt-4">
              <span>
                <SVGSelector name={"speedometer-svg"} />
              </span>
              {/* Using toLocaleString directly please do not remove it  */}
              <Tooltip text={`${mileage?.toLocaleString(currency?.locale)} km`}>
                <p className="text-xs line-clamp-1">
                  {`${mileage?.toLocaleString(currency?.locale)} km`}
                </p>
              </Tooltip>
            </div>{" "}
            {kw || hp ? (
              <div className="flex items-center gap-[0.2rem] text-xs font-semibold mt-4">
                <span>
                  <SVGSelector name={"engine-warning-light-svg"} />
                </span>
                <Tooltip
                  text={
                    kw && hp ? `${kw} kW (${hp} ${t("/vehicles.HP")})` : null
                  }
                >
                  <p className="text-xs line-clamp-1">
                    {`${kw} kW ${hp ? `(${hp} ${t("/vehicles.HP")})` : ""}`}
                  </p>
                </Tooltip>{" "}
              </div>
            ) : null}{" "}
            {gearbox && gearbox.name ? (
              <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                <span>
                  <SVGSelector name={"gear-svg"} />
                </span>
                <Tooltip text={gearbox?.name && gearbox?.name}>
                  <p className="text-xs line-clamp-1 capitalize">
                    {gearbox?.name && gearbox?.name}
                  </p>
                </Tooltip>
              </div>
            ) : null}
            {paintColor && (
              <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                <span>
                  <SVGSelector
                    name={"color-display-svg"}
                    pathFill={
                      paintColoring?.name === t("/.Other")
                        ? ""
                        : getLinearGradientColorForEachItem(
                            capitalizeFirstLetter(paintColoring?.name),
                          )
                    }
                    className={
                      paintColoring?.name === t("/.Other")
                        ? "rounded-full bg-[conic-gradient(from_0deg,#FF0000,#FF7F00,#FFFF00,#00FF00,#00FFFF,#0000FF,#7F00FF,#FF00FF,#FF0000)]"
                        : ""
                    }
                  />
                </span>
                <Tooltip text={paintColor && paintColor}>
                  <p className="text-xs line-clamp-1 capitalize">
                    {paintColor && paintColor}
                  </p>
                </Tooltip>
              </div>
            )}
            {fuel && fuel?.name && (
              <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold mt-4">
                <SVGSelector name="fuel-pump-svg" />
                <Tooltip text={fuel?.name}>
                  <p className="text-xs line-clamp-1 capitalize">
                    {fuel?.name}
                  </p>
                </Tooltip>
              </div>
            )}
          </div>
        </li>
      </Link>
      {isFavoritesPage && features && features.includes("TestDrive") ? (
        <div
          className={`py-[10px] px-6 flex-auto relative max-lg:h-[53px] flex justify-center items-center max-lg:gap-y-1 ${getEdgeClass(edge, "rounded-md")} bg-[var(--primary-dark-color)] mt-5 group gap-[10px] text-center text-[var(--text-white-black)] max-md:mt-4`}
        >
          <button
            className="flex items-center gap-4 font-medium justify-center w-fit"
            onClick={handleTestDriveModalToggle}
          >
            <SVGSelector
              name={"test-drive-svg"}
              pathFill={"var(--text-white-black)"}
              svgHeight={26}
              svgWidth={26}
            />
            {t("/vehicleDetails.Test drive")}
          </button>
        </div>
      ) : null}
      <CustomModal
        isVisible={isTestDriveModalVisible}
        handleModalToggle={handleTestDriveModalToggle}
        modalHeader={t("/vehicleDetails.Test drive")}
        modalContent={
          <TestDriveModalForm
            vehicleDetails={cars}
            formikRef={testDriveFormikRef}
            handleModalToggle={handleTestDriveModalToggle}
            isTestDriveModalVisible={isTestDriveModalVisible}
          />
        }
      />
    </div>
  );
};

export default VehicleListCard;
