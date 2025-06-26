import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SVGSelector from "../common-components/SVGSelector";
import Tooltip from "../common-components/Tooltip";
import StyledListItem from "./StyledListItem";
import { getEdgeClass } from "../../utils";

const TabInstallmentPriceAndScrollToCalcBtn = ({
  notes,
  installment,
  header,
  scrollToCalculator,
}) => {
  const { t } = useTranslation();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  return (
    <li
      className={`flex items-center max-sm:block text-[var(--text-white-black)] ${uiConfigData?.detailsAppearance?.financialCalculators?.length ? "flex-row-reverse justify-between" : "justify-end"}`}
    >
      {uiConfigData?.detailsAppearance?.financialCalculators?.length ? (
        <span
          className={`text-[16px] flex justify-end items-center cursor-pointer bg-[var(--primary-dark-color)] p-2 max-md:justify-center ${getEdgeClass(edge, "rounded-[4px]")}`}
          onClick={scrollToCalculator}
        >
          <SVGSelector
            name="calculator-svg"
            pathStroke={"currentColor"}
            className="w-7 h-7"
          />
          {t("/vehicleDetails.Calculate rate")}
        </span>
      ) : null}
      <h4 className="text-2xl font-semibold text-[var(--text-black-white)] max-md:text-lg text-right">
        <span
          className={`text-lg flex ${uiConfigData?.detailsAppearance?.financialCalculators?.length ? "justify-start" : "justify-end"} `}
        >
          {" "}
          <sup>
            <Tooltip
              text={
                <ul className="space-y-1 pe-2 overflow-auto custom-scrollbar">
                  <StyledListItem notes={notes} isTooltipContent={true} />
                </ul>
              }
              className={
                "text-ellipsis break-words text-[var(--davy-gray-color)] pt-2"
              }
              spanClassName={
                "!w-[20rem] text-left max-sm:w-[15rem]  max-sm:text-xs max-sm:left-[6rem]"
              }
            >
              <SVGSelector name="i-svg" />
            </Tooltip>
          </sup>
          {header}:{" "}
        </span>
        <span
          className={`text-4xl flex ${uiConfigData?.detailsAppearance?.financialCalculators?.length ? "justify-start" : "justify-end"}`}
        >
          {installment}
        </span>
      </h4>
    </li>
  );
};
export default TabInstallmentPriceAndScrollToCalcBtn;
