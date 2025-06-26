/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import VehicleFilterItem from "./VehicleFilterItem/VehicleFilterItem";
import DriveFilterItem from "./DriveFilterItem/DriveFilterItem";
import EquipmentFilter from "./EquipmentFilter/EquipmentFilter";
import LocationFilterItem from "./LocationFilterItem/LocationFilterItem";
import PriceRateFilterItem from "./PriceRateFilterItem/PriceRateFilterItem";
import { useDispatch, useSelector } from "react-redux";
// import { getAllVehiclesCountsUsingSpecificFilters } from "../../redux/VehiclesSlice";
import { useSearchParams } from "react-router-dom";
import ColorFilterItem from "./ColorFilterItem/ColorFilterItem";
import VehiclesSearchCount from "./VehicleSearchCount";
import { useTranslation } from "react-i18next";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import { criteriaAll } from "../../redux/CriteriaSlice";
import { getEdgeClass } from "../../utils";

const MainFilterSection = ({ redirectUrl, edge }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { uiConfigData = false, loading: uiConfigLoading = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { criteriaAll: criteriaAllRes = [], loading: criteriaLoading = false } =
    useSelector((state) => state?.criteria) || {};

  useEffect(() => {
    if (uiConfigData === false && !uiConfigLoading) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, uiConfigData, uiConfigLoading]);

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  const getUiConfigAllRes = useSelector(
    (state) => state?.uiConfig?.uiConfigData,
  );
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [searchParams] = useSearchParams();

  // Extract query parameters
  const getQueryParam = (key) =>
    searchParams
      .get(key)
      ?.split(",")
      .map((s) => s.replace(/"/g, "")) || [];

  const params = {
    manufacturers: getQueryParam("manufacturers"),
    modelGroups: getQueryParam("modelGroups"),
    variants: getQueryParam("variants"),
    bodies: getQueryParam("bodies"),
    modelExt: searchParams?.get("modelExt"),
    mileageMin: searchParams?.get("mileageMin"),
    mileageMax: searchParams?.get("mileageMax"),
    registerDateMin: searchParams.get("registerDateMin"),
    registerDateMax: searchParams.get("registerDateMax"),
    priceMin: searchParams.get("priceMin"),
    priceMax: searchParams.get("priceMax"),
    vatDeductible: searchParams.get("vatdeductible"),
    financingRateMin: searchParams.get("financingRateMin"),
    financingRateMax: searchParams.get("financingRateMax"),
    leasingRateMin: searchParams.get("leasingRateMin"),
    leasingRateMax: searchParams.get("leasingRateMax"),
    hasqualityseal: searchParams.get("qualityseal"),
    series: searchParams.get("series"),
    paints: getQueryParam("paints"),
    interiorColors: getQueryParam("interiorColors"),
    bodyGroups: getQueryParam("bodyGroups"),
    usageTypes: getQueryParam("usageTypes"),
    offerId: searchParams?.get("offerId") || null,
    drives: getQueryParam("drives"),
    transmissions: getQueryParam("transmissions"),
    fuellings: getQueryParam("fuellings"),
    emissionClasses: getQueryParam("emissionClasses"),
    upholsteries: getQueryParam("upholsteries"),
    options: getQueryParam("options"),
    locations: getQueryParam("locations"),
    horsepowermin: getQueryParam("powerHpMin"),
    horsepowermax: getQueryParam("powerHpMax"),
    powermin: getQueryParam("powerKwMin"),
    powermax: getQueryParam("powerKwMax"),
  };

  const [activeTabs, setActiveTab] = useState({
    isVehicle: true,
    isDrive: false,
    isColor: false,
    isEquipment: false,
    isLocation: false,
    isPriceRate: false,
  });

  const tabActivationHandler = (state) => {
    setActiveTab((prevActiveTab) => ({
      isVehicle: false,
      isDrive: false,
      isColor: false,
      isEquipment: false,
      isLocation: false,
      isPriceRate: false,
      [state]: true,
    }));
  };

  useEffect(() => {
    getVehicleCountsUsingVariousFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getVehicleCountsUsingVariousFilters = async () => {
    if (getUiConfigAllRes) {
      const { resultAppearance } = getUiConfigAllRes || {};
      const {
        defaultPageSize,
        defaultOrdering,
        defaultOrderDir,
        defaultResultPageLayout,
      } = resultAppearance || {};

      let apiUrl = new URLSearchParams({
        take: defaultPageSize,
        orderby: defaultOrdering,
        orderdir: defaultOrderDir,
        pageLayout: defaultResultPageLayout,
      });
      // Construct URL params for filters
      const filterParams = {
        models: params.modelGroups,
        manufacturers: params.manufacturers,
        bodies: params.bodies,
        modelExt: params.modelExt,
        mileageMin: params.mileageMin,
        mileageMax: params.mileageMax,
        registerDateMin: params.registerDateMin,
        registerDateMax: params.registerDateMax,
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        vatdeductible: params.vatDeductible,
        financingRateMin: params.financingRateMin,
        financingRateMax: params.financingRateMax,
        leasingRateMin: params.leasingRateMin,
        leasingRateMax: params.leasingRateMax,
        hasqualityseal: params.hasqualityseal,
        series: params.series,
        paints: params.paints,
        interiorColors: params.interiorColors,
        bodyGroups: params.bodyGroups,
        usageTypes: params.usageTypes,
        drives: params.drives,
        transmissions: params.transmissions,
        fuellings: params.fuellings,
        emissionClasses: params.emissionClasses,
        upholsteries: params.upholsteries,
        options: params.options,
        locations: params.locations,
        horsepowermin: params.horsepowermin,
        horsepowermax: params.horsepowermax,
        powermin: params.powermin,
        powermax: params.powermax,
        variants: params.variants,
        number: params.offerId,
      };

      // Iterate through filter parameters and append valid values
      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item) {
              apiUrl.append(key, item);
            }
          });
        } else if (value) {
          if (value) apiUrl.append(key, value);
        }
      });

      const url = apiUrl.toString();
      // try {
      //   const vehicleRegistrationRes = await dispatch(
      //     getAllVehiclesCountsUsingSpecificFilters(`&${url}`),
      //   ).unwrap();
      //   setTotalVehicles(vehicleRegistrationRes.total);
      // } catch (vehicleRegistrationErr) {
      //   console.error(vehicleRegistrationErr);
      // }
    }
  };

  return (
    <section>
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div
          className={`mt-8 max-md:mt-4 bg-[var(--white-dark-shade)] ${getEdgeClass(edge, "rounded-xl")}`}
        >
          <div className="mb-4 ">
            <ul
              className="flex flex-wrap gap-4 text-base font-normal text-center pt-2"
              role="tablist"
            >
              {Object.keys(activeTabs).map((tab) => {
                let displayValue;

                if (tab.includes("Color")) {
                  displayValue = t("/.Color/Upholstery");
                } else if (tab.includes("Price")) {
                  displayValue = t("/.Price/Rate");
                } else {
                  displayValue = tab.replace("is", "");
                  displayValue = t(`/.${displayValue}`);
                }

                return (
                  <li key={tab} className="me-2 flex-auto" role="presentation">
                    <button
                      className={`inline-block w-full p-4 border-[0px] border-b-[1px] border-solid ${
                        activeTabs[tab]
                          ? "border-[var(--primary-dark-color)] text-[var(--primary-dark-color)] border-b-[3px] font-semibold "
                          : "border-[var(--gray-color)]"
                      } w-full max-md:p-3`}
                      type="button"
                      role="tab"
                      aria-controls={tab}
                      aria-selected={activeTabs[tab]}
                      onClick={() => tabActivationHandler(tab)}
                    >
                      {displayValue}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div id="default-styled-tab-content">
            {activeTabs.isVehicle && (
              <VehicleFilterItem
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
                edge={edge}
              />
            )}
            {activeTabs.isDrive && (
              <DriveFilterItem
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
                edge={edge}
              />
            )}
            {activeTabs.isColor && (
              <ColorFilterItem
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
                edge={edge}
              />
            )}
            {activeTabs.isEquipment && (
              <EquipmentFilter
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
                edge={edge}
              />
            )}
            {activeTabs.isLocation && (
              <LocationFilterItem
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
                edge={edge}
              />
            )}
            {activeTabs.isPriceRate && (
              <PriceRateFilterItem
                retrieveVehicleCounts={getVehicleCountsUsingVariousFilters}
              />
            )}
            <VehiclesSearchCount
              totalVehicles={totalVehicles}
              edge={edge}
              unwrap
              redirectUrl={redirectUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFilterSection;
