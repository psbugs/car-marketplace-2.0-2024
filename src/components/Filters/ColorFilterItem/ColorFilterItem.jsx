import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  addCarSummaryData,
  criteriaPaints,
} from "../../../redux/CriteriaSlice";
import { getEdgeClass, handleCheckboxChange } from "../../../utils";
import { colorsForItsSubFilter } from "../../../constants/common-constants";
import CommonDropDown from "../../common-components/CommonDropDown";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../common-components/SVGSelector";

const ColorFilterItem = ({ retrieveVehicleCounts, edge }) => {
  const [isExterior, setExterior] = useState(true);
  const [isInterior, setInterior] = useState(false);
  const criteriaAllRes = useSelector((state) => state?.criteria?.criteriaAll);
  const exteriorColors = criteriaAllRes?.paints || [];
  const interiorColors = criteriaAllRes?.interiorColors || [];
  const carSummaryData = useSelector((state) => state.criteria.carSummaryData);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let padsOptions = criteriaAllRes?.upholsteries || [];
  padsOptions = padsOptions.map((eachPadItem) => ({
    ...eachPadItem,
    category: "upholsteries",
  }));
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPaints, setSelectedPaints] = useState([]);
  const [selectedInteriorColors, setSelectedInteriorColors] = useState([]);

  useEffect(() => {
    // Reset colors when searchParams is cleared
    if (searchParams?.size === 0) {
      setSelectedPaints([]);
      setSelectedInteriorColors([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const paints =
      searchParams?.get("paints")?.replace(/"/g, "").split(",") || [];
    setSelectedPaints(paints);
    const interiorColors =
      searchParams?.get("interiorColors")?.replace(/"/g, "").split(",") || [];
    setSelectedInteriorColors(interiorColors);
    dispatch(criteriaPaints());
  }, [dispatch, searchParams]);

  // added a key named as category for paints and change the common checkbox function
  const handleColorChange = (event, item, isInteriorColor) => {
    const { checked } = event.target;
    const labelName = isInteriorColor ? t("/.Interior Color") : t("/.Color");
    const paramsName = isInteriorColor ? "interiorColors" : "paints";
    handleCheckboxChange(event, searchParams, paramsName, setSearchParams);
    const updatedColors = checked
      ? [
          ...carSummaryData,
          {
            ...item,
            label: `${labelName} ${item.label}`,
            category: isInteriorColor ? "interiorColors" : "paints",
            [paramsName]: item?.value,
          },
        ]
      : carSummaryData?.filter(
          (colorItem) => colorItem.label !== `${labelName} ${item.label}`,
        );
    dispatch(addCarSummaryData(updatedColors));
  };

  const getLinearGradientColorForEachItem = (itemToGetColor) => {
    return colorsForItsSubFilter
      ?.filter((item) => item?.label === itemToGetColor)
      ?.map((item) => item.color)[0];
  };

  return (
    <div
      className="p-4"
      id="styled-settings"
      role="tabpanel"
      aria-labelledby="settings-tab"
    >
      <div>
        <ul
          className="flex flex-wrap text-sm font-medium text-center justify-center"
          id="default-styled-tab"
        >
          <li className="me-4 max-sm:w-[45%]" role="presentation">
            <div className="flex justify-end gap-2">
              <button
                className={`inline-block  px-8 text-lg max-md:text-sm border-solid hover:bg-white hover:text-[var(--primary-black-color)] ${
                  !isExterior && "primary-dark-color"
                } border py-2 ${getEdgeClass(
                  edge,
                  "rounded-md",
                )} w-full max-md:p-3 hover-bg-primary-color ${
                  isExterior
                    ? "primary-bg-color text-white"
                    : "text-[var(--white-color)"
                }`}
                onClick={() => {
                  setExterior(true);
                  setInterior(false);
                }}
              >
                {t("/.Exterior")}
              </button>
            </div>
          </li>
          <li className="max-sm:w-[45%]" role="presentation">
            <div className="flex justify-end gap-2">
              <button
                className={`${getEdgeClass(edge, "rounded-md")} border py-2 w-full max-md:p-3 hover-bg-primary-color inline-block px-8 text-lg max-md:text-sm max border-solid hover:bg-white hover:text-[var(--primary-black-color)] ${
                  !isInterior && "primary-dark-color"
                } ${
                  isInterior
                    ? "primary-bg-color text-white"
                    : "text-[var(--white-color)"
                }`}
                onClick={() => {
                  setExterior(false);
                  setInterior(true);
                }}
              >
                {t("/.Interior")}
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div id="default-styled-tab-color " className="mt-2">
        {isExterior && (
          <div
            className="p-4 rounded-lg"
            id="styled-color1"
            role="tabpanel"
            aria-labelledby="styled-color1"
          >
            <div className="block">
              <ul className="grid grid-cols-8 gap-x-4 gap-y-10 text-base max-lg:grid-cols-4 max-sm:grid-cols-2">
                {exteriorColors?.map((eachColorItem) => (
                  <li
                    className="active cursor-pointer"
                    key={eachColorItem.value}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          value={eachColorItem.value}
                          className="min-w-8 h-8 rounded-full relative focus:outline-none focus:ring-0"
                          style={{
                            background: getLinearGradientColorForEachItem(
                              eachColorItem.label,
                            ),
                          }}
                          id={`${eachColorItem.value}-exterior-color-${eachColorItem.label}`}
                          checked={selectedPaints.includes(eachColorItem.value)}
                          onChange={(evt) =>
                            handleColorChange(evt, eachColorItem, false)
                          }
                        />
                        {selectedPaints?.includes(eachColorItem.value) && (
                          <span className="top-2 left-2 absolute pointer-events-none">
                            <SVGSelector
                              name="checkmark-svg"
                              pathStroke="var(--text-black-white)"
                            />
                          </span>
                        )}
                      </div>
                      <label
                        className="flex-grow"
                        htmlFor={`${eachColorItem.value}-exterior-color-${eachColorItem.label}`}
                      >
                        {eachColorItem.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {isInterior && (
          <div
            className="p-4 rounded-lg"
            id="styled-color2"
            role="tabpanel"
            aria-labelledby="styled-color2"
          >
            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2 mb-10">
              <CommonDropDown
                labelName={t("/.Pad")}
                dropDownData={padsOptions}
                queryParamsName="upholsteries"
                fetchCorrespondingItems={retrieveVehicleCounts}
                edge={edge}
              />
            </div>

            <div className="block">
              <ul className="grid grid-cols-8 gap-x-4 gap-y-10 text-base max-lg:grid-cols-4 max-sm:grid-cols-2">
                {interiorColors?.map((eachColorItem) => (
                  <li
                    className="active cursor-pointer"
                    key={eachColorItem.value}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          value={eachColorItem.value}
                          className="min-w-8 h-8 rounded-full relative focus:outline-none focus:ring-0"
                          style={{
                            background: getLinearGradientColorForEachItem(
                              eachColorItem?.label,
                            ),
                          }}
                          id={`${eachColorItem.value}-interior-color-${eachColorItem.label}`}
                          checked={selectedInteriorColors.includes(
                            eachColorItem.value,
                          )}
                          onChange={(evt) =>
                            handleColorChange(evt, eachColorItem, true)
                          }
                        />
                        {selectedInteriorColors.includes(
                          eachColorItem.value,
                        ) && (
                          <span className="top-2 left-2 absolute pointer-events-none">
                            <SVGSelector
                              name="checkmark-svg"
                              pathStroke="var(--text-black-white)"
                            />
                          </span>
                        )}
                      </div>
                      <label
                        className="flex-grow"
                        htmlFor={`${eachColorItem.value}-interior-color-${eachColorItem.label}`}
                      >
                        {eachColorItem.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorFilterItem;
