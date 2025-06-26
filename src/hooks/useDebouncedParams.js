import { useCallback } from "react";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addCarSummaryData } from "../redux/CriteriaSlice";

const useDebouncedSearchParams = (debounceDelay = 800) => {
  let [searchParams, setSearchParams] = useSearchParams();
  let { carSummaryData = false } =
    useSelector((state) => state?.criteria) || {};
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateParams = useCallback(
    debounce((key, value) => {
      const newParams = new URLSearchParams(searchParams?.toString());
      if (value.trim() === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams);
    }, debounceDelay),
    [searchParams, setSearchParams, debounceDelay],
  );

  const handleChangeWithDebounce = ({ key, value, labelPrefix }) => {
    const newItem = {
      label: `${labelPrefix}: ${value}`,
      value: value,
      modelExtensionName: value,
    };
    const filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item?.label?.startsWith(labelPrefix),
    );
    const updatedCarSummaryData =
      value.trim() === ""
        ? filteredCarSummaryData
        : [...filteredCarSummaryData, newItem];
    dispatch(addCarSummaryData(updatedCarSummaryData));
    debouncedUpdateParams(key, value);
  };

  return handleChangeWithDebounce;
};

export default useDebouncedSearchParams;
