import { useDispatch, useSelector } from "react-redux";
import {
  addCarSummaryData,
  removeCarSummaryData,
} from "../../redux/CriteriaSlice";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import SaveSearchRequestForm from "../SaveSearchRequestForm/SaveSearchRequestForm";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";

const FiltersSummarySection = (props) => {
  let { isHideSearchRequestBtn, callFromSaveSearchRequestForm, vehiclePage } =
    props;
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  let { carSummaryData = false } = useSelector((state) => state.criteria) || {};
  const totalCount = useSelector(
    (state) => state.vehicles.vehicleItemsFromCountsData,
  );
  let dispatch = useDispatch();
  const { t } = useTranslation();
  let [searchParams, setSearchParams] = useSearchParams();
  const [isShowSearchReqPopup, setSearchRequestPopup] = useState(false);

  const getQueryParams = () => {
    const paramsObject = {};
    // Iterate over all the entries in searchParams
    for (let [key, value] of searchParams?.entries()) {
      value = value.replaceAll('"', "");
      value = value.includes(",") ? value?.split(",") : value;
      if (paramsObject[key]) {
        if (Array.isArray(paramsObject[key])) {
          paramsObject[key].push(value);
        } else {
          paramsObject[key] = [paramsObject[key], value];
        }
      } else {
        paramsObject[key] = value;
      }
    }

    return paramsObject;
  };

  const queryParams = getQueryParams();

  const params = {};
  for (const [key, value] of new URLSearchParams(
    window.location.search,
  ).entries()) {
    params[key] = value;
  }

  // useEffect(() => {
  //   // Function to clean up and trim each element in the array
  //   const cleanParams = (param) =>
  //     param?.split(",").map((str) => str.trim().replace(/^"|"$/g, "")) || [];
  //   // Initialize and clean the params variables
  //   const paramsMapping = {
  //     manufacturers: cleanParams(params?.manufacturers),
  //     bodies: cleanParams(params?.bodies),
  //     series: cleanParams(params?.series),
  //     variants: cleanParams(params?.variants),
  //     modelGroups: cleanParams(params?.modelGroups),
  //     bodyGroups: cleanParams(params?.bodyGroups),
  //     usageTypes: cleanParams(params?.usageTypes),
  //     mileageMin: cleanParams(params?.mileageMin),
  //     mileageMax: cleanParams(params?.mileageMax),
  //     registerDateMin: cleanParams(params?.registerDateMin),
  //     registerDateMax: cleanParams(params?.registerDateMax),
  //     drives: cleanParams(params?.drives),
  //     transmissions: cleanParams(params?.transmissions),
  //     fuellings: cleanParams(params?.fuellings),
  //     emissionClasses: cleanParams(params?.emissionClasses),
  //     powerKwMin: cleanParams(params?.powerKwMin),
  //     powerKwMax: cleanParams(params?.powerKwMax),
  //     options: cleanParams(params?.options),
  //     locations: cleanParams(params?.locations),
  //     priceMin: cleanParams(params?.priceMin),
  //     priceMax: cleanParams(params?.priceMax),
  //     paints: cleanParams(params?.paints),
  //     interiorColors: cleanParams(params?.interiorColors),
  //     upholsteries: cleanParams(params?.upholsteries),
  //     modelExt: cleanParams(params?.modelExt),
  //     financingRateMin: cleanParams(params?.financingRateMin),
  //     financingRateMax: cleanParams(params?.financingRateMax),
  //     leasingRateMin: cleanParams(params?.leasingRateMin),
  //     leasingRateMax: cleanParams(params?.leasingRateMax),
  //     vatdeductible: cleanParams(params?.vatdeductible),
  //     metallic: cleanParams(params?.metallic),
  //     othermanufacturers: cleanParams(params?.othermanufacturers),
  //     qualityseal: cleanParams(params?.qualityseal),
  //     offerId: cleanParams(params?.offerId),
  //   };
  //   // Generic function to check if an item matches any of the parameters
  //   const doesItemMatchParams = (item, paramsKey) => {
  //     const paramValue = paramsMapping[paramsKey];
  //     if (!paramValue || !item?.[paramsKey]) return true; // Return true if no params or item field is present
  //     return paramValue.includes(item[paramsKey].toString());
  //   };
  //   // Filter the data based on the available params
  //   const filteredData =
  //     carSummaryData?.length > 0 &&
  //     carSummaryData?.filter((item) => {
  //       // Loop over each key in paramsMapping and check if item matches the params
  //       return Object.keys(paramsMapping).every((paramsKey) =>
  //         doesItemMatchParams(item, paramsKey),
  //       );
  //     });
  //   if (carSummaryData?.length > 0) {
  //     dispatch(addCarSummaryData(filteredData));
  //   } else {
  //     dispatch(addCarSummaryData([]));
  //   }
  //   //eslint-disable-next-line
  // }, [searchParams]);

  const removeCarItemOnClick = (itemToRemove) => {
    let { value, category } = itemToRemove;
    // code copied from bottom for special case
    if (searchParams?.get("manufacturers") && category === "manufacturers") {
      searchParams.delete("manufacturers");
      searchParams.delete("manufacturersType");
      searchParams.delete("powerType");
      searchParams.delete("modelGroups");
      searchParams.delete("series");
      searchParams.delete("variants");
      setSearchParams(searchParams);
      let manufacturerDeletedFromSummary = carSummaryData?.filter(
        (bodyItem) =>
          bodyItem?.category !== "series" &&
          bodyItem?.category !== "modelGroups" &&
          bodyItem?.category !== "variants",
      );
      dispatch(addCarSummaryData(manufacturerDeletedFromSummary));
    }

    // This is used to delete the query params which are having single values like sealofquality,offerId,minPrice etc
    for (let [qpKey, qrValue] of Object.entries(queryParams)) {
      if (qrValue === value?.toString()) {
        searchParams.delete(qpKey);
        // If item which was removed found to be series , if there are variants then they also must be removed from summary section.
        if (qpKey === "series") {
          searchParams.has("variants") && searchParams.delete("variants");
          let seriesDeletedFromSummary = carSummaryData?.filter(
            (bodyItem) =>
              bodyItem?.category !== "series" &&
              bodyItem?.category !== "modelGroups" &&
              bodyItem?.category !== "variants",
          );
          dispatch(addCarSummaryData(seriesDeletedFromSummary));
          setSearchParams(searchParams);
        }
        setSearchParams(searchParams);
      }
    }
    if (
      searchParams?.get("othermanufacturers") &&
      category === "other-manufacturers"
    ) {
      searchParams.delete("othermanufacturers");
      setSearchParams(searchParams);
    }

    if (searchParams?.get("manufacturers") && category === "manufacturers") {
      searchParams.delete("manufacturers");
      searchParams.delete("manufacturersType");
      // searchParams?.get("powerType") && searchParams.delete("powerType");
      searchParams.delete("powerType");
      searchParams.delete("modelGroups");
      searchParams.delete("series");
      searchParams.delete("variants");
      setSearchParams(searchParams);
      let manufacturerDeletedFromSummary = carSummaryData?.filter(
        (bodyItem) =>
          bodyItem?.category !== "series" &&
          bodyItem?.category !== "modelGroups" &&
          bodyItem?.category !== "variants",
      );
      dispatch(addCarSummaryData(manufacturerDeletedFromSummary));
    }

    if (searchParams?.get("modelExt")) {
      searchParams.delete("modelExt");
      setSearchParams(searchParams);
    }

    let filters = [
      "bodyGroups",
      "usageTypes",
      "drives",
      "transmissions",
      "fuellings",
      "emissionClasses",
      "upholsteries",
      "modelGroups",
      "variants",
    ];
    if (filters?.includes(category)) {
      updateQueryParamsBeforeRemoveItem(category, value);
    }

    // Remove the body,variants,modalGroups filter section from query params as well as to remove it from car section
    if (
      category === "bodies" ||
      category === "modelGroups" ||
      category === "variants" ||
      category === "paints" ||
      category === "interiorColors" ||
      category === "options" ||
      category === "locations"
    ) {
      updateQueryParamsBeforeRemoveItem(category, value);
    }
    dispatch(removeCarSummaryData(itemToRemove.label));
  };

  const updateQueryParamsBeforeRemoveItem = (name, value) => {
    const values = searchParams?.get(name);
    const cleanedValues = values?.replace(/"/g, "").split(",");
    let filteredQpStr = cleanedValues
      ?.filter((item) => item !== value.toString())
      ?.join(",");
    filteredQpStr
      ? searchParams?.set(name, filteredQpStr)
      : searchParams?.delete(name);
    setSearchParams(searchParams);
  };

  const searchRequestHandleClick = () => {
    setSearchRequestPopup(!isShowSearchReqPopup);
  };

  return (
    <>
      {carSummaryData?.length > 0 && (
        <section
          className={` ${vehiclePage ? "!mt-4 !p-4" : ""} ${
            !callFromSaveSearchRequestForm ? "mt-8 py-9" : ""
          } bg-[var(--white-shade)]`}
        >
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
            <div className="py-4 flex justify-between max-md:flex-col max-md:gap-5 max-md:items-center">
              <div className="flex gap-[14px] items-center text-[var(--secondary-color)] flex-wrap  text-sm  max-lg:text-xs max-lg:gap-2">
                {carSummaryData?.length > 0 &&
                  carSummaryData?.map((sumItem, sumIndex) => {
                    return (
                      <div
                        onClick={() => removeCarItemOnClick(sumItem)}
                        key={sumIndex}
                        className="flex gap-1 items-center cursor-pointer"
                      >
                        <span className="mr-2">
                          <SVGSelector name="cross-circular-svg" />
                        </span>
                        {sumItem.label}
                      </div>
                    );
                  })}
              </div>
              {!isHideSearchRequestBtn && totalCount.length === 0 && (
                <div className="min-w-[230px] max-md:flex justify-center">
                  <button
                    data-modal-target="default-modal"
                    data-modal-toggle="default-modal"
                    className={`block bg-[var(--white-shade)] py-[10px] border w-full px-8 max-md:text-sm max-md:px-4 hover-bg-primary-color hover:bg-[var(--primary-dark-color)] text-base  text-[var(--primary-dark-color)] ${getEdgeClass(edge, "rounded-[4px]")}`}
                    type="button"
                    onClick={searchRequestHandleClick}
                  >
                    {t("/.Save search request")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {isShowSearchReqPopup && (
        <SaveSearchRequestForm
          closeSearchRequestPopupHandler={searchRequestHandleClick}
        />
      )}
    </>
  );
};

export default FiltersSummarySection;
