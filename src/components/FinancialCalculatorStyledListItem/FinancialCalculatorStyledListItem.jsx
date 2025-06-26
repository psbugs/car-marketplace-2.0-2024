import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { convertNumberFormat } from "../../utils";

const FinancialCalculatorStyledListItem = ({
  prefixLabel,
  postfixLabel,
  label,
  value,
  secondaryValue,
  isNumber,
  isPercentageVal,
}) => {
  const { t } = useTranslation();
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n = false } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  return value || value === 0 ? (
    <li className="flex justify-between flex-wrap gap-2 pt-3">
      <p className="flex-1">
        {prefixLabel ? prefixLabel : null}{" "}
        {label ? t(`/vehicleDetails.${label}`) : null}
        {postfixLabel ? postfixLabel : null}
      </p>
      <div>
        <p className="text-end">
          {isNumber ? convertNumberFormat(value, currency) : value}
          {isPercentageVal ? "%" : null}
        </p>
        {secondaryValue ? (
          <p className="text-sm">{t(`/vehicleDetails.${secondaryValue}`)}</p>
        ) : null}
      </div>
    </li>
  ) : null;
};
export default FinancialCalculatorStyledListItem;
