import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  addCarSummaryData,
  criteriaOptions,
} from "../../../redux/CriteriaSlice";
import { handleCheckboxChange } from "../../../utils";
import { useTranslation } from "react-i18next";

const EquipmentFilter = (props) => {
  let { edge } = props;
  let criteriaAllRes = useSelector((state) => state?.criteria?.criteriaAll);
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  let dispatch = useDispatch();
  const { t } = useTranslation();
  let finalEquipmentptions = criteriaAllRes?.options || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkedEquipments, setCheckedEquipments] = useState([]);

  useEffect(() => {
    dispatch(criteriaOptions());
    const newParams = new URLSearchParams(searchParams);
    let existingEquipments = [];
    if (newParams?.has("options")) {
      existingEquipments = newParams
        .get("options")
        ?.split(",")
        ?.map((value) => value.replace(/"/g, ""));
    }
    setCheckedEquipments(existingEquipments);
  }, [dispatch, searchParams]);

  const onEquipmentHandleChange = (event, item) => {
    let { checked } = event?.target;
    let labelName = t("/.Equipment");
    updateCarSummaryDataForOneOrMoreCheckbox(
      labelName,
      carSummaryData,
      item,
      checked,
    );
    handleCheckboxChange(event, searchParams, "options", setSearchParams);
  };

  const updateCarSummaryDataForOneOrMoreCheckbox = (
    labelName,
    carSummaryData,
    item,
    checked,
  ) => {
    let { value } = item;
    let updatedCheckedEquipments = [...carSummaryData];
    if (checked) {
      let obj = { ...item };
      obj["label"] = `${labelName} ${item?.label}`;
      obj[item?.category] = value;
      updatedCheckedEquipments.push(obj);
    } else {
      updatedCheckedEquipments = updatedCheckedEquipments?.filter(
        (itemValue) => itemValue.value !== value,
      );
    }
    dispatch(addCarSummaryData(updatedCheckedEquipments));
  };

  const generateUpdatedOptions = (optionsToUpdate) => {
    return optionsToUpdate?.map((option) => ({
      ...option,
      category: "options",
    }));
  };
  return (
    <div
      className="p-4 pt-0"
      id="styled-contacts"
      role="tabpanel"
      aria-labelledby="contacts-tab"
    >
      <div className="flex gap-4 flex-wrap">
        {finalEquipmentptions?.map((eachFinalQuipOption, index) => {
          let innerEquipOptions = generateUpdatedOptions(
            eachFinalQuipOption.options,
          );
          return (
            <div className="flex-auto" key={index || Math.random()}>
              <div className="block mt-4 mb-6">
                <p className="text-base  font-medium">
                  {eachFinalQuipOption.label}
                </p>
                <ul className="mt-4 space-y-3 ">
                  {innerEquipOptions?.map(
                    (eachInnerEquipOption, innerIndex) => {
                      return (
                        <li key={innerIndex || Math.random()}>
                          <div className="flex">
                            <div className="flex items-center ">
                              <input
                                id={`checkbox-${eachInnerEquipOption.label}`}
                                name={`checkbox-${eachInnerEquipOption.label}`}
                                type="checkbox"
                                checked={checkedEquipments.includes(
                                  eachInnerEquipOption.value.toString(),
                                )}
                                value={eachInnerEquipOption.value}
                                className={`w-5 h-5 text-xl primary-color ${
                                  edge && edge !== "sharp"
                                    ? "rounded-[3px]"
                                    : ""
                                } focus:ring-blue-500 dark:focus:ring-[var(--gray-color)]  focus:ring-0 dark:bg-white dark:border-[var(--gray-color)]`}
                                onChange={(event) =>
                                  onEquipmentHandleChange(
                                    event,
                                    eachInnerEquipOption,
                                    innerEquipOptions,
                                  )
                                }
                              />
                              <label
                                htmlFor={`checkbox-${eachInnerEquipOption.label}`}
                                className="ms-2 text-sm  text-[var(--davys-gray-color)] cursor-pointer"
                              >
                                {eachInnerEquipOption.label}
                              </label>
                            </div>
                          </div>
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentFilter;
