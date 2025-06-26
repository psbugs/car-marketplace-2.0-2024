import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  addCarSummaryData,
  removeCarSummaryData,
} from "../../redux/CriteriaSlice";
import { useTranslation } from "react-i18next";
import SVGSelector from "./SVGSelector";
import { getEdgeClass } from "../../utils";

const CommonDropDown = (props) => {
  let {
    labelName,
    dropDownData,
    queryParamsName,
    fetchCorrespondingItems,
    edge,
  } = props;
  const adjustedLabelName = labelName === "Pad" ? "Upholstery" : labelName;

  const [selected, setSelected] = useState({});
  const { t } = useTranslation();
  const [dropName, setDropName] = useState(t("/.Please choose"));
  const [isOpen, setIsOpen] = useState(false);
  /*eslint-disable*/
  const [isAllSelected, setAllSelected] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const [updatedCarSumData, setUpdatedSumData] = useState([]);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // This useEffect is responsible to maintain the consistency outside the element the dropdown will be going to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSearchParamsEmpty = searchParams?.size === 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isSearchParamsEmpty) {
      // Reset state if search parameters are empty
      resetDropdown();
      return;
    }

    const values = searchParams.get(queryParamsName);
    if (values) {
      const cleanedValues = values.replace(/"/g, "").split(",");
      const initialSelection = {};
      cleanedValues.forEach((value) => {
        initialSelection[value] = true;
      });
      updateDropdownState(initialSelection, cleanedValues.length);
    } else {
      resetDropdown();
    }
  }, [searchParams, queryParamsName, dropDownData, t]);

  const resetDropdown = () => {
    setDropName(t("/.Please choose"));
    setSelected({});
    setAllSelected(false);
  };

  const updateDropdownState = (initialSelection, count) => {
    setSelected(initialSelection);
    setAllSelected(count === dropDownData.length);
    setDropName(
      count === dropDownData.length
        ? t("/.All")
        : `${count} ${t("/.Selected")}`,
    );
  };

  useEffect(() => {
    // When the user resets the filter, clear dropdown values
    if (isSearchParamsEmpty) {
      resetDropdown();
    }
  }, [isSearchParamsEmpty]);

  // const handleSelectAll = () => {
  //   const allChecked = dropDownData.every((item) => selected[item.value]);
  //   const newSelection = dropDownData.reduce((acc, item) => {
  //     acc[item.value] = !allChecked;
  //     return acc;
  //   }, {});
  //   setSelected(newSelection);
  //   setAllSelected(!allChecked);
  //   setDropName(!allChecked ? t("/.All") : t("/.Please choose"));
  //   setUpdatedSumData(dropDownData);
  //   updateQueryParams(newSelection, true);
  // };

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (item) => {
    let { label, value, category } = item;
    setSelected((prev) => {
      const isCurrentlyChecked = !!prev[value];
      const updatedSelected = {
        ...prev,
        [value]: !isCurrentlyChecked,
      };
      updateQueryParams(updatedSelected);
      const updatedArray = Object.entries(updatedSelected)
        ?.filter(([checked]) => checked)
        ?.map(([key]) => ({
          label: `${adjustedLabelName} ${
            dropDownData.find((item) => item.value === key)?.label
          }`,
          value: key,
          [queryParamsName]: key,
          category,
        }));
      const newSummaryData = [
        ...carSummaryData?.filter(
          (item) =>
            !updatedArray?.some(
              (updatedItem) => updatedItem.value === item.value,
            ),
        ),
        ...updatedArray,
      ];

      if (isCurrentlyChecked) {
        dispatch(removeCarSummaryData(`${adjustedLabelName} ${label}`));
      } else {
        dispatch(addCarSummaryData(newSummaryData));
      }

      setUpdatedSumData(newSummaryData);
      return updatedSelected;
    });
  };

  const updateQueryParams = (selection, isSelectAll) => {
    const selectedValues = Object.keys(selection)?.filter(
      (key) => selection[key],
    );
    if (isSelectAll)
      selectedValues?.length > 0
        ? updateDataToSummarySection()
        : removeDataFromSummarySection();
    const quotedArray = selectedValues?.map((item) => `${item}`).join(",");
    if (quotedArray?.length > 0) {
      searchParams?.set(queryParamsName, quotedArray);
    } else {
      searchParams?.delete(queryParamsName);
    }
    // Trigger API call
    let apiArgs = {
      isMultiSelectExists: true,
      [queryParamsName]: quotedArray,
    };
    if (queryParamsName !== "modelGroups") {
      triggerApiCall(apiArgs);
    }
    setSearchParams(searchParams);
  };

  const triggerApiCall = (apiArgs) => {
    fetchCorrespondingItems(undefined, apiArgs);
  };

  const updateDataToSummarySection = () => {
    const updatedData = dropDownData?.map((item) => ({
      ...item,
      label: `${adjustedLabelName} ${item.label}`,
      [queryParamsName]: `${item.value}`,
    }));
    const combinedData = [...carSummaryData, ...updatedData];
    const uniqueSummaryItems = Array.from(
      new Map(combinedData.map((item) => [item.value, item])).values(),
    );

    dispatch(addCarSummaryData(uniqueSummaryItems));
  };

  const removeDataFromSummarySection = () => {
    let previousSummaryItems = [...carSummaryData];
    let arr = updatedCarSumData?.map((item) => item.value);
    previousSummaryItems = previousSummaryItems?.filter(
      (item) => !arr.includes(item.value),
    );
    dispatch(addCarSummaryData(previousSummaryItems));
  };

  return (
    <div className="block" ref={dropdownRef}>
      <label
        htmlFor=""
        className="block font-medium text-base mb-3 text-[var(--text-black-white)]"
      >
        {adjustedLabelName}
      </label>
      <div className="block relative">
        <button
          id="dropdownVehicleTypeButton"
          onClick={toggleDropdown}
          className={`${getEdgeClass(edge, "rounded-md")} border border-[var(--gray-color)] bg-[var(--white-dark-shade)] justify-between p-3 text-[var(--davy-gray-color)] text-sm focus:outline-none font-medium px-3 py-3 h-[48px] w-full text-center inline-flex items-center`}
          type="button"
        >
          {dropName}
          <span className="ml-2">
            <SVGSelector name="arrow-down-svg" />
          </span>
        </button>

        <div
          id="dropdownVehicleType"
          className={`z-10 absolute ${
            isOpen ? "" : "hidden"
          } bg-[var(--white-color)] divide-y divide-[var(--gray-color)] ${getEdgeClass(edge)} shadow w-full`}
        >
          <ul
            className="text-sm p-4"
            aria-labelledby="dropdownVehicleTypeButton"
          >
            {/* <div>
              <div
                className={`bg-white text-center text-base block ${getEdgeClass(edge, "rounded-md")} py-[8px] w-full px-8 primary-color border max-md:text-sm max-md:px-4 hover:text-white hover-bg-primary-color`}
                onClick={handleSelectAll}
              >
                {t("/.All")}
              </div>
            </div> */}
            <div className="mt-4 overflow-y-auto max-h-96">
              <ul>
                {dropDownData?.length > 0 &&
                  dropDownData?.map((eachDropDownItem, dropDownIndex) => (
                    <li
                      key={dropDownIndex || Math.random()}
                      className="py-4 border-b border-[var(--gray-color)] cursor-pointer"
                    >
                      <div className="flex">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`dropdown-${eachDropDownItem.value}`}
                            checked={!!selected[eachDropDownItem.value]}
                            onChange={() =>
                              handleCheckboxChange(eachDropDownItem)
                            }
                            className={`w-5 h-5 text-xl primary-color ${getEdgeClass(edge, "rounded-[3px]")} focus:ring-0 dark:bg-white dark:border-gray-600`}
                          />
                          <label
                            htmlFor={`dropdown-${eachDropDownItem.value}`}
                            className="ms-2 text-sm font-medium text-[var(--secondary-color)]"
                          >
                            {eachDropDownItem.label}
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommonDropDown;
