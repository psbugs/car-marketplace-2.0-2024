import React, { useMemo, useState } from "react";
import {
  colorsForItsSubFilter,
  defaultImg,
  darkMode,
  priceValue,
  colorNameMap,
} from "../../constants/common-constants";
import {
  capitalizeFirstLetter,
  convertNumberFormat,
  extractMonthAndYear,
  getEdgeClass,
  scrollToTopFunction,
} from "../../utils";
import { useFavorites } from "../../hooks/useFavorites";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../../components/common-components/Tooltip";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../components/common-components/SVGSelector";
import { useCompares } from "../../hooks/useCompares";

const VehicleGridCard = ({ cars, idx }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isComparable, toggleComparison } = useCompares();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    wltpEnVkvText = false,
    leasingOptions = false,
    financingOptions = false,
    paintColoring = false,
    consumerPrice = false,
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
  const { i18n = false } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };

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
  const [loadedImages, setLoadedImages] = useState({});
  const handleImageLoad = (idx) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const skip = parseInt(queryParams.get("skip")) || 0;
  const index = skip ? parseInt(skip + idx) : idx;

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
    <Link
      className="w-full"
      to={`?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}`}
      onClick={(e) =>
        handleClick(
          `?view=vehicle-details&vehicle-id=${cars?.id}&index=${index}`,
          e,
        )
      }
    >
      {" "}
      <li
        className={`h-full bg-[var(--white-dark-shade)] relative ${getEdgeClass(edge)}`}
        key={idx}
      >
        <figure className="flex items-center justify-center">
          {!loadedImages[idx] && (
            <div
              className={`skeleton-item pt-3 h-[214px] max-lg:h-[500px] max-sm:h-[250px] w-[90%] m-auto bg-gray-300 animate-pulse ${getEdgeClass(edge)}`}
            ></div>
          )}
          <img
            className={`${getEdgeClass(edge)} max-lg:object-contain m-auto w-full px-3 pt-3 ${!loadedImages[idx] ? "opacity-0 absolute" : "opacity-1 static"}`}
            src={imageUrl}
            loading="lazy"
            alt={`${manufacturer && manufacturer?.resourceName} ${
              model && model?.name
            } ${modelExtension && modelExtension}`}
            onLoad={() => handleImageLoad(idx)}
          />
        </figure>
        <div className="rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div className="h-16 max-w-[250px] break-words max-md:h-auto">
              <Tooltip
                text={`${manufacturer && manufacturer?.resourceName} 
              ${model && model?.name} 
               ${modelExtension && modelExtension}`?.trim()}
              >
                <h4 className="text-base font-semibold text-[var(--secondary-color)] line-clamp-3 leading-5 word-break-break-word">
                  {`${manufacturer && manufacturer?.resourceName} 
              ${model && model?.name} 
               ${modelExtension && modelExtension}`?.trim()}
                </h4>
              </Tooltip>
            </div>
            {features &&
            (features.includes("Favorites") ||
              features.includes("Comparison")) ? (
              <div className="flex gap-1">
                {features.includes("Favorites") ? (
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
                {features.includes("Comparison") ? (
                  <div
                    className="cursor-pointer rounded-full px-2 py-2 bg-[var(--primary-color-20-single)] max-w-max"
                    onClick={(evt) => {
                      evt.preventDefault();
                      evt.stopPropagation();
                      toggleComparison(cars?.id);
                    }}
                  >
                    <SVGSelector
                      name="compare-svg"
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
          <div className="flex gap-2 items-center flex-wrap">
            {previousUsageType && previousUsageType?.name ? (
              <span
                className={`h-[48px] w-fit flex items-center justify-center border text-[0.7rem] text-[var(--text-black-white)] border-[var(--text-black-white)] p-1 px-[0.7rem]`}
              >
                {capitalizeFirstLetter(previousUsageType?.name)}
              </span>
            ) : null}
            {sealOfQualityImageUrl ? (
              <img
                src={sealOfQualityImageUrl}
                alt={sealOfQuality}
                className="h-[50px] max-w-[11rem]"
              />
            ) : null}
          </div>
          <div className="flex justify-between items-center mt-2 h-[2rem]">
            <Tooltip
              text={`${address1 ? address1 : ""} ${
                address2 ? `${address2} •` : ""
              }, ${zip ? zip : ""} ${town ? town : ""}`}
              className={"text-ellipsis break-words"}
            >
              <span className="text-[var(--davy-gray-color)] text-xs line-clamp-2 flex items-center ms-[-2px] gap-1">
                <SVGSelector name={"cards-location-pin-svg"} />
                {`${address1 ? address1 : ""} ${
                  address2 ? `${address2} •` : ""
                }, ${zip ? zip : ""}  ${town ? town : ""}`}
              </span>
            </Tooltip>
          </div>
          <div
            className={` bg-[var(--white-light-smoke-color)] p-2 mt-4 ${getEdgeClass(edge)}`}
          >
            <ul className="grid grid-cols-2 gap-2 max-[280px]:grid-cols-1 justify-start text-left">
              {dateOfFirstRegistration && dateOfFirstRegistration?.date ? (
                <li>
                  {" "}
                  <div className="flex items-center gap-[0.2rem] justify-start text-xs font-semibold">
                    <span>
                      <SVGSelector name={"calender-svg"} />
                    </span>
                    <Tooltip text={dateOfFirstRegistration?.date}>
                      <p className="text-xs line-clamp-1">
                        {extractMonthAndYear(dateOfFirstRegistration?.date)}
                      </p>
                    </Tooltip>
                  </div>{" "}
                </li>
              ) : null}
              <li>
                <div className="flex items-center gap-[0.2rem] text-xs font-semibold ">
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
                </div>
              </li>
              {kw || hp ? (
                <li>
                  {" "}
                  <div className="flex items-center gap-[0.2rem] text-xs font-semibold ">
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
                </li>
              ) : null}
              {gearbox && gearbox.name ? (
                <li>
                  {" "}
                  <div className="break-words max-md:h-auto flex items-center gap-[0.2rem] justify-start text-xs font-semibold">
                    <span>
                      <SVGSelector name={"gear-svg"} />
                    </span>
                    <Tooltip
                      text={gearbox?.name && gearbox?.name}
                      className={"text-ellipsis break-all"}
                    >
                      <p className="text-xs line-clamp-1 capitalize">
                        {gearbox?.name && gearbox?.name}
                      </p>
                    </Tooltip>
                  </div>
                </li>
              ) : null}
              {paintColor ? (
                <li>
                  {" "}
                  <div className="break-words max-md:h-auto flex items-center gap-[0.2rem] justify-start text-xs font-semibold">
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
                    <Tooltip
                      text={paintColor}
                      className={"text-ellipsis break-all"}
                    >
                      <p className="text-xs line-clamp-1 capitalize">
                        {paintColor}
                      </p>
                    </Tooltip>
                  </div>
                </li>
              ) : null}
              {fuel && fuel?.name ? (
                <li>
                  {" "}
                  <div className="break-words max-md:h-auto flex items-center gap-[0.2rem] justify-start text-xs font-semibold">
                    <SVGSelector name="fuel-pump-svg" />
                    <Tooltip
                      text={fuel && fuel?.name}
                      className={"text-ellipsis break-all"}
                    >
                      <p className="text-xs line-clamp-1 capitalize">
                        {fuel && fuel?.name}
                      </p>
                    </Tooltip>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="mt-4 mb-16 max-lg:mb-16">
            <p className="text-[var(--white-light-gray-color)] text-xs leading-5">
              {wltpEnVkvText ? (
                <span
                  className={`text-[var(--davy-gray-color)] mt-2 inline hyphens-auto ${getEdgeClass(edge)}`}
                >
                  <span className="text-sm">{wltpEnVkvText}</span>
                </span>
              ) : null}
            </p>
          </div>
          <div
            className={`ms-[-3px] flex gap-[0.15rem] justify-evenly flex-wrap bg-[var(--primary-dark-color)] text-[var(--text-white-black)] px-[3px] py-2 absolute bottom-0 w-[95%] max-lg:w-[95%] max-sm:w-[92%]  my-4 max-sm:my-0 min-h-[3rem] ${getEdgeClass(edge)}`}
          >
            <div>
              <h4 className="font-semibold text-md">
                {priceDetails && priceDetails?.totalPrice
                  ? convertNumberFormat(priceDetails?.totalPrice, currency)
                  : ""}
              </h4>
              {priceDetails && priceDetails?.vatDeductible ? (
                <p className="text-[8px]">
                  <span>{t("/vehicles.VAT Reportable")}</span>
                </p>
              ) : null}
            </div>
            {(leasingOptions && leasingOptions?.[0]?.instalment) ||
            (financingOptions && financingOptions?.[0]?.instalment) ? (
              <hr className="h-10 w-[1px] bg-[var(--white-dark-shade)]" />
            ) : (
              ""
            )}
            {leasingOptions && leasingOptions?.[0]?.instalment ? (
              <div className="ps-1">
                <h4 className="font-semibold text-md">
                  {convertNumberFormat(
                    leasingOptions?.[0]?.instalment,
                    currency,
                  )}
                  <sup
                    onClick={(evt) => {
                      evt.preventDefault();
                      evt.stopPropagation();
                      scrollToTopFunction();
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
                <p className="text-[8px]">
                  <span>{t("/vehicles.Leases/month")}</span>
                </p>
              </div>
            ) : null}
            {leasingOptions &&
            leasingOptions?.[0]?.instalment &&
            financingOptions &&
            financingOptions?.[0]?.instalment ? (
              <hr className="h-10 w-[1px] bg-[var(--white-dark-shade)]" />
            ) : (
              ""
            )}
            {financingOptions && financingOptions?.[0]?.instalment ? (
              <div className="ps-1">
                <h4 className="font-semibold text-md">
                  {convertNumberFormat(
                    financingOptions?.[0]?.instalment,
                    currency,
                  )}
                  <sup
                    onClick={(evt) => {
                      evt.preventDefault();
                      evt.stopPropagation();
                      scrollToTopFunction();
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
                <p className="text-[8px]">
                  <span>{t("/vehicles.Financing/month")}</span>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </li>
    </Link>
  );
};

export default VehicleGridCard;
