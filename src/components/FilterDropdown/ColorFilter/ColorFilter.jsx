import { useDispatch, useSelector } from "react-redux";
import { addCarSummaryData } from "../../../redux/CriteriaSlice";
import { handleCheckboxChange } from "../../../utils";
import { useSearchParams } from "react-router-dom";
import SVGSelector from "../../common-components/SVGSelector";
import { useTranslation } from "react-i18next";

const ColorFilter = ({
  filterable,
  key,
  summaryLabel,
  paramsName,
  existingFilters,
  existingMetallic,
}) => {
  const dispatch = useDispatch();
  const { carSummaryData = false } =
    useSelector((state) => state.criteria) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const handleCheckboxForSummary = ({
    evt,
    item,
    labelName,
    paramsName,
    val,
  }) => {
    const checked = evt?.target?.checked;
    handleCheckboxChange(evt, searchParams, paramsName, setSearchParams);
    const updatedItems = checked
      ? [
          ...carSummaryData,
          {
            ...item,
            label: `${labelName} ${val}`,
            paramsName: item?.value,
            category: paramsName,
          },
        ]
      : carSummaryData.filter((bodyItem) => bodyItem?.value !== item?.value);

    dispatch(addCarSummaryData(updatedItems));
  };

  return (
    <section className="block p-4" key={key}>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 text-base">
        {filterable
          ?.filter((color) => color?.value !== "")
          ?.map((color, colorIndex) => (
            <li
              className="active cursor-pointer"
              key={`${color?.value}-${colorIndex}`}
            >
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    value={color?.value}
                    className="min-w-8 h-8 rounded-full focus:outline-none focus:ring-0"
                    style={{
                      background: color?.color,
                    }}
                    checked={existingFilters?.includes(color?.value)}
                    id={`${color?.value}-${paramsName}-color-${color?.label}`}
                    onChange={(evt) =>
                      handleCheckboxForSummary({
                        evt,
                        item: color,
                        labelName: summaryLabel,
                        paramsName: paramsName,
                        val: color?.label,
                      })
                    }
                  />
                  {existingFilters &&
                    existingFilters?.includes(color?.value) && (
                      <span className="top-2 left-2 absolute pointer-events-none">
                        <SVGSelector
                          name={"color-tick-mark-svg"}
                          pathStroke={
                            color?.white
                              ? "var(--text-white-black)"
                              : "var(--text-black-white)"
                          }
                        />
                      </span>
                    )}
                </div>
                <label
                  htmlFor={`${color?.value}-${paramsName}-color-${color?.label}`}
                >
                  {color?.label}
                </label>
              </div>
            </li>
          ))}
        {existingMetallic && (
          <li className="cursor-pointer">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  value={true}
                  className="min-w-8 h-8 rounded-full focus:outline-none focus:ring-0"
                  style={{
                    background: filterable?.[filterable?.length - 1]?.color,
                  }}
                  checked={existingMetallic?.includes("true") ? true : false}
                  id={`${filterable?.[filterable?.length - 1]?.value}-interior-color-${filterable?.[filterable?.length - 1]?.label}`}
                  onChange={(evt) =>
                    handleCheckboxForSummary({
                      evt,
                      item: {
                        label: t("/.Metallic"),
                        value: evt?.target?.checked ? true : false,
                        metallic: evt?.target?.checked ? true : false,
                      },
                      labelName: t("/.Metallic"),
                      paramsName: "metallic",
                      val: "",
                    })
                  }
                />
                {existingMetallic && existingMetallic?.includes("true") ? (
                  <span className="top-2 left-2 absolute pointer-events-none">
                    <SVGSelector
                      name={"color-tick-mark-svg"}
                      pathStroke={
                        filterable?.[filterable?.length - 1]?.white
                          ? "var(--text-white-black)"
                          : "var(--text-black-white)"
                      }
                    />
                  </span>
                ) : null}
              </div>
              <label
                htmlFor={`${filterable?.[filterable?.length - 1]?.value}-interior-color-${filterable?.[filterable.length - 1]?.label}`}
              >
                {filterable?.[filterable?.length - 1]?.label}
              </label>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ColorFilter;
