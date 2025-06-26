import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchUpdatedCarSummaryData,
  generateOptions,
  getEdgeClass,
  retrieveDropDownOption,
} from "../../../utils";
import { addCarSummaryData } from "../../../redux/CriteriaSlice";
import CommonDropDown from "../../common-components/CommonDropDown";
import { selectClass } from "../../../constants/common-constants";
import { useTranslation } from "react-i18next";

const DriveFilterItem = (props) => {
  let { retrieveVehicleCounts, edge } = props;
  const getUiConfigAllRes = useSelector((state) => state.uiConfig.uiConfigData);
  const getCriteriaAllRes = useSelector(
    (state) => state?.criteria?.criteriaAll,
  );
  const { t } = useTranslation();
  const carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  let drivesItems = getCriteriaAllRes?.drives;
  drivesItems = drivesItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "drives",
  }));
  let transmissionItems = getCriteriaAllRes?.transmissions;
  transmissionItems = transmissionItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "transmissions",
  }));
  let fuellingItems = getCriteriaAllRes?.fuellings;
  fuellingItems = fuellingItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "fuellings",
  }));
  let emissionClassesItems = getCriteriaAllRes?.emissionClasses;
  emissionClassesItems = emissionClassesItems?.map((eachBodyItem) => ({
    ...eachBodyItem,
    category: "emissionClasses",
  }));
  let DisplayEmissionClassFilter =
    getUiConfigAllRes?.searchForm?.DisplayEmissionClassFilter;
  const valueRanges = getUiConfigAllRes?.valueRanges;
  const [searchParams, setSearchParams] = useSearchParams();
  let isPowerTypeInQp = searchParams?.has("powerType") ? true : false;
  let powerTypeVal = searchParams?.get("powerType") ? "Hp" : "Kw";
  let fromTranslatedValue = t("/.from");
  let untilTranslatedValue = t("/.until");
  const [isPsChecked, setPsChecked] = useState(isPowerTypeInQp);
  const [isKwChecked, setKwChecked] = useState(!isPowerTypeInQp ? true : false);
  const [powerTypeName, setPowerTypeName] = useState(powerTypeVal);

  const [powerHpsVal, setPowerHpsVal] = useState(
    searchParams?.get(`power${powerTypeName}Min`) || fromTranslatedValue,
  ); //searchParams?.get(`power${powerTypeName}Min`) ||
  const [powerKwsVal, setPowerKwsVal] = useState(
    searchParams?.get(`power${powerTypeName}Max`) || untilTranslatedValue,
  ); //searchParams?.get(`power${powerTypeName}Max`) ||
  const dispatch = useDispatch();
  useEffect(() => {
    setPowerHpsVal(
      searchParams?.get(`power${powerTypeName}Min`) || fromTranslatedValue,
    );
    setPowerKwsVal(
      searchParams?.get(`power${powerTypeName}Max`) || untilTranslatedValue,
    );
    //eslint-disable-next-line
  }, [searchParams]);

  const powerOptionsMin = generateOptions(
    retrieveDropDownOption(
      powerTypeName === "Hp" ? "powerhps" : "powerkws",
      powerTypeName === "Hp"
        ? valueRanges?.powerHps?.mins
        : valueRanges?.powerKws?.mins,
    ),
    fromTranslatedValue,
  );
  const powerOptionsMax = generateOptions(
    retrieveDropDownOption(
      powerTypeName === "Hp" ? "powerhps" : "powerkws",
      powerTypeName === "Hp"
        ? valueRanges?.powerHps?.maxs
        : valueRanges?.powerKws?.maxs,
    ),
    untilTranslatedValue,
  );

  const checkBoxHandleChange = (event) => {
    const { name, checked, value } = event.target;
    if (name === "psCheckbox" && checked) {
      const newParams = new URLSearchParams(searchParams?.toString());
      newParams.set("powerType", "hp");
      setPsChecked(true);
      setKwChecked(false);
      changeQueryParams(value);
      newParams.delete("powerKwMin");
      newParams.delete("powerKwMax");
      setSearchParams(newParams);
    } else if (name === "kWCheckbox" && checked) {
      const newParams = new URLSearchParams(searchParams?.toString());
      newParams.delete("powerType");
      setPsChecked(false);
      setKwChecked(true);
      changeQueryParams(value);
      newParams.delete("powerHpMin");
      newParams.delete("powerHpMax");
      setSearchParams(newParams);
    }
  };

  const changeQueryParams = (value) => {
    setPowerTypeName(value);
    const newParams = new URLSearchParams(searchParams?.toString());
    if (value === "Hp") {
      newParams.set("powerType", value?.toLowerCase());
      setSearchParams(newParams);
    } else {
      newParams.delete("powerType");
      setSearchParams(newParams);
    }
  };

  const powerHpsHandleChange = (powerType, event) => {
    let powerItemVal = event.target.value;
    let index = event.nativeEvent.target.selectedIndex;
    let label = event.nativeEvent.target[index].text;
    if (powerType.includes("Hp")) {
      setPowerHpsVal(powerItemVal);
    } else {
      setPowerKwsVal(powerItemVal);
    }
    let getAllUpdatedCarSumArr = fetchUpdatedCarSummaryData(
      label,
      powerItemVal,
      powerType,
      carSummaryData,
      powerTypeName,
      t,
    );
    dispatch(addCarSummaryData(getAllUpdatedCarSumArr));
    const newParams = new URLSearchParams(searchParams?.toString());
    if (powerItemVal !== "") {
      let registerParams = {
        powerType,
        powerItem: {
          value: powerItemVal,
        },
      };
      newParams.set(powerType, powerItemVal);
      setSearchParams(newParams);
      retrieveVehicleCounts(undefined, registerParams);
    } else {
      newParams.delete(powerType);
      setSearchParams(newParams);
    }
  };

  return (
    <>
      <div
        className="p-4"
        id="styled-dashboard"
        role="tabpanel"
        aria-labelledby="dashboard-tab"
      >
        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {/* Drop down for drives filter */}
          <CommonDropDown
            labelName={t("/.Drive")}
            dropDownData={drivesItems}
            queryParamsName="drives"
            fetchCorrespondingItems={retrieveVehicleCounts}
            edge={edge}
          />
          {/* Drop down for transmissions filter */}
          <CommonDropDown
            labelName={t("/.Transmission")}
            dropDownData={transmissionItems}
            queryParamsName="transmissions"
            fetchCorrespondingItems={retrieveVehicleCounts}
            edge={edge}
          />
          {/* Drop down for fuellings filter */}
          <CommonDropDown
            labelName={t("/.Fuel")}
            dropDownData={fuellingItems}
            queryParamsName="fuellings"
            fetchCorrespondingItems={retrieveVehicleCounts}
            edge={edge}
          />
          <div className="block">
            <label
              htmlFor=""
              className="block font-medium text-base text-[var(--text-black-white)] mb-3"
            >
              {t("/.Performance")}
            </label>
            <div className="flex gap-4">
              <div className="flex-auto">
                <div>
                  <select
                    className={selectClass(edge)}
                    id="power-hps"
                    value={powerHpsVal}
                    onChange={(event) => {
                      powerHpsHandleChange(`power${powerTypeName}Min`, event);
                    }}
                    required
                  >
                    {powerOptionsMin?.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex  mt-3">
                  <input
                    id="default-checkbox-1"
                    type="checkbox"
                    name="psCheckbox"
                    checked={isPsChecked}
                    className={`w-5 h-5 text-xl primary-color ${getEdgeClass(edge, "rounded-3px")} focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-white dark:border-[var(--gray-color)]`}
                    onChange={checkBoxHandleChange}
                    value="Hp"
                  />
                  <label
                    htmlFor="default-checkbox-1"
                    className="ms-2 text-sm font-medium text-[var(--text-black-white)] "
                  >
                    PS
                  </label>
                </div>
              </div>
              <div className="flex-auto">
                <div>
                  <select
                    className={selectClass(edge)}
                    id="power-kws"
                    value={powerKwsVal}
                    onChange={(event) => {
                      powerHpsHandleChange(`power${powerTypeName}Max`, event);
                    }}
                    required
                  >
                    {powerOptionsMax?.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex  mt-3">
                  <input
                    id="default-checkbox-2"
                    type="checkbox"
                    name="kWCheckbox"
                    checked={isKwChecked}
                    className={`w-5 h-5 text-xl primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-white dark:border-[var(--gray-color)] ${getEdgeClass(edge, "rounded-3px")}`}
                    onChange={checkBoxHandleChange}
                    value="Kw"
                  />
                  <label
                    htmlFor="default-checkbox-2"
                    className="ms-2 text-sm font-medium text-[var(--text-black-white)]"
                  >
                    kW
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Drop down for emissionclass filter */}
          {DisplayEmissionClassFilter && (
            <CommonDropDown
              labelName={t("/.Emission Class")}
              dropDownData={emissionClassesItems}
              queryParamsName="emissionClasses"
              fetchCorrespondingItems={retrieveVehicleCounts}
              edge={edge}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DriveFilterItem;
