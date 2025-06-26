import { debounce } from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const CalculatorFields = ({
  isFinalInstallment,
  termsOptions = [],
  mileagesOptions = [],
  advancePaymentValue = 0,
  setAdvancePaymentValue,
  interestChargesValue = 0,
  setInterestChargesValue,
  durationItem,
  setDurationItem,
  mileageItem,
  setMileageItem,
}) => {
  const { t } = useTranslation();
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n = false } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };

  const handleSelectChange = (setter) => (event) => {
    const label = event.target.options[event.target.selectedIndex]?.text;
    setter(label === t("/.Please choose") ? "" : label);
  };

  //eslint-disable-next-line
  const advancePaymentValueUpdate = useCallback(
    debounce((newValue) => {
      setAdvancePaymentValue(newValue);
    }, 500),
    [setAdvancePaymentValue],
  );
  //eslint-disable-next-line
  const finalInstallmentValueUpdate = useCallback(
    debounce((newValue) => {
      setInterestChargesValue(newValue);
    }, 500),
    [setInterestChargesValue],
  );

  const StyledSelectDropDown = ({
    htmlFor,
    label,
    value,
    onChange,
    optionArr,
  }) => {
    return (
      <div className="block">
        <label
          htmlFor={htmlFor}
          className="block font-medium text-base text-[var(--text-black-white)] mb-3"
        >
          {t(`/vehicleDetails.${label}`)}
        </label>
        <select
          id={htmlFor}
          className="border border-[#CCCCCC] p-2 text-[#555555] w-full text-sm rounded"
          value={value}
          onChange={onChange}
        >
          {optionArr?.map(({ label }, index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  const StyledInputBox = ({ label, value, onChangeHandler, htmlFor }) => {
    return (
      <div className="block">
        <label
          htmlFor={htmlFor}
          className="block font-medium text-base text-[var(--text-black-white)] mb-3"
        >
          {t(`/vehicleDetails.${label}`)}
        </label>
        <div className="flex-auto flex">
          <span className="bg-[#CCCCCC] w-11 border border-[#CCCCCC] rounded rounded-tr-none rounded-br-none text-sm flex justify-center items-center">
            {currency?.currencySymbol}
          </span>
          <input
            id={htmlFor}
            type="text"
            className="rounded w-full bg-white placeholder:text-[#CCCCCC] border rounded-l-none rounded-r-none focus:ring-0 focus:border-[#CCCCCC] border-[#CCCCCC] text-sm px-4 pr-11 text-black"
            defaultValue={value}
            onChange={(event) => {
              onChangeHandler(event);
            }}
          />
          <span className="bg-[#CCCCCC] w-11 border border-[#CCCCCC] rounded rounded-tl-none rounded-bl-none text-sm flex justify-center items-center">
            ,00
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="border-l border-dashed pl-2 w-2/4 max-md:w-full border-[var(--primary-dark-color)] max-md:border-0 max-md:pl-0 max-md:border-t max-md:pt-2">
      <div className="space-y-3">
        <StyledInputBox
          label="Down payment"
          value={advancePaymentValue}
          key="advancePayment"
          onChangeHandler={(event) => {
            advancePaymentValueUpdate(event.target.value);
          }}
          htmlFor="advancePayment"
        />
        <StyledSelectDropDown
          htmlFor="duration"
          label="Duration"
          value={durationItem}
          onChange={handleSelectChange(setDurationItem)}
          optionArr={termsOptions}
        />{" "}
        {!isFinalInstallment ? (
          <StyledSelectDropDown
            htmlFor="mileage"
            label="Mileage pa"
            value={mileageItem}
            onChange={handleSelectChange(setMileageItem)}
            optionArr={mileagesOptions}
          />
        ) : null}
        {isFinalInstallment ? (
          <StyledInputBox
            label="Final installment"
            value={interestChargesValue}
            key="finalInstallment"
            onChangeHandler={(event) =>
              finalInstallmentValueUpdate(event?.target?.value)
            }
            htmlFor="finalInstallment"
          />
        ) : null}
      </div>
    </div>
  );
};
export default CalculatorFields;
