import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addCarSummaryData, criteriaAll } from "../../../redux/CriteriaSlice";
import { getEdgeClass, handleCheckboxChange } from "../../../utils";
import { useTranslation } from "react-i18next";

const LocationFilterItem = (props) => {
  const { edge } = props;
  const { criteriaAll: criteriaAllRes = [], loading: criteriaLoading = false } =
    useSelector((state) => state?.criteria) || {};
  const carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const dispatch = useDispatch();
  let locationsItems = criteriaAllRes?.locations || [];
  locationsItems = locationsItems?.map((locationItem, index) => ({
    ...locationItem,
    category: "locations",
  }));
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [checkedLocations, setCheckedLocations] = useState([]);

  useEffect(() => {
    // Initialize checked locations from search parameters
    const newParams = new URLSearchParams(searchParams);
    let existingLocations = [];
    if (newParams?.has("locations")) {
      existingLocations = newParams
        .get("locations")
        ?.split(",")
        ?.map((value) => value.replace(/"/g, ""));
    }
    setCheckedLocations(existingLocations);
  }, [dispatch, searchParams, criteriaAllRes]);

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  const onLocationHandleChange = (event, item) => {
    let { checked } = event?.target;
    let labelName = t("/.Location");
    updateCarSummaryDataForOneOrMoreCheckbox(
      labelName,
      carSummaryData,
      item,
      checked,
    );

    handleCheckboxChange(event, searchParams, "locations", setSearchParams);
  };

  const updateCarSummaryDataForOneOrMoreCheckbox = (
    labelName,
    carSummaryData,
    item,
    checked,
  ) => {
    let { value, name, label } = item;
    let updatedCheckedLocations = [...carSummaryData];
    let fieldToShowForSummary = label === ", " ? name : label;
    if (checked) {
      let obj = { ...item };
      obj["label"] = `${labelName} ${fieldToShowForSummary}`;
      obj[item?.category] = value;
      updatedCheckedLocations.push(obj);
    } else {
      updatedCheckedLocations = updatedCheckedLocations?.filter(
        (itemValue) => itemValue.value !== value,
      );
    }
    dispatch(addCarSummaryData(updatedCheckedLocations));
  };

  return (
    <div className="p-4 pt-0" id="styled-location" role="tabpanel">
      <ul className="grid grid-cols-4 gap-4 mt-8 max-md:grid-cols-1">
        {locationsItems?.map((eachLocationItem, locationItemIndex) => (
          <li className="flex" key={locationItemIndex || Math.random()}>
            <input
              id={`checkbox-${eachLocationItem.name}-${eachLocationItem.address1}-${eachLocationItem.town}-${eachLocationItem.zip}`}
              name={`checkbox-${eachLocationItem.name}`}
              type="checkbox"
              checked={checkedLocations.includes(eachLocationItem.value)}
              value={eachLocationItem.value}
              className={`${getEdgeClass(edge, "rounded-[3px]")} w-5 h-5 text-xl primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-[white] dark:border-gray-600`}
              onChange={(event) => {
                onLocationHandleChange(event, eachLocationItem);
              }}
            />
            <label
              htmlFor={`checkbox-${eachLocationItem.name}-${eachLocationItem.address1}-${eachLocationItem.town}-${eachLocationItem.zip}`}
              className="ms-2 text-sm text-[var(--davys-gray-color)] cursor-pointer"
            >
              {eachLocationItem.name} {eachLocationItem.address1}{" "}
              {eachLocationItem.town} {eachLocationItem.zip}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationFilterItem;
