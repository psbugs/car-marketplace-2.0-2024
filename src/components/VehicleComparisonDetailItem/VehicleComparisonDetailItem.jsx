import { useTranslation } from "react-i18next";
import { notSpecifiedText } from "../../constants/common-constants";
import SuperscriptScrollToBottom from "../common-components/SuperscriptScrollToBottom";
import { scrollToBottomFunction } from "../../utils";

const VehicleComparisonDetailItem = ({
  label,
  value,
  unit,
  isSuperscript,
  superscriptTitle,
  noBorder,
}) => {
  const { t } = useTranslation();
  let translatedNotSpecifiedText = t(`/vehicleComparison.${notSpecifiedText}`);
  return (
    <div
      className={`${!noBorder && "border-b border-[var(--gray-color)]"} pb-4 mb-5`}
    >
      <label className="text-[var(--primary-dark-color)] font-medium text-sm mb-2 block">
        {label}
      </label>
      <p className="font-medium text-[var(--text-black-white)]">
        {value !== null && typeof value !== "undefined" ? (
          <span>
            {value} {unit && `${unit}`}
            {isSuperscript && (
              <SuperscriptScrollToBottom
                title={superscriptTitle}
                onClick={() => scrollToBottomFunction("main-container")}
              />
            )}
          </span>
        ) : (
          translatedNotSpecifiedText
        )}
      </p>
    </div>
  );
};
export default VehicleComparisonDetailItem;
