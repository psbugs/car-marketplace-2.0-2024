import React, { useState } from "react";
import {
  bodyGroupSVGSelector,
  extractAndFormatParams,
  keyGenerator,
  handleCheckboxChange,
  getEdgeClass,
  scrollToBottomFunction,
} from "../../utils";
import { useSearchParams } from "react-router-dom";
import { colorsForItsSubFilter } from "../../constants/common-constants";
import VehicleBrand from "./VehicleBrand";
import { useTranslation } from "react-i18next";
import Tooltip from "../../components/common-components/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import SVGSelector from "../../components/common-components/SVGSelector";
import SuperscriptScrollToBottom from "../../components/common-components/SuperscriptScrollToBottom";
import { setOpenFilterDrawer, setShowFilter } from "../../redux/VehiclesSlice";
import SearchInputField from "../../components/common-components/SearchInputField";
import DoubleDropdown from "../../components/DoubleDropdown";
import FilterDropdown from "../../components/FilterDropdown";
import ColorFilter from "../../components/FilterDropdown/ColorFilter";

const LeftFilterSection = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);
  const { t } = useTranslation();
  const {
    showFilter = false,
    openFilterDrawer = false,
    vehiclesRegistrationDates = false,
  } = useSelector((state) => state?.vehicles) || {};
  const { total = false } = vehiclesRegistrationDates || {};
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { valueRanges = false } = uiConfigData || {};
  const { criteriaAll = false } = useSelector((state) => state?.criteria);
  const {
    bodies = false,
    bodyGroups = false,
    drives = false,
    fuellings = false,
    options = false,
    transmissions = false,
    upholsteries = false,
    usageTypes = false,
    locations = false,
    emissionClasses = false,
  } = criteriaAll || {};

  const fixedManufacturers = criteriaAll?.manufacturers?.filter(
    (manufacturer) => {
      return uiConfigData?.searchForm?.fixedManufacturers?.length
        ? uiConfigData?.searchForm?.fixedManufacturers?.includes(
            Number(manufacturer?.value),
          )
        : manufacturer?.isActive;
    },
  );

  const existingfueling = extractAndFormatParams(newParams, "fuellings");
  const existingUsageTypes = extractAndFormatParams(newParams, "usageTypes");
  const existingBodies = extractAndFormatParams(newParams, "bodies");
  const existingDrives = extractAndFormatParams(newParams, "drives");
  const existingLocations = extractAndFormatParams(newParams, "locations");
  const existingOptions = extractAndFormatParams(newParams, "options");
  const existingPowerType = extractAndFormatParams(newParams, "powerType");
  const existingOfferId = extractAndFormatParams(newParams, "offerId");
  const existingPaintsColors = extractAndFormatParams(newParams, "paints");
  const existingBodyGroups = extractAndFormatParams(newParams, "bodyGroups");
  const existingVatdeductible = extractAndFormatParams(
    newParams,
    "vatdeductible",
  );
  const existingQualityseal = extractAndFormatParams(newParams, "qualityseal");
  const existingUpholsteries = extractAndFormatParams(
    newParams,
    "upholsteries",
  );
  const existingTransmissions = extractAndFormatParams(
    newParams,
    "transmissions",
  );
  const existingEmissionClasses = extractAndFormatParams(
    newParams,
    "emissionClasses",
  );
  const existingInteriorColors = extractAndFormatParams(
    newParams,
    "interiorColors",
  );
  const existingMetallicColors = extractAndFormatParams(newParams, "metallic");
  const existingPowerHpMin = extractAndFormatParams(newParams, "powerHpMin");
  const existingPowerHpMax = extractAndFormatParams(newParams, "powerHpMax");
  const existingPowerKwMin = extractAndFormatParams(newParams, "powerKwMin");
  const existingPowerKwMax = extractAndFormatParams(newParams, "powerKwMax");
  const accordionHandler = (evt) => {
    dispatch(setShowFilter(evt.target.value));
  };
  const [emissionClassSection, setEmissionClassSection] = useState(false);

  const toggleEmissionClassAccordion = () => {
    setEmissionClassSection(!emissionClassSection);
  };
  const electroEvents = {
    target: {
      value: "elektro",
      checked: existingfueling.some((element) => element === "elektro")
        ? false
        : true,
    },
  };
  const handleResetBtn = (param, clearAll = false) => {
    handleCheckboxChange(
      { target: { value: null, checked: false } },
      searchParams,
      clearAll ? "clearAll" : param,
      setSearchParams,
      { singleParam: true },
    );
    return;
  };
  let fromTranslatedValue = t("/.from");
  let untilTranslatedValue = t("/.until");
  const dispatch = useDispatch();
  const handleCheckboxForSummary = ({ evt, paramsName }) => {
    handleCheckboxChange(evt, searchParams, paramsName, setSearchParams);
  };

  // Offer number summary section
  const [searchInput, setSearchInput] = useState(existingOfferId);

  const openFilter = (evt) => {
    if (evt) {
      searchParams.set("filter-drawer", true);
      searchParams.set("show-vehicles-accordion", true);
      setSearchParams(searchParams, { replace: true }); // avoid adding to browser history
      dispatch(setOpenFilterDrawer(evt));
    } else {
      newParams.delete("filter-drawer");
      newParams.delete("show-vehicles-accordion");
      setSearchParams(newParams, { replace: true });
      dispatch(setOpenFilterDrawer(evt));
    }
  };

  return (
    <div
      id="left-filter-section"
      className={`overflow-x-hidden w-full max-w-[318px] bg-[var(--white-shade)] max-lg:bg-transparent max-lg:max-w-full ${getEdgeClass(edge)} `}
    >
      <div className="p-4 pb-0 max-lg:pb-4 max-lg:pt-0 max-lg:px-0 max-lg:flex max-lg:gap-4 max-md:p-2">
        <div
          className={`bg-[var(--whitesmoke-color)] max-md:p-0 py-2 px-[10px]  max-lg:flex max-lg:flex-auto max-lg:items-center  max-lg:py-0 ${getEdgeClass(edge)}`}
        >
          <div
            className={`from__email flex gap-1 ${
              edge && edge === "sharp" && "sharp-borders"
            }`}
          >
            {bodyGroups &&
              bodyGroups?.map((body, idx) => {
                const defaultChecked = existingBodyGroups?.includes(
                  body?.value,
                );
                return (
                  <div
                    className="select_blockBtn"
                    key={`${body?.label}-${idx}`}
                  >
                    <input
                      type="checkbox"
                      id={`vehicle-type-${body?.label}-checkbox`}
                      name={`checkbox-group-btn-${body?.label}`}
                      checked={defaultChecked}
                      value={body?.value}
                      onChange={(evt) =>
                        handleCheckboxForSummary({
                          evt,
                          paramsName: "bodyGroups",
                        })
                      }
                    />
                    <label htmlFor={`vehicle-type-${body?.label}-checkbox`}>
                      <Tooltip text={body?.label} spanClassName={"mt-3"}>
                        <div
                          className="select_blocks pointer-events-none"
                          htmlFor={`vehicle-type-${body?.label}-checkbox`}
                        >
                          {bodyGroupSVGSelector(body?.value, defaultChecked)}
                        </div>
                      </Tooltip>
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="max-lg:block hidden">
          <button
            className={`bg-[var(--white-shade)] border-[var(--white-mid-color)] p-4 border max-md:p-3 max-sm:h-[46px] max-sm:w-[46px] max-md:flex max-md:justify-center max-md:items-center ${getEdgeClass(edge)}`}
            onClick={() => openFilter(true)}
          >
            <SVGSelector name={"funnel-svg"} />
          </button>
        </div>
      </div>
      <div
        key={openFilterDrawer}
        className={
          openFilterDrawer
            ? "left-filter-toggle max-lg:block max-md:bg-[var(--white-dark-shade)] overflow-x-hidden"
            : "max-lg:hidden"
        }
      >
        <div className="hidden max-lg:block max-md:sticky max-md:top-0 max-md:z-10 max-md:bg-[var(--white-dark-shade)] ">
          <div className="flex justify-between items-center p-4">
            <div className="cursor-pointer" onClick={() => openFilter(false)}>
              <Tooltip text={"Close"}>
                <SVGSelector
                  name={"cross-svg"}
                  svgHeight={24}
                  svgWidth={24}
                  pathStroke={"var(--secondary-color)"}
                />
              </Tooltip>
            </div>
            <div
              className="cursor-pointer"
              onClick={(evt) => handleResetBtn(evt, true)}
            >
              <Tooltip text={"Clear all"}>
                <SVGSelector name={"trash-svg"} />
              </Tooltip>
            </div>
          </div>
        </div>
        <button
          onClick={() => openFilter(false)}
          className={`${openFilterDrawer ? "block" : "hidden"} bg-[var(--primary-dark-color)] fixed bottom-0 w-full z-10  text-[var(--text-white-black)] p-2`}
        >
          {t("/vehicles.Go to vehicles")} ({total})
        </button>
        <div className="my-5 px-4">
          <ul
            className={`flex flex-wrap bg-[var(--whitesmoke-color)] text-sm text-center ${getEdgeClass(edge)}`}
            role="tablist"
          >
            <li className=" w-2/4" role="presentation">
              <button
                className={`w-full p-2 flex items-center gap-2 border-gray-100 hover:border-[var(--gray-color)] text-[var(--white-color)] ${getEdgeClass(edge)} ${
                  existingfueling.includes("elektro")
                    ? "bg-[var(--primary-color-20-single)]"
                    : "bg-[var(--primary-dark-active-color)]"
                }`}
                id="default-checkbox-verbrenner"
                type="button"
                value="elektro"
                onClick={() => {
                  if (existingfueling.includes("elektro")) {
                    handleCheckboxChange(
                      electroEvents,
                      searchParams,
                      "fuellings",
                      setSearchParams,
                      { singleParam: true },
                    );
                  }
                }}
              >
                <span className="pointer-events-none">
                  <SVGSelector
                    key={
                      existingfueling || Math.random() * (100000 - 1 + 1) + 1
                    }
                    name={"vehicles-fuel-pump-circular-svg"}
                    pathFill={
                      existingfueling.includes("elektro")
                        ? "var(--primary-color-20-single)"
                        : "var(--primary-dark-active-color)"
                    }
                  />
                </span>
                {t("/vehicles.Burner")}
              </button>
            </li>
            <li className=" w-2/4" role="presentation">
              <button
                className={`w-full p-2 gap-3 flex items-center border-gray-100 hover:border-[var(--gray-color)] text-[var(--white-color)] ${getEdgeClass(edge)} ${
                  !existingfueling.includes("elektro")
                    ? "bg-[#95DCB2]"
                    : "bg-[#28B863]"
                }`}
                id="default-checkbox-elektro"
                type="button"
                value="elektro"
                onClick={() => {
                  if (!existingfueling.includes("elektro")) {
                    handleCheckboxChange(
                      electroEvents,
                      searchParams,
                      "fuellings",
                      setSearchParams,
                      { singleParam: true },
                    );
                  }
                }}
              >
                <span
                  className="pointer-events-none"
                  htmlFor="default-checkbox-elektro"
                >
                  <SVGSelector
                    key={
                      existingfueling || Math.random() * (100000 - 1 + 1) + 1
                    }
                    name={"vehicles-flash-svg"}
                    pathFill={
                      existingfueling.includes("elektro")
                        ? "#28B863"
                        : "#95DCB2"
                    }
                  />
                </span>
                {t("/vehicles.Electric")}
              </button>
            </li>
          </ul>
        </div>
        <div>
          <div>
            <div className="px-4 overflow-x-hidden">
              {fixedManufacturers?.length > 0 && (
                <div className="flex gap-2 items-center pt-4">
                  <SVGSelector name={"star-in-badge-svg"} />
                  <p className="font-semibold">
                    {t("/vehicles.Manufacturers")}
                  </p>
                </div>
              )}
              <VehicleBrand />
              <Divider className={"my-4"} />
              {bodies && (
                <FilterDropdown
                  uiKey={keyGenerator(existingBodies, bodies, "bodies")}
                  labelHeading={t("/vehicles.Vehicle Bodies")}
                  svgName={"car-icon-svg"}
                  filterable={bodies}
                  paramsName={"bodies"}
                  existingFilters={existingBodies}
                />
              )}
              <Divider className={"my-4"} />
              {usageTypes && (
                <FilterDropdown
                  uiKey={keyGenerator(
                    existingUsageTypes,
                    usageTypes,
                    "usageTypes",
                  )}
                  labelHeading={t("/vehicles.Vehicle Usage type")}
                  svgName={"star-in-badge-svg"}
                  filterable={
                    usageTypes &&
                    usageTypes?.filter((usageType) => usageType?.isActive)
                  }
                  paramsName={"usageTypes"}
                  existingFilters={existingUsageTypes}
                />
              )}
              <Divider className={"my-4"} />
              {fuellings && (
                <FilterDropdown
                  uiKey={keyGenerator(existingfueling, fuellings, "fuellings")}
                  labelHeading={t("/vehicles.Fuels")}
                  svgName={"star-in-badge-svg"}
                  filterable={
                    fuellings &&
                    fuellings?.filter(
                      (fuel) => fuel?.value !== "elektro" && fuel?.isActive,
                    )
                  }
                  paramsName={"fuellings"}
                  existingFilters={existingfueling}
                  ulClassName={
                    existingfueling?.includes("elektro")
                      ? "opacity-25"
                      : "opacity-100"
                  }
                  disabled={existingfueling.includes("elektro")}
                />
              )}
              <Divider className={"my-4"} />
              {valueRanges?.prices && (
                <div>
                  <DoubleDropdown
                    labelHeading={t("/vehicles.Price")}
                    primaryId={"priceMinimum"}
                    secondaryId={"priceMaximum"}
                    primaryParamName={"priceMin"}
                    secondaryParamName={"priceMax"}
                    initialOptValue={fromTranslatedValue}
                    finalOptValue={untilTranslatedValue}
                    values={valueRanges?.prices}
                    sectionParam={"price"}
                    svgName={"dollar-poker-chips-svg"}
                    sectionClassName={"max-w-md"}
                  />
                </div>
              )}
              <div className="flex mt-4">
                <div className="flex items-center">
                  <input
                    id="default-checkbox-vat"
                    type="checkbox"
                    name="vatdeductible"
                    value={true}
                    checked={
                      existingVatdeductible.includes("true") ? true : false
                    }
                    onChange={(evt) =>
                      handleCheckboxForSummary({
                        evt,
                        paramsName: "vatdeductible",
                      })
                    }
                    className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${getEdgeClass(edge, "rounded-[3px]")}`}
                  />
                  <label
                    htmlFor="default-checkbox-vat"
                    className="ms-2 text-sm text-[var(--secondary-color)] font-semibold"
                  >
                    {t("/vehicles.VAT Reportable")}
                  </label>
                  &nbsp;
                  <SuperscriptScrollToBottom
                    title={"i"}
                    onClick={() => scrollToBottomFunction("main-container")}
                    className={"max-lg:hidden"}
                  />
                </div>
              </div>
              {valueRanges?.financingRates && (
                <div>
                  <DoubleDropdown
                    labelHeading={t("/vehicles.Financing")}
                    primaryId={"financingRateMinimum"}
                    secondaryId={"financingRateMaximum"}
                    primaryParamName={"financingRateMin"}
                    secondaryParamName={"financingRateMax"}
                    initialOptValue={fromTranslatedValue}
                    finalOptValue={untilTranslatedValue}
                    values={valueRanges?.financingRates}
                    sectionParam={"finance"}
                    svgName={"dollar-poker-chips-svg"}
                    sectionClassName={"max-w-md"}
                  />
                </div>
              )}
              {valueRanges?.financingRates && (
                <div>
                  <DoubleDropdown
                    labelHeading={t("/vehicles.Leasing")}
                    primaryId={"leasingRateMinimum"}
                    secondaryId={"leasingRateMaximum"}
                    primaryParamName={"leasingRateMin"}
                    secondaryParamName={"leasingRateMax"}
                    initialOptValue={fromTranslatedValue}
                    finalOptValue={untilTranslatedValue}
                    values={valueRanges?.financingRates}
                    sectionParam={"leasing"}
                    svgName={"dollar-poker-chips-svg"}
                    sectionClassName={"max-w-md"}
                  />
                </div>
              )}
              <Divider className={"my-4"} />
            </div>
            <div className="block">
              <div id="accordion-collapse" data-accordion="collapse">
                <div className="block pb-4 border-b border-[var(--gray-color)]">
                  <h2 id="accordion-collapse-heading-vehicle">
                    <button
                      type="button"
                      className="flex items-center !bg-[var(--white-shade)] justify-between w-full px-4 font-medium  !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                      onClick={accordionHandler}
                      value="accordion-collapse-heading-vehicle"
                    >
                      <span className="flex items-center gap-2 pointer-events-none">
                        <span>
                          <SVGSelector name={"car-icon-svg"} />
                        </span>
                        {t("/vehicles.Vehicle")}
                      </span>
                      <SVGSelector name={"arrow-down-svg"} />
                    </button>
                  </h2>
                  <div
                    id="accordion-collapse-body-1"
                    className={
                      showFilter !== "accordion-collapse-heading-vehicle"
                        ? "hidden"
                        : ""
                    }
                  >
                    <div className="block p-4" key={existingUsageTypes}>
                      {valueRanges?.mileages && (
                        <div className="block">
                          <DoubleDropdown
                            sectionClassName={"my-4"}
                            labelHeading={t("/.Initial Registration")}
                            primaryId={"registerDateMinimum"}
                            secondaryId={"registerDateMaximum"}
                            primaryParamName={"registerDateMin"}
                            secondaryParamName={"registerDateMax"}
                            initialOptValue={fromTranslatedValue}
                            finalOptValue={untilTranslatedValue}
                            values={valueRanges?.mileages}
                            sectionParam={"registration"}
                          />
                        </div>
                      )}
                      {valueRanges?.mileages && (
                        <div className="block">
                          <DoubleDropdown
                            sectionClassName={"my-4"}
                            labelHeading={t("/.Mileages")}
                            primaryId={"mileageMinimum"}
                            secondaryId={"mileageMaximum"}
                            primaryParamName={"mileageMin"}
                            secondaryParamName={"mileageMax"}
                            initialOptValue={fromTranslatedValue}
                            finalOptValue={untilTranslatedValue}
                            values={valueRanges?.mileages}
                            sectionParam={"mileage"}
                          />
                        </div>
                      )}
                      <div className="block my-4">
                        <div
                          className="flex gap-2 items-center"
                          htmlFor="offerId"
                        >
                          <SVGSelector name={"cube-svg"} />
                          <p className="font-semibold">
                            {t("/vehicles.Offer Number")}
                          </p>
                        </div>
                        <div className="mt-4">
                          <SearchInputField
                            searchInput={searchInput}
                            wrapperClassName={"w-full"}
                            spanClassName={"pointer-events-none top-3 right-3"}
                            id={"offerId"}
                            paramName={"offerId"}
                            setSearchInput={setSearchInput}
                            labelPrefix={t("/vehicles.Offer Number")}
                            placeholder={t("/vehicles.Search by offer number")}
                            edgeClass={"rounded-md"}
                          />
                        </div>
                      </div>
                      <div className="flex mt-5">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="checkbox-qualityseal"
                            className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${getEdgeClass(edge, "rounded-[3px]")}`}
                            name="qualityseal"
                            value={true}
                            checked={
                              existingQualityseal.includes("true")
                                ? true
                                : false
                            }
                            onChange={(evt) =>
                              handleCheckboxForSummary({
                                evt,
                                paramsName: "qualityseal",
                              })
                            }
                          />
                          <label
                            htmlFor="checkbox-qualityseal"
                            className="ms-2 text-sm text-[var(--secondary-color)] font-semibold"
                          >
                            {t("/.Quality seal")}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="block py-4 border-b border-[var(--gray-color)]">
                  <h2 id="accordion-collapse-heading-drive">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 font-medium !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                      onClick={accordionHandler}
                      value="accordion-collapse-heading-drive"
                    >
                      <span className="pointer-events-none flex items-center gap-2">
                        <span>
                          <SVGSelector name={"car-icon-svg"} />
                        </span>
                        {t("/vehicles.Drive")}
                      </span>
                      <SVGSelector name={"arrow-down-svg"} />
                    </button>
                  </h2>
                  <div
                    id="accordion-collapse-body-drive"
                    className={
                      showFilter !== "accordion-collapse-heading-drive"
                        ? "hidden"
                        : ""
                    }
                    key={drives}
                  >
                    <div className="block p-4">
                      {drives && (
                        <FilterDropdown
                          uiKey={keyGenerator(existingDrives, drives, "drives")}
                          labelHeading={t("/vehicles.Drive")}
                          filterable={drives}
                          paramsName={"drives"}
                          existingFilters={existingDrives}
                        />
                      )}
                      <Divider />
                      {transmissions && (
                        <FilterDropdown
                          uiKey={keyGenerator(
                            existingTransmissions,
                            transmissions,
                            "transmissions",
                          )}
                          labelHeading={t("/vehicles.Gearbox")}
                          paramsName={"transmissions"}
                          filterable={transmissions}
                          existingFilters={existingTransmissions}
                        />
                      )}
                      <Divider />
                      <div className="block mt-6">
                        {valueRanges?.[
                          `power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}s`
                        ] && (
                          <div>
                            <DoubleDropdown
                              labelHeading={t("/.Performance")}
                              primaryId={`power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}Minimum`}
                              secondaryId={`power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}Maximum`}
                              primaryParamName={`power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}Min`}
                              secondaryParamName={`power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}Max`}
                              initialOptValue={fromTranslatedValue}
                              finalOptValue={untilTranslatedValue}
                              values={
                                valueRanges?.[
                                  `power${existingPowerType?.includes("hp") ? "Hp" : "Kw"}s`
                                ]
                              }
                              sectionParam={`power${existingPowerType?.includes("hp") ? "hp" : "kw"}s`}
                              sectionClassName={"max-w-md"}
                              summaryProp={
                                existingPowerType?.includes("hp") ? "Hp" : "Kw"
                              }
                            />
                          </div>
                        )}
                        <div
                          className="block mt-6"
                          key={
                            existingPowerType?.length ||
                            existingPowerKwMin?.length ||
                            existingPowerHpMin?.length ||
                            existingPowerKwMax?.length ||
                            existingPowerHpMax?.length ||
                            `random-${Math.floor(
                              Math.random() * (100000 - 1 + 1) + 1,
                            )}`
                          }
                        >
                          <div className="flex gap-4 my-5">
                            <div className="flex items-center flex-1">
                              <input
                                id="default-checkbox-PS"
                                type="checkbox"
                                value="hp"
                                defaultChecked={
                                  existingPowerType?.includes("hp")
                                    ? true
                                    : false
                                }
                                onClick={(evt) => {
                                  if (!existingPowerType?.includes("hp")) {
                                    handleCheckboxChange(
                                      evt,
                                      searchParams,
                                      "powerType",
                                      setSearchParams,
                                    );
                                  }
                                }}
                                className={`${
                                  existingPowerType?.includes("hp")
                                    ? "pointer-events-none"
                                    : ""
                                } ${
                                  edge && edge !== "sharp"
                                    ? "rounded-[3px]"
                                    : ""
                                } w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0`}
                              />
                              <label
                                htmlFor="default-checkbox-PS"
                                className={`${
                                  existingPowerType?.includes("hp")
                                    ? "pointer-events-none"
                                    : ""
                                } ms-2 text-sm text-[var(--secondary-color)] font-medium`}
                              >
                                {t("/vehicles.HP")}
                              </label>
                            </div>
                            <div className="flex items-center flex-1">
                              <input
                                id="default-checkbox-kW"
                                type="checkbox"
                                defaultChecked={
                                  !existingPowerType?.includes("hp")
                                    ? true
                                    : false
                                }
                                onClick={(evt) => {
                                  if (existingPowerType?.includes("hp")) {
                                    handleCheckboxChange(
                                      evt,
                                      searchParams,
                                      "powerType",
                                      setSearchParams,
                                    );
                                  }
                                }}
                                // do not remove the below value it's the actual value
                                //value="kW"
                                value="hp"
                                className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${
                                  !existingPowerType?.includes("hp")
                                    ? "pointer-events-none"
                                    : ""
                                } ${
                                  edge && edge !== "sharp"
                                    ? "rounded-[3px]"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor="default-checkbox-kW"
                                className={`${
                                  !existingPowerType?.includes("hp")
                                    ? "pointer-events-none"
                                    : ""
                                } ms-2 text-sm text-[var(--secondary-color)] font-medium`}
                              >
                                kW
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Divider />
                      <div className="block pt-4">
                        <h2 id="accordion-collapse-heading-emission">
                          <button
                            type="button"
                            className="flex items-center justify-between w-full !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)] gap-3"
                            onClick={toggleEmissionClassAccordion}
                          >
                            <span className="pointer-events-none flex items-center gap-2 text-sm text-[var(--davy-gray-color)] font-medium">
                              {t("/vehicles.Pollutant class")}
                            </span>
                            <SVGSelector
                              name={"arrow-down-svg"}
                              className="font-light !w-2 !h-2"
                              pathStroke="var(--davy-gray-color)"
                            />
                          </button>
                        </h2>

                        <div
                          className={emissionClassSection ? "block" : "hidden"}
                        >
                          {emissionClasses && (
                            <FilterDropdown
                              uiKey={keyGenerator(
                                existingEmissionClasses,
                                emissionClasses,
                                "emissionClasses",
                              )}
                              paramsName={"emissionClasses"}
                              filterable={emissionClasses}
                              existingFilters={existingEmissionClasses}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="block py-4 border-b border-[var(--gray-color)]">
                  <h2 id="accordion-collapse-heading-interior-color">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 font-medium !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                      onClick={accordionHandler}
                      value="accordion-collapse-heading-interior-color"
                    >
                      <span className="pointer-events-none flex items-center gap-2">
                        <span>
                          <SVGSelector name={"color-palette-svg"} />
                        </span>
                        {t("/vehicles.Interior Color")}
                      </span>
                      <SVGSelector name={"arrow-down-svg"} />
                    </button>
                  </h2>
                  <div
                    id="accordion-collapse-interior-color"
                    className={
                      showFilter !== "accordion-collapse-heading-interior-color"
                        ? "hidden"
                        : ""
                    }
                  >
                    {colorsForItsSubFilter && (
                      <ColorFilter
                        uiKey={keyGenerator(
                          existingInteriorColors,
                          colorsForItsSubFilter,
                          "interiorColors",
                        )}
                        summaryLabel={t("/.Interior Color")}
                        paramsName={"interiorColors"}
                        filterable={colorsForItsSubFilter}
                        existingFilters={existingInteriorColors}
                      />
                    )}
                    {upholsteries && (
                      <FilterDropdown
                        sectionClassName={"px-4 pt-4"}
                        uiKey={keyGenerator(
                          existingUpholsteries,
                          upholsteries,
                          "upholsteries",
                        )}
                        labelHeading={t("/vehicles.Pads")}
                        paramsName={"upholsteries"}
                        filterable={upholsteries}
                        existingFilters={existingUpholsteries}
                      />
                    )}
                  </div>
                </div>
                <div className="block py-4 border-b border-[var(--gray-color)]">
                  <h2 id="accordion-collapse-heading-exterior-color">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 font-medium !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                      onClick={accordionHandler}
                      value="accordion-collapse-heading-exterior-color"
                    >
                      <span className="pointer-events-none flex items-center gap-2">
                        <span>
                          <SVGSelector name={"color-palette-svg"} />
                        </span>
                        {t("/vehicles.Exterior Color")}
                      </span>
                      <SVGSelector name={"arrow-down-svg"} />
                    </button>
                  </h2>
                  <div
                    id="accordion-collapse-exterior-color"
                    className={
                      showFilter !== "accordion-collapse-heading-exterior-color"
                        ? "hidden"
                        : ""
                    }
                  >
                    {colorsForItsSubFilter && (
                      <ColorFilter
                        uiKey={keyGenerator(
                          existingPaintsColors,
                          colorsForItsSubFilter,
                          "paints",
                        )}
                        summaryLabel={t("/.Color")}
                        paramsName={"paints"}
                        filterable={colorsForItsSubFilter}
                        existingFilters={existingPaintsColors}
                        existingMetallic={existingMetallicColors}
                      />
                    )}
                  </div>
                </div>
                <div className="block py-4 border-b border-[var(--gray-color)]">
                  <h2 id="accordion-collapse-heading-equipment">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 font-medium !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                      onClick={accordionHandler}
                      value="accordion-collapse-heading-equipment"
                    >
                      <span className="flex items-center gap-2 pointer-events-none">
                        <span>
                          <SVGSelector name={"equipment"} />
                        </span>
                        {t("/vehicles.Equipments")}
                      </span>
                      <SVGSelector name={"arrow-down-svg"} />
                    </button>
                  </h2>
                  <div
                    id="accordion-collapse-body-equipment"
                    className={
                      showFilter !== "accordion-collapse-heading-equipment"
                        ? "hidden"
                        : ""
                    }
                  >
                    <div className="block p-4">
                      {options &&
                        options.map((option, idx) => (
                          <React.Fragment key={`${option?.label}-${idx}`}>
                            <p className="text-sm text-[var(--davy-gray-color)] font-medium my-2 mt-4">
                              {option?.label}
                            </p>
                            <ul className="grid grid-cols-1 gap-4 m-2">
                              {option?.options?.length > 0 &&
                                option?.options?.map(
                                  (equipmentOptions, idx) => (
                                    <li
                                      className="flex "
                                      key={`${equipmentOptions?.label}-${idx}`}
                                    >
                                      <input
                                        id={`default-checkbox-${equipmentOptions?.label}`}
                                        type="checkbox"
                                        value={equipmentOptions?.name}
                                        className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${
                                          edge && edge !== "sharp"
                                            ? "rounded-[3px]"
                                            : ""
                                        }`}
                                        checked={
                                          existingOptions?.includes(
                                            String(equipmentOptions?.name),
                                          )
                                            ? true
                                            : false
                                        }
                                        onChange={(evt) =>
                                          handleCheckboxForSummary({
                                            evt,
                                            paramsName: "options",
                                          })
                                        }
                                      />
                                      <label
                                        htmlFor={`default-checkbox-${equipmentOptions?.label}`}
                                        className="ms-2 text-sm text-[var(--davy-gray-color)] "
                                      >
                                        {equipmentOptions?.label}
                                      </label>
                                    </li>
                                  ),
                                )}
                            </ul>
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                </div>
                {locations?.length && locations?.length !== 1 && (
                  <div className="block py-4 border-[var(--gray-color)]">
                    <h2 id="accordion-collapse-heading-location">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full px-4 font-medium !bg-[var(--white-shade)] !text-[var(--secondary-color)] border-t-0 border-l-0 border-r-0 border border-b-0 border-gray-200 dark:!bg-[var(--white-shade)] dark:!text-[var(--secondary-color)]  gap-3"
                        onClick={accordionHandler}
                        value="accordion-collapse-heading-location"
                      >
                        <span className="flex items-center gap-2 pointer-events-none">
                          <span>
                            <SVGSelector name={"location-pin-svg"} />
                          </span>
                          {t("/vehicles.Location")}
                        </span>
                        <SVGSelector name={"arrow-down-svg"} />
                      </button>
                    </h2>
                    <div
                      id="accordion-collapse-body-location"
                      className={
                        showFilter !== "accordion-collapse-heading-location"
                          ? "hidden"
                          : ""
                      }
                    >
                      <div className="block p-4">
                        <ul className="grid grid-cols-1 gap-4">
                          {locations &&
                            locations?.map((location, idx) => (
                              <li
                                className="flex "
                                key={`${
                                  location?.value
                                }-${existingLocations?.includes(
                                  location?.value,
                                )}-${location?.index}`}
                                value={`${idx}-${location?.value}-${
                                  existingLocations?.includes(location?.value)
                                    ? 100
                                    : 99
                                }-${location?.index}`}
                              >
                                <input
                                  id={`default-checkbox-${location?.name}-${location?.value}-${location?.index}`?.trim()}
                                  type="checkbox"
                                  checked={
                                    existingLocations?.includes(location?.value)
                                      ? true
                                      : false
                                  }
                                  onChange={(evt) =>
                                    handleCheckboxForSummary({
                                      evt,
                                      paramsName: "locations",
                                    })
                                  }
                                  value={location?.value}
                                  className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${
                                    edge && edge !== "sharp"
                                      ? "rounded-[3px]"
                                      : ""
                                  }`}
                                />
                                <label
                                  htmlFor={`default-checkbox-${location?.name}-${location?.value}-${location?.index}`?.trim()}
                                  className="ms-2 text-sm text-[var(--davy-gray-color)] line-clamp-1"
                                >
                                  {`${location?.name || ""} ${
                                    location?.label || ""
                                  }`.trim()}
                                </label>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Divider = ({ className = "", hrClassName = "" }) => {
  return (
    <div className={className}>
      <hr className={`mx-[-16px] ${hrClassName}`} />
    </div>
  );
};

export default LeftFilterSection;
