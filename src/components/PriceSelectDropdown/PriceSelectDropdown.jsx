import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectClass } from "../../constants/common-constants";
import { addCarSummaryData } from "../../redux/CriteriaSlice";
import { fetchUpdatedCarSummaryData } from "../../utils";

const PriceSelectDropdown = ({
  t,
  edge,
  fromTranslatedValue,
  untilTranslatedValue,
  searchParams,
  generateOptions,
  valueRanges,
  updateQueryParams,
}) => {
  const dispatch = useDispatch();
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const [minPrice, setMinPrice] = useState(
    searchParams?.get("priceMin") || fromTranslatedValue,
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams?.get("priceMax") || untilTranslatedValue,
  );
  const minPricesOptions = generateOptions(
    valueRanges?.prices?.mins,
    fromTranslatedValue,
  );
  const maxPricesOptions = generateOptions(
    valueRanges?.prices?.maxs,
    untilTranslatedValue,
  );
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
  useEffect(() => {
    setMinPrice(searchParams?.get("priceMin") || fromTranslatedValue);
    setMaxPrice(searchParams?.get("priceMax") || untilTranslatedValue);
  }, [searchParams, fromTranslatedValue, untilTranslatedValue]);

  return (
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
  );
};
export default PriceSelectDropdown;
