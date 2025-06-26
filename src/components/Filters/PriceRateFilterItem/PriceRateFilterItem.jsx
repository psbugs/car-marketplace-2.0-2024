import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { addCarSummaryData } from "../../../redux/CriteriaSlice";
import { selectClass } from "../../../constants/common-constants";
import {
  convertNumberFormat,
  fetchUpdatedCarSummaryData,
  getEdgeClass,
} from "../../../utils";
import { useTranslation } from "react-i18next";

const PriceRateFilterItem = ({ retrieveVehicleCounts }) => {
  const { uiConfigData, edge } = useSelector((state) => state.uiConfig);
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const { searchForm, i18n, valueRanges } = uiConfigData || {};
  let DisplayFinancingFilter = searchForm?.DisplayFinancingFilter;
  let DisplayLeasingFilter = searchForm?.DisplayLeasingFilter;
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  let dispatch = useDispatch();
  const { t } = useTranslation();
  let fromTranslatedValue = t("/.from");
  let untilTranslatedValue = t("/.until");
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(
    searchParams?.get("priceMin") || fromTranslatedValue,
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams?.get("priceMax") || untilTranslatedValue,
  );

  const [minFinanceRate, setMinFinanceRate] = useState(
    searchParams?.get("financingRateMin") || fromTranslatedValue,
  );
  const [maxFinanceRate, setMaxFinanceRate] = useState(
    searchParams?.get("financingRateMax") || untilTranslatedValue,
  );

  const [minLeasingRate, setMinLeasingRate] = useState(
    searchParams?.get("leasingRateMin") || fromTranslatedValue,
  );
  const [maxLeasingRate, setMaxLeasingRate] = useState(
    searchParams?.get("leasingRateMax") || untilTranslatedValue,
  );

  const [isChecked, setIsChecked] = useState(
    searchParams?.get("vatdeductible") === "true",
  );
  useEffect(() => {
    setMinPrice(searchParams?.get("priceMin") || fromTranslatedValue);
    setMaxPrice(searchParams?.get("priceMax") || untilTranslatedValue);
    setMinFinanceRate(
      searchParams?.get("financingRateMin") || fromTranslatedValue,
    );
    setMaxFinanceRate(
      searchParams?.get("financingRateMax") || untilTranslatedValue,
    );
    setMinLeasingRate(
      searchParams?.get("leasingRateMin") || fromTranslatedValue,
    );
    setMaxLeasingRate(
      searchParams?.get("leasingRateMax") || untilTranslatedValue,
    );
    setIsChecked(searchParams?.get("vatdeductible") === "true" || false);
  }, [searchParams, fromTranslatedValue, untilTranslatedValue]);

  // Generate options for Select components
  const generateOptions = (priceArray, label) => [
    { label, value: "" },
    ...(priceArray || [])?.map((price) => ({
      label: convertNumberFormat(price, currency),
      value: price,
    })),
  ];

  const minPricesOptions = generateOptions(
    valueRanges?.prices?.mins,
    fromTranslatedValue,
  );
  const maxPricesOptions = generateOptions(
    valueRanges?.prices?.maxs,
    untilTranslatedValue,
  );

  const financingMinRatesOptions = generateOptions(
    valueRanges?.financingRates?.mins,
    fromTranslatedValue,
  );
  const financingMaxRatesOptions = generateOptions(
    valueRanges?.financingRates?.maxs,
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

  const handleMinPriceChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMinPrice(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "priceMin",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("priceMin", selectedValue);
  };

  const handleMaxPriceChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMaxPrice(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "priceMax",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("priceMax", selectedValue);
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    const item = {
      label: t("/.VAT Reportable"),
      value: checked ? true : false,
      vatdeductible: checked ? true : false,
    };

    if (checked) {
      dispatch(addCarSummaryData([...carSummaryData, item]));
    } else {
      const updatedCarSummaryData = carSummaryData?.filter(
        (data) => data.value !== item.value,
      );
      dispatch(addCarSummaryData(updatedCarSummaryData));
    }
    updateQueryParams("vatdeductible", checked ? "true" : "");
  };

  const handleMinFinancingChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMinFinanceRate(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "financingRateMin",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("financingRateMin", selectedValue);
  };

  const handleMaxFinancingChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMaxFinanceRate(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "financingRateMax",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("financingRateMax", selectedValue);
  };

  const handleMinLeasingChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMinFinanceRate(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "leasingRateMin",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("leasingRateMin", selectedValue);
  };

  const handleMaxLeasingChange = (event) => {
    const selectedValue = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    setMaxFinanceRate(selectedValue);
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      selectedValue,
      "leasingRateMax",
      carSummaryData,
      null,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    updateQueryParams("leasingRateMax", selectedValue);
  };

  return (
    <div className="p-4 pt-0" id="styled-pr" role="tabpanel">
      <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="block">
          <label className="block font-medium text-base mb-3 text-[var(--text-black-white)]">
            {t("/.Price")}
          </label>
          <div className="flex gap-4">
            <div className="max-w-md flex-auto">
              <select
                className={selectClass(edge)}
                id="min-prices"
                value={minPrice}
                onChange={handleMinPriceChange}
                required
              >
                {minPricesOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-w-md flex-auto">
              <select
                className={selectClass(edge)}
                id="max-prices"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                required
              >
                {maxPricesOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {DisplayFinancingFilter && (
          <div className="block">
            <label
              htmlFor=""
              className="block font-medium text-base text-[var(--text-black-white)] mb-3"
            >
              Financing
            </label>
            <div className="flex gap-4">
              <div className="max-w-md flex-auto">
                <select
                  id="min-financing-rates"
                  className={selectClass(edge)}
                  value={minFinanceRate}
                  onChange={handleMinFinancingChange}
                  required
                >
                  {financingMinRatesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-w-md flex-auto">
                <select
                  id="max-financing-rates"
                  className={selectClass(edge)}
                  value={maxFinanceRate}
                  onChange={handleMaxFinancingChange}
                  required
                >
                  {financingMaxRatesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {DisplayLeasingFilter && (
          <div className="block">
            <label
              htmlFor=""
              className="block font-medium text-base text-[var(--text-black-white)] mb-3"
            >
              leasing
            </label>
            <div className="flex gap-4">
              <div className="max-w-md flex-auto">
                <select
                  id="min-leasing-rates"
                  className={selectClass(edge)}
                  value={minLeasingRate}
                  onChange={handleMinLeasingChange}
                  required
                >
                  {financingMinRatesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-w-md flex-auto">
                <select
                  id="max-leasing-rates"
                  className={selectClass(edge)}
                  value={maxLeasingRate}
                  onChange={handleMaxLeasingChange}
                  required
                >
                  {financingMaxRatesOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="block">
          <div className="flex mt-12 max-md:mt-4">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className={`${getEdgeClass(edge, "rounded-[3px]")} w-5 h-5 text-xl primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-white dark:border-[var(--gray-color)]`}
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium text-[var(--text-black-white)]"
            >
              {t("/.VAT Reportable")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRateFilterItem;
