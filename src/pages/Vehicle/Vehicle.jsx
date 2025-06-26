import React, { useEffect, useReducer, useState } from "react";
import VehicleGridCard from "./VehicleGridCard";
import VehicleListCard from "./VehicleListCard";
import LeftFilterSection from "./LeftFilterSection";
import { useDispatch, useSelector } from "react-redux";
import { addCarSummaryData, criteriaAll } from "../../redux/CriteriaSlice";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import { getAllVehiclesCountsUsingSpecificFilters } from "../../redux/VehiclesSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import CustomPagination from "../../components/common-components/CustomPagination";
import {
  convertNumberFormat,
  getEdgeClass,
  getLabel,
  handleCheckboxChange,
} from "../../utils";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Preloader from "../../components/Preloader";
import useExtractSearchParams from "../../hooks/useExtractSearchParams";
import Features from "../../components/Features";
import SaveSearchRequestForm from "../../components/SaveSearchRequestForm";
import { notAvailableImg } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import FilledButton from "../../components/common-components/FilledButton";
import SortVehiclesDropdown from "../../components/SortVehiclesDropdown/SortVehiclesDropdown";
import FiltersSummarySection from "../../components/FiltersSummarySection/FiltersSummarySection";
import FuelInformationSection from "../../components/FuelInformationSection/FuelInformationSection";
import SVGSelector from "../../components/common-components/SVGSelector";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const Vehicle = () => {
  const dispatch = useDispatch();
  const docTitle = useDocumentTitle();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    uiConfigData = false,
    theme = false,
    edge = false,
    loading: uiConfigLoading = false,
  } = useSelector((state) => state?.uiConfig) || {};
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };

  const {
    criteriaAll: criteriaAllRes = [],
    loading: criteriaLoading = false,
    manufacturersList = [],
  } = useSelector((state) => state?.criteria) || {};
  const { companyName = false } = theme || {};
  const [showSaveSearchRequest, setShowSaveSearchRequest] = useState(false);
  const {
    vehiclesRegistrationDates,
    loading,
    openFilterDrawer = false,
  } = useSelector((state) => state?.vehicles) || {};
  const { items = false, total = false } = vehiclesRegistrationDates || {};

  const getSearchedParams = useExtractSearchParams();
  // useEffect(() => {
  //   // change the title of a page using custom hook
  //   if (companyName) {
  //     docTitle(`Vehicle List | ${companyName}`);
  //   }
  // }, [companyName, docTitle]);
  const { skip = false, pageLayout = false } = getSearchedParams || {};

  const searchRequestHandleClick = () => {
    setShowSaveSearchRequest(!showSaveSearchRequest);
  };

  const [filters, dispatchFilters] = useReducer(
    (prevFilters, nextFilters) => ({ ...prevFilters, ...nextFilters }),
    {
      currentPage: skip ? skip / 10 + 1 : 1,
    },
  );
  const { currentPage } = filters;

  const onPageChange = (pageNo) => {
    handleCheckboxChange(
      { target: { value: pageNo * 10 - 10, checked: true } },
      searchParams,
      "skip",
      setSearchParams,
      { singleParam: true },
    );
    return dispatchFilters({ currentPage: pageNo });
  };

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  useEffect(() => {
    if (uiConfigData === false && !uiConfigLoading) {
      dispatch(uiConfigAll());
    }
  }, [uiConfigData, uiConfigLoading, dispatch]);

  useEffect(() => {
    if (searchParams) {
      getVehicleRegistrationDetails(undefined, getSearchedParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, uiConfigData]);

  const getVehicleRegistrationDetails = async (mileageType, mileageItem) => {
    let apiUrl = ``;
    let summaryArray = [];
    const {
      resultAppearance = false,
      // urls = false
    } = uiConfigData || {};
    const order = searchParams.get("order");
    const ordering = order?.split("-")[0];
    const orderDir = order?.split("-")[1];

    if (resultAppearance) {
      let {
        defaultPageSize = false,
        defaultOrdering = false,
        defaultOrderDir = false,
        defaultResultPageLayout = false,
      } = resultAppearance || {};

      const defaultParams = {
        take: defaultPageSize,
        orderby: ordering ? ordering : defaultOrdering,
        orderdir: orderDir ? orderDir : defaultOrderDir,
        pageLayout: defaultResultPageLayout,
      };
      const individualParams = [
        "isOfferAllowed",
        "isPriceRateFilter",
        "vatdeductible",
        "hasqualityseal",
        "metallic",
        "mileageMin",
        "mileageMax",
        "registermin",
        "registermax",
        "priceMin",
        "priceMax",
        "financingRateMin",
        "financingRateMax",
        "leasingRateMin",
        "leasingRateMax",
        "horsepowermin",
        "horsepowermax",
        "powermin",
        "powermax",
        "skip",
        "manufacturers",
        "modelExt",
        "othermanufacturers",
      ];

      const multipleParams = [
        "paints",
        "equipments",
        "locations",
        "bodies",
        "fuellings",
        "drives",
        "transmissions",
        "usageTypes",
        "emissionClasses",
        "options",
        "powerType",
        // "offerId",
        "number",
        "bodyGroups",
        "upholsteries",
        "interiorColors",
        "variants",
        "series",
        "manufacturersType",
        "modelGroups",
      ];

      individualParams.forEach((param) => {
        if (
          mileageItem[param] &&
          mileageItem[param] !== undefined &&
          mileageItem[param] !== null
        ) {
          if (param !== "othermanufacturers") {
            apiUrl += `&${param}=${encodeURIComponent(mileageItem[param])}`;
            summaryArray.push({ [param]: mileageItem[param] });
          } else {
            if (mileageItem.othermanufacturers === "true") {
              const manufacturerIds = manufacturersList
                ?.filter((m) => m.manufacturersId !== 9999999999)
                ?.map((m) => m.manufacturersId);

              const negatedManufacturers = manufacturerIds
                ?.map((id) => `manufacturers=-${encodeURIComponent(id)}`)
                ?.join("&");

              if (negatedManufacturers) {
                apiUrl += `&${negatedManufacturers}`;
              }
            }
          }
        }
      });
      if (
        Array.isArray(mileageItem?.bodyGroups) &&
        mileageItem?.bodyGroups?.length > 0
      ) {
        mileageItem.originalBodyGroups = true;
      }

      if (
        (!Array.isArray(mileageItem.bodyGroups) ||
          mileageItem.bodyGroups.length === 0) &&
        Array.isArray(mileageItem.manufacturersType) &&
        mileageItem.manufacturersType.length > 0
      ) {
        const type = mileageItem.manufacturersType[0];
        switch (type) {
          case "PKW":
            mileageItem.bodyGroups = [1];
            break;
          case "NFZ":
            mileageItem.bodyGroups = [2, 3];
            break;
          case "WOH":
            mileageItem.bodyGroups = [3];
            break;
          case "MOT":
            mileageItem.bodyGroups = [4];
            break;
          default:
            mileageItem.bodyGroups = false;
        }
      }
      if (
        Array.isArray(mileageItem?.bodyGroups) &&
        mileageItem?.bodyGroups?.length === 1 &&
        mileageItem?.manufacturersType?.[0] &&
        ((mileageItem?.bodyGroups?.[0] === "nfz" &&
          mileageItem?.manufacturersType?.[0] === "PKW") ||
          (mileageItem?.bodyGroups?.[0] === "pkw" &&
            mileageItem?.manufacturersType?.[0] === "NFZ")) &&
        mileageItem?.bodyGroups?.[0] !== mileageItem?.manufacturersType?.[0]
      ) {
        summaryArray = summaryArray?.filter((item) => !item?.bodyGroups);

        const originalBodyGroup = mileageItem?.bodyGroups?.[0];
        if (originalBodyGroup === "nfz") {
          summaryArray?.push({ bodyGroups: ["nfz"] });
        }
        if (originalBodyGroup === "pkw") {
          summaryArray?.push({ bodyGroups: ["pkw"] });
        }
        mileageItem.bodyGroups = [0];
        mileageItem.skipBodyGroupsInMultipleParams = true;
      }
      multipleParams.forEach((param) => {
        let updatedParam = param;
        if (param === "modelGroups") {
          updatedParam = "models";
        }
        if (
          mileageItem[param] &&
          Array.isArray(mileageItem[param]) &&
          mileageItem[param]?.length > 0
        ) {
          const paramStr = mileageItem[param]
            .map((val) => `${updatedParam}=${encodeURIComponent(val)}`)
            .join("&");
          apiUrl += `&${paramStr}`;
          const isBodyGroupsFromUser =
            param !== "bodyGroups" || mileageItem?.originalBodyGroups === true;

          if (
            isBodyGroupsFromUser &&
            !(
              param === "bodyGroups" &&
              mileageItem?.skipBodyGroupsInMultipleParams
            )
          ) {
            summaryArray.push({ [param]: mileageItem[param] });
          }
        }
      });
      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          apiUrl += `&${key}=${encodeURIComponent(value)}`;
        }
      });

      // left because this case is used elsewhere in codebase
      // if (mileageItem?.mileageType && ['mileageMax', 'mileageMin'].includes(mileageItem.mileageType)) {
      //   apiUrl += `&${mileageItem.mileageType}=${encodeURIComponent(mileageItem.value)}`;
      // }

      const transformedSummaryArray = summaryArray
        .reduce((acc, item) => {
          const [key, value] = Object.entries(item)[0]; // Extract key and value from the object
          let heading = `/.${key}`;
          if (key === "manufacturers") {
            const manufacturerName = getLabel(
              key,
              value,
              criteriaAllRes?.[key],
              currency,
              t,
            );

            let manufacturerTypeLabel = "";
            const type = mileageItem.manufacturersType?.[0];

            if (type === "PKW") {
              manufacturerTypeLabel = " PKW";
            } else if (type === "NFZ") {
              manufacturerTypeLabel = " Nutzfahrzeuge";
            }

            acc.push({
              label: `${t(`/.${key}`)}: ${manufacturerName}${manufacturerTypeLabel}`,
              value,
              category: key,
            });
          } else {
            if (Array.isArray(value)) {
              value.forEach((subValue) => {
                acc.push({
                  label: `${t(heading)}: ${getLabel(key, subValue, criteriaAllRes?.[key], currency, t)}`,
                  value: subValue,
                  category: key,
                });
              });
            } else {
              acc.push({
                label:
                  value === "true"
                    ? `${t(heading)}`
                    : `${t(heading)}: ${getLabel(key, value, criteriaAllRes?.[key], currency, t)}`,
                value,
                category: key,
              });
            }
          }
          return acc;
        }, [])
        ?.filter(
          (fill) =>
            fill?.category !== "powerType" &&
            fill?.category !== "manufacturersType" &&
            fill?.category !== "skip",
        );
      dispatch(getAllVehiclesCountsUsingSpecificFilters(apiUrl));
      dispatch(addCarSummaryData(transformedSummaryArray));
    }
  };

  const { search } = useLocation();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleResetBtn = (param, clearAll = false) => {
    handleCheckboxChange(
      { target: { value: null, checked: false } },
      searchParams,
      clearAll ? "clearAll" : param,
      setSearchParams,
      { singleParam: true },
    );
    dispatch(addCarSummaryData([]));
    return;
  };

  return (
    <div>
      {loading && <Preloader />}
      <Features />
      <main>
        <section>
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
            <div
              className="flex flex-wrap max-lg:flex-col"
              key={
                new URLSearchParams(searchParams)?.size === 1
                  ? new URLSearchParams(searchParams)?.size
                  : "default"
              }
            >
              <LeftFilterSection />
              <div
                className={`${
                  openFilterDrawer && "hidden"
                } w-full max-w-[calc(100%-318px)] pl-4 max-lg:max-w-full max-lg:p-4 max-md:p-2`}
              >
                <div className="flex justify-between items-center max-lg:flex-wrap">
                  <div className="flex gap-4 justify-between items-center  max-lg:items-center flex-wrap">
                    <div className="flex gap-4 items-center max-sm:justify-between max-sm:w-full">
                      <h2 className="text-xl font-semibold max-lg:text-lg max-sm:text-sm">
                        <div
                          onClick={
                            total === 0
                              ? () => searchRequestHandleClick(true)
                              : undefined
                          }
                          className="flex items-center gap-2"
                        >
                          <SVGSelector
                            name={"car-front-view-svg"}
                            pathFill={"var(--text-black-white)"}
                          />
                          <span className="max-lg:text-sm">
                            {convertNumberFormat(total) || 0}&nbsp;
                            {t("/vehicles.car")}
                            {total === 1 ? "" : "s"} {t("/vehicles.found")}
                          </span>
                        </div>
                      </h2>
                      <h2 className="text-2xl font-semibold max-lg:text-lg max-sm:text-sm">
                        <FilledButton
                          classnames={"!m-0 !px-2"}
                          title={t("/.Reset Search")}
                          edge={edge}
                          onClick={(evt) => handleResetBtn(evt, true)}
                          vehiclePage={true}
                        />
                      </h2>
                    </div>
                    <div className="max-sm:w-full">
                      <SortVehiclesDropdown />
                    </div>
                  </div>
                  <div className="flex gap-4 max-lg:gap-1">
                    <div>
                      <ul
                        className={`flex items-center max-lg:hidden bg-white border border-white ${getEdgeClass(edge)}`}
                        id="default-styled-tab"
                        key={pageLayout}
                      >
                        <li role="presentation">
                          <button
                            className={`flex ${getEdgeClass(edge)} w-[40px] justify-center items-center h-[40px] max-lg:h-[40px] max-lg:w-[40px] ${
                              pageLayout
                                ? "bg-[var(--primary-color-single)]"
                                : "bg-white"
                            }`}
                            id="profile-styled-tab"
                            type="button"
                            role="tab"
                            value="Gallery"
                            onClick={() => {
                              if (!pageLayout) {
                                handleCheckboxChange(
                                  {
                                    target: {
                                      value: "Gallery",
                                      checked: !pageLayout,
                                    },
                                  },
                                  searchParams,
                                  "pageLayout",
                                  setSearchParams,
                                );
                              }
                            }}
                          >
                            <SVGSelector
                              name={"list-grid-svg"}
                              pathFill={
                                pageLayout ? "white" : "var(--gray-color)"
                              }
                            />
                          </button>
                        </li>
                        <li role="presentation">
                          <button
                            className={`flex ${getEdgeClass(edge)} w-[40px] justify-center items-center h-[40px] max-lg:h-[40px] max-lg:w-[40px] ${
                              !pageLayout
                                ? "bg-[var(--primary-color-single)]"
                                : "bg-white"
                            }`}
                            id="dashboard-styled-tab"
                            type="button"
                            role="tab"
                            value="Gallery"
                            onClick={() => {
                              if (pageLayout) {
                                handleCheckboxChange(
                                  {
                                    target: {
                                      value: "Gallery",
                                      checked: !pageLayout,
                                    },
                                  },
                                  searchParams,
                                  "pageLayout",
                                  setSearchParams,
                                );
                              }
                            }}
                          >
                            <SVGSelector
                              name={"list-view-svg"}
                              pathStroke={
                                pageLayout ? "var(--gray-color)" : "white"
                              }
                            />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <FiltersSummarySection vehiclePage={true} />
                {total === 0 ? (
                  <div className="mt-6">
                    <div className="text-center bg-[var(--white-shade)] pb-6">
                      <img
                        src={notAvailableImg}
                        className="max-w-[500px] m-auto w-full"
                        alt=""
                      />
                      <h3 className="text-3xl font-medium">
                        {t("/vehicles.No Results Found")}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div id="default-styled-tab-content-1" key={pageLayout}>
                      {pageLayout ? (
                        <div id="vehicle-grid-view">
                          <ul className="grid grid-cols-3 gap-4 max-[1299px]:grid-cols-2 max-lg:grid-cols-1">
                            {items &&
                              items?.map((cars, idx) => (
                                <VehicleGridCard
                                  cars={cars}
                                  key={idx}
                                  idx={idx}
                                />
                              ))}
                          </ul>
                        </div>
                      ) : (
                        <div
                          className={getEdgeClass(edge)}
                          id="vehicle-list-view"
                        >
                          <ul className="grid grid-cols-1 space-y-6">
                            {items &&
                              items?.map((cars, idx) => (
                                <VehicleListCard
                                  cars={cars}
                                  idx={idx}
                                  key={cars?.id + search}
                                  loadedImage={loadedImages[cars?.id]}
                                  onImageLoad={handleImageLoad}
                                />
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {items && items?.length > 0 && (
                  <div className="my-6 flex overflow-x-auto justify-center">
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(total / 10)}
                      onPageChange={onPageChange}
                      edge={edge}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <FuelInformationSection />
        <ScrollToTopButton />
      </main>
      {showSaveSearchRequest && (
        <SaveSearchRequestForm
          closeSearchRequestPopupHandler={searchRequestHandleClick}
        />
      )}
    </div>
  );
};

export default Vehicle;
