import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateFixedNumbersForTradeInPopup,
  getTradeInFormYears,
} from "../../utils";
import { Field } from "formik";
import { selectClass } from "../../constants/common-constants";
import { useSelector } from "react-redux";

const TradeInRegistrationDateFields = ({ setFieldValue, values, errors }) => {
  const { t } = useTranslation();
  const [monthsOptions] = useState([
    ...generateFixedNumbersForTradeInPopup(12),
  ]);
  const { edge } = useSelector((state) => state.uiConfig);
  const tradeInYears = [...getTradeInFormYears().sort((a, b) => b - a)];
  return (
    <div className="rounded-lg p-4">
      <div className="flex w-full gap-6 max-md:flex-col max-md:gap-2">
        <div className="w-2/4 max-md:w-full">
          <label className="flex items-center mb-4" htmlFor="month">
            {t("/.Initial Registration")}&nbsp;
            <span className="text-red-700 pr-2">*</span>
          </label>
          <div className="flex-auto">
            <Field
              as="select"
              id="month"
              className={`${selectClass(edge)} ${
                errors?.month
                  ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                  : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
              }`}
              name="month"
              required
            >
              <option value="">{t("/vehicles.month")}</option>
              {monthsOptions.map((monthItem, monthIndex) => (
                <option key={monthIndex} value={monthItem}>
                  {monthItem}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="w-2/4 max-md:w-full">
          <label
            className="flex items-center gap-2 mb-4 invisible max-md:hidden"
            htmlFor="year"
          >
            {t("/vehicleDetails.Initial Registration")}
          </label>
          <div className="flex-auto">
            <Field
              as="select"
              id="year"
              className={`${selectClass(edge)} ${
                errors?.year
                  ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                  : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
              }`}
              name="year"
              required
            >
              <option value="">{t("/vehicleDetails.year")}</option>
              {tradeInYears.map((tradeInYear, yearIndex) => (
                <option key={yearIndex} value={tradeInYear}>
                  {tradeInYear}
                </option>
              ))}
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInRegistrationDateFields;
