import React from "react";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass, handleCheckboxChange } from "../../utils";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const FilterDropdown = ({
  uiKey,
  labelHeading,
  svgName,
  filterable,
  paramsName,
  existingFilters,
  ulClassName,
  disabled,
  sectionClassName,
  value,
}) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const handleCheckboxForSummary = ({ evt, paramsName }) => {
    handleCheckboxChange(evt, searchParams, paramsName, setSearchParams);
  };

  return (
    <section className={`block ${sectionClassName}`} key={uiKey} value={value}>
      <div
        className={`flex gap-2 items-center pt-4 ${!svgName ? "text-sm text-[var(--davy-gray-color)] font-medium" : ""} ${labelHeading ? "" : "hidden"}`}
      >
        {svgName && <SVGSelector name={svgName} />}
        <p className={`${svgName ? "font-semibold" : ""}`}>{labelHeading}</p>
      </div>
      <ul className={ulClassName}>
        {filterable &&
          filterable?.map((filters, idx) => {
            return (
              <li
                className={`border-[var(--gray-color)] py-4 ${
                  filterable?.length - 1 !== idx && "border-b"
                }`}
                key={`${filters?.label}-${idx}`}
              >
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      id={`default-checkbox-${filters?.label}`}
                      type="checkbox"
                      className={`w-5 h-5 text-xl primary-color focus:outline-none focus:ring-0 ${getEdgeClass(edge, "rounded-[3px]")}`}
                      value={filters?.value}
                      defaultChecked={
                        existingFilters?.includes(filters?.value) ? true : false
                      }
                      onChange={(evt) =>
                        handleCheckboxForSummary({
                          evt,
                          item: filters,
                          labelName: labelHeading,
                          paramsName,
                          val: filters.label,
                        })
                      }
                      disabled={disabled}
                    />
                    <label
                      htmlFor={`default-checkbox-${filters?.label}`}
                      className="ms-2 text-sm font-medium text-[var(--secondary-color)]"
                    >
                      {filters?.label}
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
export default FilterDropdown;
