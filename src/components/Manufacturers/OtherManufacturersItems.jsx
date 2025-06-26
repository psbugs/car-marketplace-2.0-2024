import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CommonDropDown from "../common-components/CommonDropDown";
import {
  criteriaModelGroups,
  criteriaModels,
  addCarSummaryData,
} from "../../redux/CriteriaSlice";
import { selectClass } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";

const OtherManufacturersItems = (props) => {
  let {
    manufacturers,
    isShowOtherFilters,
    edge,
    isShowManufacturer,
    modelGroups,
  } = props;
  let criteriaAllRes = useSelector((state) => state?.criteria?.criteriaAll);
  let allActiveManufacturers = criteriaAllRes?.manufacturers?.filter(
    (item) => item.isActive,
  );
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  let dispatch = useDispatch();
  const { t } = useTranslation();
  let manufactureIds = manufacturers?.map((item) =>
    item.manufactureId.toString(),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let mainOtherManufacturers = [
    {
      // default any option for dropdown
      isActive: true,
      label: "Any",
      value: "",
    },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [modalGroupsItems, setModalGroupsItems] = useState(modelGroups || []);
  const [manufactureItemVal, setManufactureItemVal] = useState("Any");
  const criteriaModalGRoupsData = useSelector(
    (state) => state.criteria.criteriaModelGroups,
  );
  if (manufactureIds?.length > 0) {
    for (let eachManu of allActiveManufacturers) {
      if (!manufactureIds.includes(eachManu.value)) {
        mainOtherManufacturers.push(eachManu);
      }
    }
  }

  useEffect(() => {
    if (modelGroups) {
      setModalGroupsItems(modelGroups);
    }
  }, [modelGroups]);

  useEffect(() => {
    setInputValue(searchParams?.get("modelExt") || "");

    const selectedValue = searchParams?.get("manufacturers") || "";
    const selectedManufacturer = mainOtherManufacturers?.find(
      (item) => item.value === selectedValue,
    );

    setManufactureItemVal(
      selectedManufacturer ? selectedManufacturer.value : "Any",
    );
  }, [searchParams, mainOtherManufacturers]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (typeof isShowManufacturer == "undefined") {
      dispatch(criteriaModelGroups({}))
        .unwrap()
        .then((response) => {
          if (response?.length > 0) {
            let modalGroupItems = response[0]?.items?.map((item) => ({
              ...item,
              category: "modelGroups",
            }));
            setModalGroupsItems(modalGroupItems);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // eslint-disable-next-line
  }, [isShowOtherFilters, dispatch]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    let modelAdditionLabel = t("/.Model addition");
    setInputValue(newValue);
    const newItem = {
      label: `${modelAdditionLabel} ${newValue}`,
      value: newValue,
      modelExt: newValue,
    };

    const filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith(modelAdditionLabel),
    );

    const updatedCarSummaryData =
      newValue.trim() === ""
        ? filteredCarSummaryData
        : [...filteredCarSummaryData, newItem];
    dispatch(addCarSummaryData(updatedCarSummaryData));

    const newParams = new URLSearchParams(searchParams?.toString());
    if (newValue.trim() === "") {
      newParams.delete("modelExt");
    } else {
      newParams.set("modelExt", newValue);
    }
    setSearchParams(newParams);
  };

  const otherManufactureHandleChange = (event) => {
    let { value } = event.target;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    let item = {
      value,
      label,
    };
    setManufactureItemVal(value);
    const newParams = new URLSearchParams(searchParams?.toString());
    if (value !== "") {
      newParams.set("manufacturers", value);
      updateDataToCarSummarySection(item);
      let items = criteriaModalGRoupsData?.filter(
        (item) => item.value === value,
      );
      if (items?.length > 0) {
        setModalGroupsItems(items[0]?.items);
      } else {
        let apiParams = {
          appendedUrl: `&manufacturers=${value}`,
        };
        dispatch(criteriaModels(apiParams))
          .unwrap()
          .then((res) => {
            let filteredResult =
              res?.length > 0 ? res?.filter((item) => item.isActive) : [];
            setModalGroupsItems(filteredResult);
          })
          .catch((err) => {
            console.error(err);
          });
      }
      setSearchParams(newParams);
    } else {
      newParams.delete("manufacturers");
      setSearchParams(newParams);
    }
  };

  const updateDataToCarSummarySection = (item) => {
    let defaultObj = { ...item };
    let manufacturerLabel = t("/.Manufacturer");
    if (Object.keys(defaultObj)?.length > 0 && defaultObj?.label) {
      defaultObj["label"] = `${manufacturerLabel} ${item?.label}`;
      defaultObj["manufacturers"] = item.value;
    }

    let finalCarSumDt = carSummaryData?.filter(
      (item) => !item.label.includes(manufacturerLabel),
    );
    let carSumData = [...finalCarSumDt, defaultObj];

    dispatch(addCarSummaryData(carSumData));
  };
  return (
    <>
      <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2 mt-4">
        {isShowOtherFilters && (
          <>
            {isShowManufacturer && (
              <div className="block">
                <label
                  htmlFor=""
                  className="block font-medium text-base text-[var(--text-black-white)] mb-3"
                >
                  {t("/.Manufacturer")}
                </label>
                <div className="flex gap-4">
                  <div className="flex-auto">
                    <select
                      value={manufactureItemVal}
                      className={selectClass(edge)}
                      id="other-manufacturer"
                      onChange={(event) => {
                        otherManufactureHandleChange(event);
                      }}
                      required
                    >
                      {mainOtherManufacturers?.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            {/* Drop down for model/Engines */}
            <CommonDropDown
              labelName={t("/.Model/Engine")}
              dropDownData={modalGroupsItems}
              queryParamsName="modelGroups"
            />
          </>
        )}
        <div>
          <label
            htmlFor=""
            className="block font-medium text-base text-[var(--text-black-white)] mb-3"
          >
            {t("/.Model")}
          </label>
          <input
            type="text"
            className="rounded max-w-[318px]  bg-[var(--white-dark-shade)]  w-full bg-transparent placeholder:text-[var(--gray-color)] border border-[var(--gray-color)] text-sm py-3 px-4 pr-11 h-[48px]"
            onChange={handleInputChange}
            value={inputValue}
          />
        </div>
      </div>
    </>
  );
};

export default OtherManufacturersItems;
