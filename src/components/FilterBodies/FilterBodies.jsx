import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCarSummaryData } from "../../redux/CriteriaSlice";
import { useSearchParams } from "react-router-dom";
import { handleCheckboxChange } from "../../utils";
import FiltersSummarySection from "../FiltersSummarySection/FiltersSummarySection";
import { useTranslation } from "react-i18next";

const FilterBodies = ({ bodies = [], edge }) => {
  // Map and add category property to each body item
  const modifiedBodies = bodies.map((item) => ({
    ...item,
    category: "bodies",
  }));
  const { t } = useTranslation();
  const carSumData = useSelector((state) => state.criteria.carSummaryData);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBodyItems, setSelectedBodyItems] = useState([]);

  useEffect(() => {
    const bodyParams =
      searchParams.get("bodies")?.replace(/"/g, "").split(",") ?? [];
    setSelectedBodyItems(bodyParams.map((value) => value.replaceAll('"', "")));
  }, [searchParams]);

  const handleBodyChange = (event, item) => {
    const { checked } = event.target;
    const labelName = t("/.Body sedan");
    const paramsName = "bodies";

    handleCheckboxChange(event, searchParams, paramsName, setSearchParams);

    const updatedBodyItems = checked
      ? [
          ...carSumData,
          { ...item, label: `${labelName} ${item.label}`, bodies: item.value },
        ]
      : carSumData.filter(
          (bodyItem) => bodyItem.label !== `${labelName} ${item.label}`,
        );

    dispatch(addCarSummaryData(updatedBodyItems));
  };
  const baseClass = "relative";

  return (
    <>
      <section>
        <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 custom-bodies-wrap">
          <div className="mt-8 max-md:mt-0">
            <div className="flex gap-[14px] max-lg:flex-col">
              <h5 className="font-medium text-base text-bg-[var(--secondary-color)] py-3 min-w-[155px] max-lg:py-1">
                {t(`/.Body Quick Search`)}:
              </h5>
              <div className="flex gap-[14px] items-center text-[var(--secondary-color)] flex-wrap text-sm max-lg:text-xs max-lg:gap-2">
                {modifiedBodies?.length > 0 &&
                  modifiedBodies.map((bodyItem, index) => {
                    const isActive = selectedBodyItems.includes(bodyItem.value);
                    const activeClass = isActive ? "" : "bg-white";
                    const finalClass = `${baseClass} ${activeClass}`;
                    return (
                      <div
                        key={index}
                        className={`flex gap-2 filter-search-body relative items-center ${finalClass} ${edge}`}
                        style={
                          edge && edge !== "sharp"
                            ? { borderRadius: "8px" }
                            : { borderRadius: "0px" }
                        }
                      >
                        <div>
                          <input
                            type="checkbox"
                            value={bodyItem.value}
                            className="w-full h-full absolute top-0 left-0 opacity-0"
                            id={`${bodyItem.value}-exterior-color-${bodyItem.label}`}
                            checked={selectedBodyItems.includes(bodyItem.value)}
                            onChange={(event) =>
                              handleBodyChange(event, bodyItem)
                            }
                          />
                          <label
                            className="flex-grow cursor-pointer"
                            htmlFor={`${bodyItem.value}-exterior-color-${bodyItem.label}`}
                          >
                            {bodyItem.label}
                          </label>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {<FiltersSummarySection />}
    </>
  );
};

export default FilterBodies;
