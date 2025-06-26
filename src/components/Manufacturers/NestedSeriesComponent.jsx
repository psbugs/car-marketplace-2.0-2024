import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  addCarSummaryData,
  criteriaSeries,
  criteriaVariants,
} from "../../redux/CriteriaSlice";
import { VARIANTS_IMAGE_PREFIX_URL } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";

const NestedSeriesComponent = (props) => {
  let { seriesVariantsDataHandler, carBrand } = props;
  const [seriesId, setSeriesId] = useState("all"); // Default to 'all' initially
  const [seriesItems, setSeriesItems] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  let getAllSeriesDt = useSelector((state) => state.criteria.criteriaSeriesAll);

  let carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const manufacturersQueryParams = searchParams?.get("manufacturers");
  const newParams = new URLSearchParams(searchParams?.toString());
  const [seriesName, setSeriesName] = useState(
    localStorage.getItem("seriesName") || "",
  );
  /*eslint-disable */
  const [carBrandState, setCarBrandState] = useState(
    localStorage.getItem("brandName") || carBrand,
  );
  useEffect(() => {
    if (getAllSeriesDt?.length > 0) {
      let seriesObj = { category: "series" };
      let mappedGetAllSeriesDt = getAllSeriesDt?.map((seriesItem) => ({
        ...seriesItem,
        ...seriesObj,
      }));
      setSeriesItems([
        {
          name: t("/.All"),
          value: "all",
          label: t("/.All"),
          ...seriesObj,
        },
        ...mappedGetAllSeriesDt,
      ]);
    }
    newParams.delete("modelGroups");
    setSearchParams(newParams);
    // eslint-disable-next-line
  }, [getAllSeriesDt]);

  useEffect(() => {
    const seriesParam = searchParams?.get("series");
    if (!seriesParam) {
      setSeriesId("all");
    }
    let seriesApiParams = {
      manufactureId: manufacturersQueryParams,
      seriesId: seriesParam,
    };
    setSeriesId(seriesParam == null ? "all" : seriesApiParams.seriesId);
    getAllSeriesData(seriesApiParams);
    getAllSeriesVariantsData(seriesApiParams);
    // eslint-disable-next-line
  }, [searchParams]);

  const getAllSeriesData = (seriesApiParams) => {
    dispatch(criteriaSeries(seriesApiParams)).unwrap();
  };

  const seriesDataOnClickHandler = (seriesItem) => {
    let seriesLabel = t("/.Model Series");
    let hasVariants = newParams.has("variants");
    hasVariants && newParams.delete("variants");
    setSearchParams(newParams);
    const { value, label, name } = seriesItem;
    setSeriesId(seriesItem.value);
    setSeriesName(seriesItem.name);
    localStorage.setItem("seriesName", seriesItem.name);
    // Remove the modalGroups
    value !== "" ? newParams.set("series", value) : newParams.delete("series");
    let summaryItemLabel = label && !label.includes(",") ? label : name;
    setSearchParams(newParams);
    const newItem = {
      label: `${seriesLabel} : ${summaryItemLabel}`,
      value: value,
      category: "series",
      series: value,
    };

    const filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith(`${seriesLabel} : `),
    );
    const updatedCarSummaryData =
      value.trim() === ""
        ? filteredCarSummaryData
        : [...filteredCarSummaryData, newItem];

    dispatch(addCarSummaryData(updatedCarSummaryData));
    const variantSeriesParams = {
      seriesId: seriesItem?.value,
    };

    if (manufacturersQueryParams) {
      variantSeriesParams["manufactureId"] = manufacturersQueryParams;
    }

    getAllSeriesVariantsData(variantSeriesParams);
  };

  const getAllSeriesVariantsData = (variantSeriesParams) => {
    if (
      !variantSeriesParams?.seriesId ||
      !variantSeriesParams?.manufactureId?.[0]
    ) {
      // console.warn("Invalid params: something went wrong with the parameter");
      return;
    }

    const seriesArray = variantSeriesParams?.seriesId?.split(",");
    const urlParams = new URLSearchParams();
    urlParams.set("manufacturers", variantSeriesParams?.manufactureId[0]);

    seriesArray?.forEach((series) => {
      urlParams?.append("series", series);
    });

    dispatch(criteriaVariants(urlParams?.toString()))
      .unwrap()
      .then((seriesVariantDt) => {
        seriesVariantDt = seriesVariantDt?.map((eachVariantItem, index) => {
          return {
            ...eachVariantItem,
            brandImagePath: `${VARIANTS_IMAGE_PREFIX_URL}${carBrandState?.toUpperCase()}/${seriesName}-${eachVariantItem.name}.png`,
            hoverImagePath: `${VARIANTS_IMAGE_PREFIX_URL}${carBrandState?.toUpperCase()}/${seriesName}-${eachVariantItem.name}_side.png`,
            isVarient: true,
            category: "variants",
            isActive: true,
          };
        });
        seriesVariantsDataHandler(seriesVariantDt);
      })
      .catch((serVarErr) => {
        console.error(serVarErr);
      });
  };
  const highLightActiveClass = `text-[var(--primary-dark-color)] text-1xl me-2 max-md:text-lg font-semibold relative before:content-[''] before:w-full before:h-1 before:bottom-[-10px] w-6 before:absolute before:bg-[var(--primary-dark-color)] before:left-0 cursor-pointer`;
  return (
    <>
      <div className="text-xl gap-4 border-b border-[var(--gray-color)] py-2 flex items-center max-md:items-start mt-2 flex-wrap">
        <div className="min-w-4 min-h-4 max-md:mt-2 cursor-pointer">
          <SVGSelector
            name="arrow-left-svg"
            pathFill={"var(--primary-dark-color)"}
          />
        </div>
        {seriesItems?.map((seriesItem, seriesItmIndex) => {
          const seriesName = seriesItem?.value;
          const className =
            seriesName === seriesId
              ? highLightActiveClass
              : "me-2 max-md:text-lg cursor-pointer";

          return (
            <div
              key={seriesItmIndex}
              className={className}
              onClick={() => {
                seriesDataOnClickHandler(seriesItem);
              }}
            >
              {seriesItem?.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NestedSeriesComponent;

// Assumptions

// If user Clicks on All tab for series then I am showing currently vehicles not found page
// If user click on a series item whose variant don't exists then also showing vehicles not found page
