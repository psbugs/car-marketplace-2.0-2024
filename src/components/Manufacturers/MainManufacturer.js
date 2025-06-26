import { useDispatch, useSelector } from "react-redux";
import {
  addCarSummaryData,
  criteriaModelGroups,
  criteriaModels,
  criteriaSeries,
} from "../../redux/CriteriaSlice";
import { useSearchParams } from "react-router-dom";
import OtherManufacturersItems from "./OtherManufacturersItems";
import { useEffect, useState } from "react";
import { VEHICLE_ASSET_PATH } from "../../constants/common-constants";
import NestedSeriesComponent from "./NestedSeriesComponent";
import NoVehicleFound from "../NoVehicleFoundForLandingData";
import ManufacturerBrandList from "./ManufacturerBrandList";
import ModelGroupsOrVariantsData from "./ModelGroupsOrVariantsData";
import { useTranslation } from "react-i18next";
import { extractAndFormatParams } from "../../utils";

const MainManufacturer = ({ manufacturers, edge }) => {
  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  let criteriaAllRes = useSelector((state) => state?.criteria?.criteriaAll);
  const getUiConfigAllRes = useSelector((state) => state.uiConfig.uiConfigData);
  let { searchForm = false } = getUiConfigAllRes || {};
  let { manufacturersWithSeries = false } = searchForm;
  let dispatch = useDispatch();
  const { t } = useTranslation();
  let [searchParams, setSearchParams] = useSearchParams();
  const bodyQueParms = searchParams?.get("bodies");
  const manfacQueParms = searchParams?.get("manufacturers");
  const manfacTypeParms = searchParams?.get("manufacturersType");
  const [carBrand, setCarBrand] = useState(null);
  const [groupedCarItems, setGroupedCarItems] = useState([]);
  const [isVehicleNotFound, setVehicleNotFound] = useState(false);
  const [setSeriesData, setOverallSeriesData] = useState([]);
  const [manufactureId, setManufactureId] = useState("");
  const [manufacType, setManufacType] = useState("");
  const [isShowDefaultOthersTab, setDefaultOthersTab] = useState(false);
  const [showOtherManufacturers, setOtherManufacturers] = useState(false);
  const othermanufacturersQueryParams = searchParams?.get("othermanufacturers");
  const newParams = new URLSearchParams(searchParams);
  const [selectedCarItems, setSelectedCarItems] = useState([]);
  const [isSetActiveBorderClass, setActiveBorderClass] = useState(false);
  const hasVariants = extractAndFormatParams(newParams, "variants");
  const [modelGroupItems, setModalGroupsItems] = useState([]);
  const totalCount = useSelector(
    (state) => state.vehicles.vehicleItemsFromCountsData,
  );

  // If series already there in query params then existing variants must be removed...
  useEffect(() => {
    if (searchParams.has("series")) {
      setSelectedCarItems([]);
    }
  }, [searchParams]);

  useEffect(() => {
    // case for managing other manufacturers default items
    if (hasVariants?.length === 1) {
      setOtherManufacturers(true);
    } else {
      setOtherManufacturers(othermanufacturersQueryParams ? true : false);
    }
  }, [hasVariants, othermanufacturersQueryParams]);

  const isSearchParamsEmpty = searchParams.size === 0;
  // When user wants to reset the filter
  useEffect(() => {
    if (isSearchParamsEmpty) {
      setManufactureId("");
      setVehicleNotFound(false);
      setActiveBorderClass(false);
      setDefaultOthersTab(false);
      setOtherManufacturers(false);
      setGroupedCarItems([]);
      setOverallSeriesData([]);
    }
  }, [isSearchParamsEmpty]);

  useEffect(() => {
    let existingItems = [];
    const paramsName = searchParams.get("modelGroups")
      ? "modelGroups"
      : searchParams.get("variants")
        ? "variants"
        : "";
    if (paramsName) {
      existingItems =
        searchParams
          ?.get(paramsName)
          ?.split(",")
          ?.map((value) => value.replaceAll('"', "")) || [];
      setSelectedCarItems(existingItems);
    }
  }, [searchParams]);

  useEffect(() => {
    if (othermanufacturersQueryParams) {
      setDefaultOthersTab(true);
      setOtherManufacturers(true);
    }
    //eslint-disable-next-line
  }, [othermanufacturersQueryParams]);

  // when user had applied the search manually like copy paste the url in safe mode
  useEffect(() => {
    if (searchParams?.has("manufacturers")) {
      setActiveBorderClass(true);
      setManufactureId(searchParams?.get("manufacturers"));
      getAllExistingBrands();
    }
    if (searchParams?.has("manufacturersType")) {
      setManufacType(searchParams?.get("manufacturersType"));
      setActiveBorderClass(true);
    }
    if (searchParams?.get("othermanufacturers")) {
      setManufactureId("");
      setManufacType("");
      setActiveBorderClass(true);
      getAllExistingBrands();
    }
    //eslint-disable-next-line
  }, [criteriaAllRes, searchParams]);

  const getAllExistingBrands = async () => {
    let getBrandVal = criteriaAllRes?.manufacturers?.filter(
      (item) => item?.value === manfacQueParms,
    );
    if (getBrandVal) {
      let brandItem = {
        manufactureId: manfacQueParms,
        value: getBrandVal[0]?.label,
        manufacturerType: getBrandVal[0]?.manufacturerType || manfacTypeParms, // Ensure this is included
      };
      // Skip fetching series if manufactureId is 252 and manufacturerType is PKW or NFZ
      let isSeriesAllowed =
        brandItem?.manufactureId?.toString() === "252" &&
        manufacturersWithSeries &&
        manufacturersWithSeries.includes(brandItem?.manufactureId);

      if (isSeriesAllowed) {
        let isSeriesExists = await getAllSeriesForAManufacture(brandItem);
        if (!isSeriesExists) {
          fetchModelGroupsCarData(brandItem);
        }
      }
      if (!isSeriesAllowed) {
        let isSeriesExists = await getAllSeriesForAManufacture(brandItem);
        if (brandItem?.manufactureId === "252") {
          isSeriesExists = false;
        }
        if (!isSeriesExists) {
          setOverallSeriesData([]);
          fetchModelGroupsCarData(brandItem);
        }
      }
    }
  };

  const manuFactureBrandImageOnClick = async (brandItem) => {
    const { isOtherManufacture, manufactureId, manufacturerType } = brandItem;
    let manufacturerLabel = t("/.Manufacturer");
    setManufactureId(manufactureId);
    setManufacType(manufacturerType);
    const updatedParams = new URLSearchParams(searchParams?.toString());
    let updatedCarSum = [...carSummaryData];

    // Determine if `manufacturersType` or `series` query parameters exist
    const hasSeries = updatedParams.has("series");
    const hasVariants = updatedParams.has("variants");
    const hasModelGroups = updatedParams.has("modelGroups");
    if (manufacturerType && manufacturerType !== "ALL") {
      updatedParams.set("manufacturersType", manufacturerType);
    } else {
      updatedParams.delete("manufacturersType");
    }

    // Remove `series` query parameter if it exists
    if (hasSeries) {
      updatedParams.delete("series");
      updatedCarSum = updatedCarSum.filter(
        (item) => item.category !== "series",
      );
      setSelectedCarItems([]);
    }

    if (hasVariants) {
      updatedParams.delete("variants");
      updatedCarSum = updatedCarSum.filter(
        (item) => item.category !== "variants",
      );
      setSelectedCarItems([]);
    }

    // Remove `series` query parameter if it exists
    if (hasModelGroups) {
      updatedParams.delete("modelGroups");
      updatedCarSum = updatedCarSum.filter(
        (item) => item.category !== "modelGroups",
      );
      setSelectedCarItems([]);
    }

    // Handle the manufacturer ID
    if (manufactureId) {
      updatedParams.set("manufacturers", manufactureId);
      updatedParams.delete("othermanufacturers");
    } else {
      updatedParams.delete("manufacturers");
      updatedParams.delete("series");
    }

    // Handle `othermanufacturers` parameter
    if (isOtherManufacture) {
      setDefaultOthersTab(true);
      setOtherManufacturers(true);
      // setGroupedCarItems([]);
      setVehicleNotFound(false);
      updatedParams.set("othermanufacturers", "true");
    } else {
      setOtherManufacturers(false);
    }

    // Update the search parameters
    setSearchParams(updatedParams);

    // Update car summary data and fetch series data if necessary
    setCarBrand(brandItem.value);
    localStorage.setItem("brandName", brandItem.value);
    // Remove existing `isOtherManufacture` entries if any
    if (updatedCarSum.some((item) => item.isOtherManufacture)) {
      updatedCarSum = updatedCarSum.filter((item) => !item.isOtherManufacture);
    }

    // Create or update car summary data
    let newCarSummaryData = {
      imageName: brandItem.imageName,
      manufactureId: brandItem.manufactureId,
      label: isOtherManufacture
        ? brandItem.label
        : `${manufacturerLabel} ${brandItem.label}`,
      value: brandItem.value,
      isActive: brandItem.isActive,
      category: isOtherManufacture ? "other-manufacturers" : `manufacturers`,
    };

    if (newCarSummaryData.category === "other-manufacturers") {
      newCarSummaryData = {
        ...newCarSummaryData,
        othermanufacturers: true,
      };
    } else {
      newCarSummaryData = {
        ...newCarSummaryData,
        manufacturers: brandItem.manufactureId,
      };
    }

    if (updatedCarSum?.length > 0) {
      updatedCarSum = updatedCarSum.filter(
        (item) => !item.manufactureId && item.manufactureId !== "",
      );
      updatedCarSum.unshift(newCarSummaryData);
    } else {
      updatedCarSum = [newCarSummaryData];
    }
    dispatch(addCarSummaryData(updatedCarSum));
    // Fetch series data and model groups
    let isSeriesExists = await getAllSeriesForAManufacture(brandItem);
    if (manufactureId === "252") {
      isSeriesExists = false;
    }
    if (!isSeriesExists) {
      setOverallSeriesData([]);
      fetchModelGroupsCarData(brandItem);
    } else {
      setGroupedCarItems([]);
    }
  };

  const getAllSeriesForAManufacture = async (brandItem) => {
    let isSeriesFound = false;
    let { manufactureId } = brandItem;
    // && manufactureId?.toString() !== '252' && manufacturersWithSeries && manufacturersWithSeries?.includes(manufactureId)
    if (manufactureId !== "") {
      let seriesParams = { manufactureId };
      await dispatch(criteriaSeries(seriesParams))
        .then((seriesDtRes) => {
          let seriesData = seriesDtRes.payload;
          if (seriesData && seriesData?.length > 0) {
            setOverallSeriesData(seriesData);
            // setDefaultOthersTab(false);
            isSeriesFound = true;
            setVehicleNotFound(false);
          } else {
            setOverallSeriesData([]);
            isSeriesFound = false;
          }
        })
        .catch((seriesErr) => {
          console.error(seriesErr);
        });
      return isSeriesFound;
    }
    return isSeriesFound;
  };

  const fetchModelGroupsCarData = (brandItem) => {
    let { value, manufactureId } = brandItem;
    const hasOtherManufacture = newParams.get("othermanufacturers");
    let params = {};
    let appendedUrl = "";
    if (manufactureId) {
      appendedUrl = appendedUrl + `&manufacturers=${manufactureId}`;
    }
    let bodiesStr = "";
    if (bodyQueParms && !hasOtherManufacture) {
      let bodiesContainer = bodyQueParms?.split(",");
      for (let item of bodiesContainer) {
        bodiesStr = bodiesStr + `&bodies=${item}`;
      }
      appendedUrl = appendedUrl + bodiesStr;
    }
    params["appendedUrl"] = appendedUrl;
    if (appendedUrl !== "") {
      dispatch(criteriaModelGroups(params))
        .unwrap()
        .then((criteriaModalGrpRes) => {
          if (criteriaModalGrpRes?.length > 0) {
            setDefaultOthersTab(true);
            let { items } = criteriaModalGrpRes[0];
            // check to manage the grouped cars if manufactureType found to be PKW OR NFZ
            if (
              criteriaModalGrpRes?.length > 1 &&
              manufactureId?.toString() === "252" &&
              ["PKW", "NFZ"].includes(manfacTypeParms)
            ) {
              items = criteriaModalGrpRes?.filter(
                (item) => item?.groupType === manfacTypeParms,
              )[0]?.items;
            }
            if (items?.length > 0) {
              setVehicleNotFound(false);
              let areItemsInActive = items.every((item) => !item.isActive);
              if (areItemsInActive) {
                setVehicleNotFound(totalCount !== 0 ? false : true);
              }
              const mappedItems = items.map((eachGrpItem) => ({
                ...eachGrpItem,
                brandImagePath: `${VEHICLE_ASSET_PATH}${value}/${eachGrpItem.value}.png`,
                hoverImagePath: `${VEHICLE_ASSET_PATH}${value}/${eachGrpItem.value}_side.png`,
                isModelGroup: true,
                category: "modelGroups",
              }));
              setGroupedCarItems(
                othermanufacturersQueryParams ? [] : mappedItems,
              );
            }
          } else {
            setGroupedCarItems([]);
          }
        })
        .catch((modalGrpErr) => {
          console.error(modalGrpErr);
        });
    } else {
      setGroupedCarItems([]);
    }
    hasOtherManufacture && setGroupedCarItems([]);
  };

  const renderManufacturesSeriesVariants = (data) => {
    if (data?.length > 0) {
      setGroupedCarItems(data);
      setVehicleNotFound(totalCount?.length > 0 ? false : !isVehicleNotFound);
    } else {
      setGroupedCarItems([]);
      setVehicleNotFound(totalCount?.length > 0 ? false : !isVehicleNotFound);
    }
  };

  const groupedCarOnClickHandler = (event, item) => {
    let { isVarient, category } = item;
    let labelName = isVarient ? t("/.Variant") : t("/.Model/Engine");
    let queryParamName = isVarient ? "variants" : "modelGroups";
    const value = item.value;
    setDefaultOthersTab(true);
    let newActiveItems = [...carSummaryData];
    const itemExists = newActiveItems?.some(
      (existingItem) => existingItem.value === value,
    );
    if (itemExists) {
      newActiveItems = newActiveItems?.filter(
        (existingItem) => existingItem.value !== value,
      );
    } else {
      let updatedItemObj = { ...item };
      updatedItemObj["label"] = isVarient
        ? `${labelName} ${item.label}`
        : `${labelName} ${item.label}`;

      // If isModelGroup is true, add modelGroups key
      if (updatedItemObj.isModelGroup) {
        updatedItemObj.modelGroups = updatedItemObj.value;
      }

      // If isVarient is true, add variants key
      if (updatedItemObj.isVarient) {
        updatedItemObj.variants = updatedItemObj.value;
      }

      // Push the updated item object into the array once
      newActiveItems.push(updatedItemObj);
    }
    if (newActiveItems?.length > 0) {
      let updatesNewActiveItems = [...newActiveItems];
      updatesNewActiveItems = updatesNewActiveItems.filter(
        (item) => item.manufactureId !== "",
      );

      if (isVarient)
        updatesNewActiveItems = newActiveItems.filter(
          (item) => item.category === category,
        );

      if (category === "modelGroups") {
        updatesNewActiveItems = newActiveItems
          .filter((item) => item.category === category)
          .map((item) => ({
            ...item,
            modelGroups: item.value,
          }));
      }

      const values = updatesNewActiveItems.map((item) => item.value);
      setSelectedCarItems(values);

      if (values?.length > 0) {
        newParams.set(queryParamName, `${values.join('","')}`);
      } else {
        newParams.delete(queryParamName);
      }
    } else {
      newParams.delete(queryParamName);
    }
    setSearchParams(newParams);
    dispatch(addCarSummaryData(newActiveItems));

    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries()); // Convert to key-value pairs

    let apiParams = {
      appendedUrl: Object.entries(queryParams)
        .map(
          ([key, value]) =>
            key !== "manufacturersType" &&
            `${key}=${encodeURIComponent(value)}`,
        )
        .filter((item) => item)
        .join("&"),
    };
    dispatch(criteriaModels(apiParams))
      .unwrap()
      .then((res) => {
        setModalGroupsItems(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {isVehicleNotFound && <NoVehicleFound />}
      <section>
        <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
          <div className="mt-8 max-md:mt-4">
            <ul className="flex items-center gap-[14px] max-lg:justify-center flex-wrap set_counter max-md:p-1">
              {/* Render manufacturer brand list */}
              <ManufacturerBrandList
                manufacturers={manufacturers}
                onBrandClick={manuFactureBrandImageOnClick}
                isSetActiveBorderClass={isSetActiveBorderClass}
                manufactureId={manufactureId}
                manufacType={manufacType}
                showOtherManufacturers={
                  hasVariants?.length === 1 ? false : showOtherManufacturers
                }
                edge={edge}
              />
              <div className="block order-9 w-full flex-[100%] max-[1199px]:order-3 max-lg:order-2">
                <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
                  {/* Render modelgroups or variants data */}
                  <ModelGroupsOrVariantsData
                    groupedCarItems={groupedCarItems}
                    selectedCarItems={selectedCarItems}
                    groupedCarOnClickHandler={groupedCarOnClickHandler}
                  />
                </div>
                {/* Render dynamic fields based on other manufacturers */}
                {isShowDefaultOthersTab && (
                  <OtherManufacturersItems
                    isShowOtherFilters={showOtherManufacturers}
                    manufacturers={manufacturers}
                    isShowManufacturer={
                      hasVariants?.length === 1 ? false : true
                    }
                    modelGroups={modelGroupItems}
                  />
                )}
              </div>
              {/* Render series component if series exists*/}
              {setSeriesData?.length > 0 && (
                <div className="block order-9 w-full flex-[100%] max-[1199px]:order-3 max-lg:order-2">
                  <NestedSeriesComponent
                    seriesVariantsDataHandler={renderManufacturesSeriesVariants}
                    carBrand={carBrand}
                    manufacturers={manufacturers}
                  />
                </div>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainManufacturer;
