import React, { useEffect, useState } from "react";
import { selectClass } from "../../constants/common-constants";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchUpdatedCarSummaryData,
  generateOptions,
  generateYearOptions,
  retrieveDropDownOption,
} from "../../utils";
import { addCarSummaryData } from "../../redux/CriteriaSlice";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";

const DoubleDropdown = ({
  sectionClassName,
  labelHeading,
  primaryId,
  secondaryId,
  primaryParamName,
  secondaryParamName,
  initialOptValue,
  finalOptValue,
  values,
  sectionParam,
  selectWrapperClass = "",
  svgName,
  summaryProp = null,
}) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const [primaryValue, setPrimaryValue] = useState(
    searchParams?.get(primaryParamName) || initialOptValue,
  );
  const [secondaryValue, setSecondaryValue] = useState(
    searchParams?.get(secondaryParamName) || finalOptValue,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const registrationYearsOptionsArray = generateYearOptions(10);
  const { uiConfigData } = useSelector((state) => state.uiConfig);
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  const isPricingIncluded = ["price", "finance", "leasing"].includes(
    sectionParam,
  );

  useEffect(() => {
    setPrimaryValue(searchParams?.get(primaryParamName) || initialOptValue);
    setSecondaryValue(searchParams?.get(secondaryParamName) || finalOptValue);
  }, [
    searchParams,
    initialOptValue,
    finalOptValue,
    primaryParamName,
    secondaryParamName,
  ]);

  const primaryOptions = generateOptions(
    isPricingIncluded
      ? values?.mins
      : sectionParam === "mileage" || sectionParam?.includes("power")
        ? retrieveDropDownOption(sectionParam, values?.mins)
        : registrationYearsOptionsArray,
    initialOptValue,
    isPricingIncluded ? currency : undefined,
  );
  const secondaryOptions = generateOptions(
    isPricingIncluded
      ? values?.maxs
      : sectionParam === "mileage" || sectionParam?.includes("power")
        ? retrieveDropDownOption(sectionParam, values?.maxs)
        : registrationYearsOptionsArray,
    finalOptValue,
    isPricingIncluded ? currency : undefined,
  );

  const updateQueryParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleDropdownChange = (event, setFunction, paramName) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setFunction(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      paramName,
      carSummaryData,
      summaryProp,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams(paramName, selectedValue);
  };

  return (
    <section className={`block ${sectionClassName}`}>
      {svgName && svgName ? (
        <div className="flex gap-2 items-center py-4">
          <SVGSelector name={svgName} />
          <p className="font-semibold">{labelHeading}</p>
        </div>
      ) : (
        <label
          htmlFor={labelHeading}
          className="block font-medium text-base mb-3 text-[var(--text-black-white)]"
        >
          {labelHeading}
        </label>
      )}
      <div className="flex gap-4">
        <div className={`flex-auto ${selectWrapperClass}`}>
          <select
            id={primaryId}
            className={selectClass(edge)}
            value={primaryValue}
            onChange={(event) =>
              handleDropdownChange(event, setPrimaryValue, primaryParamName)
            }
            required
          >
            {primaryOptions?.map((option, index) => (
              <option key={`${option?.value}-${index}`} value={option?.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={`flex-auto ${selectWrapperClass}`}>
          <select
            id={secondaryId}
            value={secondaryValue}
            className={selectClass(edge)}
            onChange={(event) =>
              handleDropdownChange(event, setSecondaryValue, secondaryParamName)
            }
            required
          >
            {secondaryOptions?.map((option, index) => (
              <option key={`${option?.value}-${index}`} value={option?.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default DoubleDropdown;
