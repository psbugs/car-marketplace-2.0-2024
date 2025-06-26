import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  fetchUpdatedCarSummaryData,
  generateOptions,
  generateYearOptions,
  getEdgeClass,
  retrieveDropDownOption,
} from "../../../utils";
import { addCarSummaryData } from "../../../redux/CriteriaSlice";
import CommonDropDown from "../../common-components/CommonDropDown";
import { selectClass } from "../../../constants/common-constants";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../common-components/SVGSelector";

const VehicleFilterItem = (props) => {
  let { retrieveVehicleCounts, edge } = props;
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  // eslint-disable-next-line
  const { displaySealOfQuality = false, searchForm = false } =
    uiConfigData || {};
  const getCriteriaAllRes = useSelector(
    (state) => state?.criteria?.criteriaAll,
  );
  let bodieGroupsItems = getCriteriaAllRes?.bodyGroups;
  bodieGroupsItems = bodieGroupsItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "bodyGroups",
  }));
  let usageTypesItems = getCriteriaAllRes?.usageTypes;
  usageTypesItems = usageTypesItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "usageTypes",
  }));

  let dispatch = useDispatch();
  const { t } = useTranslation();
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  let valueRanges = uiConfigData?.valueRanges;
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const selectRef = useRef(null);
  let registrationYearsOptionsArray = generateYearOptions(10);
  let fromTranslatedValue = t("/.from");
  let untilTranslatedValue = t("/.until");
  const [minMileageVal, setMinMileageVal] = useState(
    searchParams?.get("mileageMin") || fromTranslatedValue,
  );
  const [maxMileageVal, setMaxMileageVal] = useState(
    searchParams?.get("mileageMax") || untilTranslatedValue,
  );
  const [fromRegYearVal, setFromRegYear] = useState(
    searchParams?.get("registerDateMin") || fromTranslatedValue,
  );
  const [toYearVal, setToYear] = useState(
    searchParams?.get("registerDateMax") || untilTranslatedValue,
  );

  const [isChecked, setIsChecked] = useState(
    searchParams?.get("qualityseal") === "true" || false,
  );

  useEffect(() => {
    setMinMileageVal(searchParams?.get("mileageMin") || fromTranslatedValue);
    setMaxMileageVal(searchParams?.get("mileageMax") || untilTranslatedValue);
    setFromRegYear(searchParams?.get("registerDateMin") || fromTranslatedValue);
    setToYear(searchParams?.get("registerDateMax") || untilTranslatedValue);
    setInputValue(searchParams?.get("offerId") || "");
    setIsChecked(searchParams?.get("qualityseal") === "true" || false);
  }, [searchParams, fromTranslatedValue, untilTranslatedValue]);

  const minMileagesOptions = generateOptions(
    retrieveDropDownOption("mileage", valueRanges?.mileages?.mins),
    fromTranslatedValue,
  );
  const maxMileagesOptions = generateOptions(
    retrieveDropDownOption("mileage", valueRanges?.mileages?.maxs),
    untilTranslatedValue,
  );

  const updateQueryParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    let apiParamsObj = {
      [key]: value,
      isPriceRateFilter: true,
    };
    retrieveVehicleCounts(undefined, apiParamsObj);
    setSearchParams(newParams);
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    const item = {
      label: t("/.Quality seal"),
      value: checked ? true : false,
      qualityseal: checked ? true : false,
    };

    if (checked) {
      dispatch(addCarSummaryData([...carSummaryData, item]));
    } else {
      const updatedCarSummaryData = carSummaryData?.filter(
        (data) => data.value !== item.value,
      );
      dispatch(addCarSummaryData(updatedCarSummaryData));
    }
    updateQueryParams("qualityseal", checked ? "true" : "");
  };

  const mileageHandleChange = async (mileageTypeVal, event) => {
    let mileageType = mileageTypeVal;
    let { value } = event.target;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    if (mileageTypeVal === "mileageMin") {
      setMinMileageVal(value);
    }
    if (mileageTypeVal === "mileageMax") {
      setMaxMileageVal(value);
    }
    if (mileageTypeVal === "registerDateMin") {
      setFromRegYear(value);
    }
    if (mileageTypeVal === "registerDateMax") {
      setToYear(value);
    }
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      value,
      mileageType,
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    const newParams = new URLSearchParams(searchParams?.toString());
    if (value !== "") {
      newParams.set(mileageType, value);
      setSearchParams(newParams);
      let apiParams = { value };
      retrieveVehicleCounts(mileageType, apiParams);
    } else {
      newParams.delete(mileageType);
      setSearchParams(newParams);
    }

    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  const handleInputChange = async (event) => {
    let newValue = event.target.value;
    let offerNoLabel = t("/.Offer number");
    const newItem = {
      label: `${offerNoLabel} ${newValue}`,
      value: newValue,
      offerId: newValue,
    };

    const filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith(offerNoLabel),
    );

    const updatedCarSummaryData =
      newValue.trim() === ""
        ? filteredCarSummaryData
        : [...filteredCarSummaryData, newItem];

    dispatch(addCarSummaryData(updatedCarSummaryData));

    setInputValue(newValue);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("offerId", newValue);
    if (newValue.trim() === "") {
      newParams.delete("offerId");
      setSearchParams(newParams);
    } else {
      newParams.set("offerId", newValue);
      setSearchParams(newParams);
      let params = {
        isOfferAllowed: true,
        offerId: newValue,
      };
      retrieveVehicleCounts(undefined, params);
    }
  };

  return (
    <>
      <div
        className="p-4"
        id="styled-profile"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {true && (
            <CommonDropDown
              labelName={t("/.Vehicle Type")}
              dropDownData={bodieGroupsItems}
              queryParamsName="bodyGroups"
              fetchCorrespondingItems={retrieveVehicleCounts}
              edge={edge}
            />
          )}
          {true && (
            <CommonDropDown
              labelName={t("/.Vehicle Type")}
              dropDownData={usageTypesItems}
              queryParamsName="usageTypes"
              fetchCorrespondingItems={retrieveVehicleCounts}
              edge={edge}
            />
          )}
          <div className="block">
            <label
              htmlFor=""
              className="block font-medium text-base mb-3 text-[var(--text-black-white)]"
            >
              {t("/.Mileages")}
            </label>
            <div className="flex gap-4">
              <div className="flex-auto">
                <select
                  className={selectClass(edge)}
                  id="min-mileages"
                  value={minMileageVal}
                  onChange={(event) => {
                    mileageHandleChange("mileageMin", event);
                  }}
                  required
                >
                  {minMileagesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-auto">
                <select
                  className={selectClass(edge)}
                  id="max-mileages"
                  value={maxMileageVal}
                  onChange={(event) => {
                    mileageHandleChange("mileageMax", event);
                  }}
                  required
                >
                  {maxMileagesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="block">
            <label
              htmlFor=""
              className="block font-medium text-base mb-3 text-[var(--text-black-white)]"
            >
              {t("/.Initial Registration")}
            </label>
            <div className="flex gap-4">
              <div className="flex-auto">
                <select
                  id="from-reg-year"
                  className={selectClass(edge)}
                  value={fromRegYearVal}
                  onChange={(event) => {
                    mileageHandleChange("registerDateMin", event);
                  }}
                  required
                >
                  {generateOptions(
                    registrationYearsOptionsArray,
                    fromTranslatedValue,
                  )?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-auto">
                <select
                  id="from-reg-year"
                  value={toYearVal}
                  className={selectClass(edge)}
                  onChange={(event) => {
                    mileageHandleChange("registerDateMax", event);
                  }}
                  required
                >
                  {generateOptions(
                    registrationYearsOptionsArray,
                    untilTranslatedValue,
                  )?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="block">
            <label
              htmlFor="offerId"
              className="block font-medium text-base mb-3 text-[var(--text-black-white)]"
            >
              {t("/.Offer Number")}
            </label>
            <div className="relative">
              <input
                id="offerId"
                type="text"
                className={`${getEdgeClass(edge)} border border-[var(--gray-color)] max-w-[350px] w-full bg-transparent placeholder:text-[var(--davy-gray-color)] text-sm font-medium py-3 px-4 pr-11 h-[48px] max-lg:max-w-full`}
                onChange={handleInputChange}
                value={inputValue}
                placeholder={t("/.Search by offer number")}
              />
              <span className="pointer-events-none absolute right-5 top-3.5">
                <SVGSelector name="magnifying-glass-svg" />
              </span>
            </div>
          </div>
          {displaySealOfQuality && (
            <div className="block">
              <div className="flex mt-12 max-md:mt-4">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className={`${getEdgeClass(edge, "rounded-3px")} w-5 h-5 text-xl text-[var(--text-black-white)] primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-white dark:border-[var(--gray-color)]`}
                />
                <label
                  htmlFor="default-checkbox"
                  className="ms-2 text-sm text-[var(--text-black-white)] font-medium"
                >
                  {t("/.Quality seal")}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleFilterItem;
