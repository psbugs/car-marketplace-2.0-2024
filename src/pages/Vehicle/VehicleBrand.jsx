import React, { useState, useEffect, useMemo } from "react";
import {
  extractAndFormatParams,
  getEdgeClass,
  getManufacturers,
  handleCheckboxChange,
  handleVehicleBrandCheckboxChange,
  keyGenerator,
  sortedManufacturersList,
} from "../../utils";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  appendManufacturersList,
  createManufacturersList,
  criteriaModelGroups,
  criteriaModels,
  criteriaSeries,
  criteriaVariants,
} from "../../redux/CriteriaSlice";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../components/common-components/SVGSelector";
import SearchInputField from "../../components/common-components/SearchInputField";
import Preloader from "../../components/Preloader";

const VehicleBrand = () => {
  const dispatch = useDispatch();
  let {
    loading = false,
    criteriaAll: criteriaAllRes = [],
    manufacturersList = [],
  } = useSelector((state) => state?.criteria) || {};
  const { manufacturers = false } = criteriaAllRes || [];
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state.uiConfig) || {};
  const { searchForm = false } = uiConfigData || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);
  const existingManufacturers = extractAndFormatParams(
    newParams,
    "manufacturers",
  );
  const existingManufacturersType = extractAndFormatParams(
    newParams,
    "manufacturersType",
  );
  const existingSeries = extractAndFormatParams(newParams, "series");
  const existingModelGroups = extractAndFormatParams(newParams, "modelGroups");
  const existingVariants = extractAndFormatParams(newParams, "variants");
  const existingModelExt = extractAndFormatParams(newParams, "modelExt");
  const existingOtherManufacturers = extractAndFormatParams(
    newParams,
    "othermanufacturers",
  );
  const [searchInput, setSearchInput] = useState(existingModelExt);
  const { t } = useTranslation();

  useEffect(() => {
    let mnuList = false;
    if (
      searchForm &&
      manufacturers &&
      (manufacturersList?.length === 0 || manufacturersList === false)
    ) {
      mnuList = getManufacturers(searchForm, manufacturers);
    }
    if (mnuList && mnuList?.length > 0) {
      dispatch(createManufacturersList(mnuList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchForm, manufacturers]);

  const fetchSeriesAndModels = async (manufacturer, event) => {
    const { manufacturersId, isSeries, manufacturersType } = manufacturer;
    const { checked, name, value } = event.target;

    if (name !== "manufacturer") {
      handleCheckboxChange(
        event,
        searchParams,
        manufacturersId === 319
          ? "variants"
          : manufacturer?.isSeries
            ? "series"
            : "modelGroups",
        setSearchParams,
        { singleParam: manufacturer?.isSeries ? true : false },
      );

      if (name === "series") {
        localStorage.setItem(
          name,
          JSON.stringify(
            manufacturer?.[name]?.filter((ser) =>
              ser?.value?.split(",")?.includes(value || ""),
            ),
          ),
        );
        const queryParams = [
          `manufacturers=${manufacturersId}`,
          ...value.split(",").map((ser) => `series=${ser}`),
        ].join("&");

        try {
          const response = await dispatch(
            criteriaVariants(queryParams),
          ).unwrap();
          dispatch(
            appendManufacturersList({
              name: "variants",
              data: response,
              manufacturer,
              value,
            }),
          );
        } catch (error) {
          handleCheckboxChange(
            { ...event, target: { ...event.target, checked: false } },
            searchParams,
            manufacturer?.isSeries ? "series" : "modelGroups",
            setSearchParams,
            { singleParam: manufacturer?.isSeries ? true : false },
          );
        }
      }
      if (name === "variants") {
        fetchVariantsAndEngines(event, manufacturer);
      }
      return;
    }
    // case for manufacturer starts from here
    handleVehicleBrandCheckboxChange(
      manufacturer,
      event,
      searchParams,
      setSearchParams,
    );

    if (!manufacturersId || checked === false || manufacturersId === 9999999999)
      return;
    let seriesOrModelData = false;

    try {
      const action =
        manufacturer?.manufacturersId === 319
          ? criteriaVariants(`manufacturers=319`)
          : isSeries
            ? criteriaSeries({ manufactureId: manufacturersId })
            : criteriaModelGroups({
                appendedUrl: `&manufacturers=${manufacturersId}`,
              });
      const response = await dispatch(action).unwrap();
      seriesOrModelData = response;
    } catch (error) {
      handleVehicleBrandCheckboxChange(
        manufacturer,
        { ...event, target: { ...event.target, checked: false } },
        searchParams,
        setSearchParams,
      );
    }

    const updateData = !isSeries
      ? {
          name: "models",
          data:
            seriesOrModelData?.length > 1
              ? seriesOrModelData
                  ?.filter(
                    (series) =>
                      series?.groupType === (manufacturersType || "") &&
                      series?.value ===
                        (manufacturersId ? manufacturersId.toString() : ""),
                  )
                  ?.flatMap((series) =>
                    series?.items?.filter((itx) => itx?.isActive),
                  )
              : seriesOrModelData?.[0]?.items?.filter((itx) => itx?.isActive),
          manufacturer,
        }
      : {
          name: "series",
          data: seriesOrModelData?.filter((itx) => itx?.isActive),
          manufacturer,
        };
    dispatch(appendManufacturersList(updateData));
  };

  const fetchVariantsAndEngines = async (event, manufacturer) => {
    const { value, dataset, name } = event.target;
    const { seriesValue, paramName } = dataset;
    const workingName = paramName ? paramName : name;
    if (workingName === "variants" && manufacturer?.manufacturersId === 319) {
      const filterableData = manufacturer?.variants?.length
        ? manufacturer?.variants
        : manufacturer?.series;
      localStorage.setItem(
        workingName,
        JSON.stringify(
          filterableData?.filter((varItem) => varItem?.value === value) || [],
        ),
      );
    }
    if (workingName === "variants" && manufacturer?.manufacturersId !== 319)
      localStorage.setItem(
        workingName,
        JSON.stringify(
          (
            manufacturer?.series?.filter((ser) =>
              ser?.value?.split(",")?.includes(existingSeries?.[0] || ""),
            )?.[0]?.variants || []
          )?.filter((varItem) => varItem?.value === value),
        ),
      );

    handleCheckboxChange(event, searchParams, workingName, setSearchParams, {
      singleParam: true,
    });
    try {
      let response = await dispatch(
        criteriaModels(`${workingName}=${value}`),
      ).unwrap();
      response = await response?.filter((res) => res.isActive);
      dispatch(
        appendManufacturersList({
          name:
            workingName !== "variants"
              ? "other-manufacturers-models"
              : "engine",
          data: response,
          manufacturer,
          value,
          seriesValue,
        }),
      );
    } catch (error) {
      handleCheckboxChange(
        { ...event, target: { ...event.target, checked: false } },
        searchParams,
        workingName,
        setSearchParams,
        { singleParam: true },
      );
    }
  };
  const onlyOtherManuAvailable =
    manufacturersList?.length === 1 &&
    manufacturersList?.[0]?.label === "Other manufacturers";
  const fixedManufacturers = useMemo(() => {
    return searchForm?.fixedManufacturers || [];
  }, [searchForm?.fixedManufacturers]);
  const sortedManufacturers = useMemo(() => {
    return manufacturersList
      ? sortedManufacturersList(manufacturersList, fixedManufacturers)
      : [];
  }, [manufacturersList, fixedManufacturers]);

  const [activeMiniVariant, setActiveMiniVariant] = useState(null);
  return (
    <div className="block ">
      {loading && <Preloader />}
      <ul key="manufacturersList">
        {sortedManufacturers &&
          sortedManufacturers?.length > 0 &&
          sortedManufacturers?.map((manufacturer) => {
            const uniqueID = uuidv4();
            const dropdownID = manufacturer?.manufacturersId;
            const manufacturerMini = manufacturer?.manufacturersId === 319;
            return (
              <li
                key={uniqueID}
                className={`${onlyOtherManuAvailable ? "" : "py-4"} border-[var(--gray-color)] border-b`}
                htmlFor={dropdownID}
              >
                {!onlyOtherManuAvailable ? (
                  <div className="flex">
                    <label className="flex w-full cursor-pointer">
                      <input
                        id={dropdownID}
                        type="checkbox"
                        name="manufacturer"
                        value={`${manufacturer?.manufacturersId}-${manufacturer?.manufacturersType || ""}`}
                        defaultChecked={
                          !existingOtherManufacturers?.[0]
                            ? `${existingManufacturers?.[0] || ""}-${existingManufacturersType?.[0] || ""}` ===
                              `${manufacturer?.manufacturersId || ""}-${manufacturer?.manufacturersType || ""}`
                            : existingOtherManufacturers?.[0] &&
                              manufacturer?.manufacturersId === 9999999999
                        }
                        className={`w-5 h-5 text-xl primary-color focus:ring-0 ${getEdgeClass(edge, "rounded-[3px]")}`}
                        onClick={(e) => fetchSeriesAndModels(manufacturer, e)}
                      />
                      <div className="flex w-full">
                        <div className="justify-between text-[var(--secondary-color)] text-sm focus:outline-none font-medium rounded-md px-3 w-full text-center inline-flex items-center">
                          <span className="ms-2 text-sm font-medium text-[var(--secondary-color)]">
                            {manufacturer?.label === "Other manufacturers"
                              ? t(`/.${manufacturer?.label}`)
                              : manufacturer?.label}
                          </span>
                          <SVGSelector name="arrow-down-svg" />
                        </div>
                      </div>
                    </label>
                  </div>
                ) : null}
                {`${existingManufacturers?.[0] || ""}-${existingManufacturersType?.[0] || ""}` ===
                `${manufacturer?.manufacturersId || ""}-${manufacturer?.manufacturersType || ""}` ? (
                  <div
                    className="block w-full"
                    key={`series-or-models-${dropdownID}`}
                  >
                    <div className="z-10 bg-[var(--white-color)] divide-y text-sm divide-gray-100 rounded-lg w-full !relative !transform-none">
                      <ul className="text-sm p-4 pb-0">
                        {/* {manufacturer?.isSeries &&
                        manufacturer?.isSeries?.length
                          ? "Series"
                          : manufacturer?.manufacturer
                            ? "Models"
                            : null} */}
                        {manufacturer?.[
                          manufacturerMini
                            ? manufacturer?.variants?.length
                              ? "variants"
                              : "series"
                            : manufacturer?.isSeries
                              ? "series"
                              : "models"
                        ]?.length > 0 &&
                          manufacturer?.[
                            manufacturerMini
                              ? manufacturer?.variants?.length
                                ? "variants"
                                : "series"
                              : manufacturer?.isSeries
                                ? "series"
                                : "models"
                          ]?.map((data, id) => (
                            <li className="py-2" key={`${data?.value}-${id}`}>
                              <label
                                className={"flex items-center cursor-pointer"}
                              >
                                <input
                                  id={`${data?.value}-${id}`}
                                  name={
                                    manufacturerMini
                                      ? // ? manufacturer?.variants?.length
                                        "variants"
                                      : // : "series"
                                        manufacturer?.isSeries
                                        ? "series"
                                        : "models"
                                  }
                                  type="checkbox"
                                  value={data?.value}
                                  defaultChecked={
                                    manufacturerMini
                                      ? data?.value
                                          ?.split(",")
                                          ?.includes(existingVariants?.[0])
                                      : manufacturer?.isSeries
                                        ? data?.value
                                            ?.split(",")
                                            ?.includes(existingSeries?.[0])
                                        : existingModelGroups?.includes(
                                            data?.value,
                                          )
                                  }
                                  onClick={(event) => {
                                    const isChecked = event.target.checked;
                                    const value = data?.value;
                                    if (isChecked) {
                                      setActiveMiniVariant(value);
                                    } else {
                                      setActiveMiniVariant(null);
                                    }

                                    manufacturerMini
                                      ? fetchVariantsAndEngines(
                                          event,
                                          manufacturer,
                                        )
                                      : fetchSeriesAndModels(
                                          manufacturer,
                                          event,
                                        );
                                  }}
                                  className={`w-5 h-5 text-xl primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                />
                                <span
                                  className={`ms-2 text-sm font-medium ${
                                    data?.isActive === false
                                      ? "opacity-50"
                                      : "text-[var(--secondary-color)]"
                                  }`}
                                >
                                  {data?.label || data?.name}
                                </span>
                              </label>
                              {/* ENGINES FOR MANUFACTURER MINI (319) */}
                              {manufacturerMini &&
                              activeMiniVariant === data?.value &&
                              data?.engines?.length > 0 ? (
                                <ul className="pl-6 mt-1">
                                  {manufacturer?.variants
                                    ?.filter((a) =>
                                      a?.value
                                        ?.split(",")
                                        ?.includes(existingVariants?.[0]),
                                    )?.[0]
                                    ?.engines?.map((engineModel, engMdlId) => (
                                      <li key={engMdlId} className="py-1">
                                        <label className="flex items-center cursor-pointer">
                                          <input
                                            id={`${engineModel?.value}-${engMdlId}`}
                                            type="checkbox"
                                            name={`engine-model-${engineModel?.value}-${engMdlId}`}
                                            value={engineModel?.value}
                                            defaultChecked={existingModelGroups?.includes(
                                              engineModel?.value,
                                            )}
                                            onClick={(event) =>
                                              handleCheckboxChange(
                                                event,
                                                searchParams,
                                                "modelGroups",
                                                setSearchParams,
                                              )
                                            }
                                            className={`w-3.5 h-3.5 primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                          />
                                          <span className="ms-2 text-xs text-[var(--secondary-color)]">
                                            {engineModel?.label ||
                                              engineModel?.name}
                                          </span>
                                        </label>
                                      </li>
                                    ))}
                                </ul>
                              ) : null}
                              {/* ENGINES FOR MANUFACTURER MINI (319) ENDS HERE */}
                              {/* Variants-Dropdown */}
                              {(data?.value
                                ?.split(",")
                                ?.includes(existingSeries?.[0]) &&
                                data?.variants?.length > 0) ||
                              manufacturerMini ? (
                                <ul className="pl-6 mt-2">
                                  {/* {!manufacturerMini &&
                                    "Variants"} */}
                                  {data?.variants?.map((variant, vrtId) => (
                                    <li key={vrtId} className="py-1">
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          id={`${variant?.value}-${vrtId}`}
                                          type="checkbox"
                                          name={variant?.label}
                                          value={variant?.value}
                                          data-series-value={data?.value}
                                          data-param-name={"variants"}
                                          defaultChecked={
                                            existingVariants?.[0] ===
                                            variant?.value
                                          }
                                          onClick={(event) => {
                                            fetchVariantsAndEngines(
                                              event,
                                              manufacturer,
                                            );
                                          }}
                                          className={`w-4 h-4 primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                        />
                                        <span className="ms-2 text-sm text-[var(--secondary-color)]">
                                          {variant?.label || variant?.name}
                                        </span>
                                      </label>
                                      {/* Engine-Models-Nested Dropdown */}
                                      {existingVariants?.[0] ===
                                        variant?.value &&
                                        variant?.engines?.length > 0 && (
                                          <ul className="pl-6 mt-1">
                                            {t("/.Model/Engine")}
                                            {variant?.engines.map(
                                              (engineModel, engMdlId) => (
                                                <li
                                                  key={engMdlId}
                                                  className="py-1"
                                                >
                                                  <label className="flex items-center cursor-pointer">
                                                    <input
                                                      id={`${engineModel?.value}-${engMdlId}`}
                                                      type="checkbox"
                                                      name={`engine-model-${engineModel?.value}-${engMdlId}`}
                                                      value={engineModel?.value}
                                                      defaultChecked={existingModelGroups?.includes(
                                                        engineModel?.value,
                                                      )}
                                                      onClick={(event) =>
                                                        handleCheckboxChange(
                                                          event,
                                                          searchParams,
                                                          "modelGroups",
                                                          setSearchParams,
                                                        )
                                                      }
                                                      className={`w-3.5 h-3.5 primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                                    />
                                                    <span className="ms-2 text-xs text-[var(--secondary-color)]">
                                                      {engineModel?.label ||
                                                        engineModel?.name}
                                                    </span>
                                                  </label>
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {(existingOtherManufacturers?.[0] &&
                  manufacturer?.manufacturersId === 9999999999) ||
                onlyOtherManuAvailable ? (
                  <div
                    className="block w-full"
                    key={`other-manufacturer-${manufacturer?.manufacturersId}`}
                  >
                    <div className="z-10 bg-[var(--white-color)] divide-y text-sm divide-gray-100 rounded-lg w-full !relative !transform-none">
                      <ul className="text-sm p-4 pb-0">
                        {manufacturer?.models?.length > 0 &&
                          manufacturer?.models?.map((data, id) => (
                            <li
                              className="py-2"
                              key={`${data?.label}-${id}`}
                              value={`${data?.label}-${id}`}
                            >
                              <label
                                className={"flex items-center cursor-pointer"}
                              >
                                <input
                                  id={`${data?.label}-${id}`}
                                  name={data?.label}
                                  type="checkbox"
                                  value={data?.manufacturersId}
                                  data-param-name={"manufacturers"}
                                  defaultChecked={existingManufacturers?.[0]?.includes(
                                    data?.manufacturersId,
                                  )}
                                  onClick={(event) => {
                                    fetchVariantsAndEngines(
                                      event,
                                      manufacturer,
                                    );
                                  }}
                                  className={`w-5 h-5 text-xl primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                />
                                <span
                                  className={`ms-2 text-sm font-medium ${
                                    data?.isActive === false
                                      ? "opacity-50"
                                      : "text-[var(--secondary-color)]"
                                  }`}
                                >
                                  {data?.label || data?.name}
                                </span>
                              </label>
                              {/* Engine-Models-Nested Dropdown from other manufacturers */}
                              {existingManufacturers?.[0]?.includes(
                                data?.manufacturersId,
                              ) && data?.engines?.length > 0 ? (
                                <ul className="pl-6 mt-2">
                                  {t("/.Model/Engine")}
                                  {data?.engines.map((engines, vrtId) => (
                                    <li key={vrtId} className="py-1">
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          id={`${engines?.value}-${vrtId}`}
                                          type="checkbox"
                                          name={engines?.label}
                                          value={engines?.value}
                                          data-series-value={data?.value}
                                          defaultChecked={existingModelGroups?.includes(
                                            engines?.value,
                                          )}
                                          onClick={(event) =>
                                            handleCheckboxChange(
                                              event,
                                              searchParams,
                                              "modelGroups",
                                              setSearchParams,
                                            )
                                          }
                                          className={`w-4 h-4 primary-color focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] dark:bg-white dark:border-gray-600 ${edge && edge !== "sharp" ? "rounded-[3px]" : ""}`}
                                        />
                                        <span className="ms-2 text-sm text-[var(--secondary-color)]">
                                          {engines?.label || engines?.name}
                                        </span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
      </ul>
      <div>
        <p className="text-sm text-[var(--davy-gray-color)] font-medium pt-4">
          {t("/vehicles.Model")}
        </p>
        <div
          className="mt-4"
          key={keyGenerator(existingModelExt, searchInput, "modelExt")}
        >
          <SearchInputField
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            wrapperClassName={"w-full"}
            spanClassName={"pointer-events-none top-3 right-3"}
            id={"modelExt"}
            paramName={"modelExt"}
            labelPrefix={t("/.Model addition")}
            placeholder={t("/vehicles.e.g. GTI")}
            edgeClass={"rounded-md"}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleBrand;
