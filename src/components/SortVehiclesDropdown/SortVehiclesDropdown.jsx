import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const SortVehiclesDropdown = () => {
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const options = uiConfigData?.resultAppearance?.orderings?.flatMap((item) => [
    {
      value: `${item}-asc`,
      label: `${t(`/vehicles.${item}`)} ${t("/vehicles.ascending")}`,
    },
    {
      value: `${item}-desc`,
      label: `${t(`/vehicles.${item}`)} ${t("/vehicles.descending")}`,
    },
  ]);

  const { resultAppearance = {} } = uiConfigData || {};
  const { defaultOrdering = "", defaultOrderDir = "" } = resultAppearance;
  const defaultOrderDirVal = defaultOrderDir?.toLowerCase();
  const defaultSortValue = `${defaultOrdering}-${defaultOrderDirVal}`;

  const [selectedValue, setSelectedValue] = useState(
    searchParams.get("order") || defaultSortValue,
  );

  useEffect(() => {
    const currentOrder = searchParams.get("order") || defaultSortValue;
    setSelectedValue(currentOrder);
    // eslint-disable-next-line
  }, [search, defaultSortValue]);

  const handleSort = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    searchParams.set("order", newValue);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div
      className={`${getEdgeClass(edge, "rounded-md")} max-sm:w-full relative flex items-center gap-4 flex-auto bg-[var(--white-shade)] text-base text-[var(--primary-dark-color)] border w-fit max-md:text-sm max-md:p-0 `}
      key={Math.floor(Math.random() * 100000 + 1)}
    >
      <SVGSelector name="sort-svg" />
      <select
        className={`${getEdgeClass(edge, "rounded-md")} border-none w-full ps-10 pe-2 focus:ring-[var(--primary-dark-color)] focus:shadow-none bg-[var(--text-white-black)]`}
        onChange={handleSort}
        value={selectedValue}
      >
        {options?.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortVehiclesDropdown;
