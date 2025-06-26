import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getVehicleOffers } from "../../redux/VehiclesSlice";
import { convertNumberFormat, financingDisclaimer } from "../../utils";
import LeasingOrFinanceQuestionAnswer from "./LeasingOrFinanceQuestionAnswer/LeasingOrFinanceQuestionAnswer";
import debounce from "lodash/debounce";
import { priceValue } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";

const BMWFinancingCalculator = ({ vehicleDetails, bankName, currency }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle-id");
  const { uiConfigData } = useSelector((state) => state.uiConfig);
  const [isOfferError, setOfferError] = useState(false);
  const financingOptions = vehicleDetails?.financingOptions?.[0] || {};
  const priceDetails = priceValue({
    consumerPrice: vehicleDetails?.consumerPrice,
    campaignPriceMarket: vehicleDetails?.campaignPriceMarket,
    uiConfigData,
  });
  let totalPrice =
    priceDetails?.totalPrice &&
    convertNumberFormat(priceDetails?.totalPrice, currency);

  const {
    financialProductCode: productId = "",
    advancePayment = "",
    effectiveInterestRate = 0,
    nominalInterestRate = 0,
    instalment: monthlyInstallment = 0,
    finalPayment: interestCharges = 0,
    numberOfMonths: noOfInstallment = 0,
    financedAmount = "",
    totalCredit = 0,
    mileagePerYear = 0,
  } = financingOptions;
  const productCode = productId;

  const [advancePaymentValue, setAdvancePaymentValue] =
    useState(advancePayment);
  const [effectiveInterestRateValue, setEffectiveInterestRateValue] = useState(
    effectiveInterestRate,
  );
  const [nominalInterestRateValue, setNominalInterestRateValue] =
    useState(nominalInterestRate);
  const [monthlyInstallmentValue, setMonthlyInstallmentValue] =
    useState(monthlyInstallment);
  const [interestChargesValue, setInterestChargesValue] =
    useState(interestCharges);
  const [financedAmountValue, setFinancedAmountValue] =
    useState(financedAmount);
  const [totalCreditValue, setTotalCreditValue] = useState(totalCredit);
  const [mileageItem, setMileageItem] = useState(`${mileagePerYear} km`);
  const [durationItem, setDurationItem] = useState(`${noOfInstallment} Monate`);

  const doesProductsExist = Boolean(financingOptions.products);

  const generateOptions = (items = [], suffix) => [
    { label: t("/.Please choose"), value: "" },
    ...items.map((item) => ({ label: `${item} ${suffix}`, value: item })),
  ];

  const mileagesOptions = useMemo(() => {
    if (!financingOptions?.products) return null;

    return generateOptions(
      financingOptions?.products?.financialProductItems?.[0]?.mileages || [],
      "km",
    );
  }, [financingOptions]);

  const termsOptions = useMemo(() => {
    if (!financingOptions?.products) return null;

    return generateOptions(
      financingOptions?.products?.financialProductItems?.[0]?.terms || [],
      "Monate",
    );
  }, [financingOptions]);

  /*eslint-disable */
  const debouncedFetchCalculateFinanceApiBasedOnParams = useCallback(
    debounce(async () => {
      if (
        durationItem !== "0 km" &&
        mileageItem !== "0 Monate" &&
        durationItem !== "" &&
        mileageItem !== "" &&
        termsOptions
      ) {
        const apiUrl = new URLSearchParams();

        const calculator =
          uiConfigData?.detailsAppearance?.financialCalculators?.[0];
        if (calculator) apiUrl.append("calculator", calculator);

        if (advancePaymentValue) apiUrl.append("deposit", advancePaymentValue);
        if (mileageItem !== "" && mileageItem !== "0 km") {
          const mileageValue = mileagesOptions.find(
            (item) => item.label === mileageItem,
          )?.value;
          if (mileageValue) apiUrl.append("mileage", mileageValue);
        }
        if (productCode) apiUrl.append("product", productCode);
        if (durationItem !== "" && durationItem !== "0 Monate") {
          const termValue = termsOptions.find(
            (item) => item.label === durationItem,
          )?.value;
          if (termValue) apiUrl.append("term", termValue);
        }

        const url = apiUrl.toString();
        const params = { appendedUrl: url, vehicleId };

        try {
          const response = await dispatch(getVehicleOffers(params)).unwrap();
          // Update state with response values
          setOfferError(false);
          setAdvancePaymentValue(response?.deposit || "");
          setMonthlyInstallmentValue(response?.instalment || 0);
          setInterestChargesValue(response?.finalPayment || 0);
          setFinancedAmountValue(response?.netLoanAmount || "");
          setTotalCreditValue(response?.totalLoanAmount || 0);
          setEffectiveInterestRateValue(response?.interestRatePerYear || 0);
          setNominalInterestRateValue(response?.interestRateEffective || 0);
        } catch (error) {
          setOfferError(true);
          console.error(error);
        }
      }
    }, 500),
    [
      advancePaymentValue,
      durationItem,
      mileageItem,
      productCode,
      uiConfigData,
      dispatch,
      vehicleId,
      mileagesOptions,
      termsOptions,
    ],
  );

  useEffect(() => {
    if (
      durationItem !== "0 Monate" &&
      mileageItem !== "0 km" &&
      durationItem !== "" &&
      mileageItem !== ""
    ) {
      debouncedFetchCalculateFinanceApiBasedOnParams();
      // Cleanup function to cancel the debounce on component unmount
      return () => debouncedFetchCalculateFinanceApiBasedOnParams.cancel();
    }
  }, [
    advancePaymentValue,
    durationItem,
    mileageItem,
    productCode,
    debouncedFetchCalculateFinanceApiBasedOnParams,
  ]);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSelectChange = (setter) => (event) => {
    const label = event.target.options[event.target.selectedIndex]?.text;
    setter(label === t("/.Please choose") ? "" : label);
  };

  return Object.keys(financingOptions).length > 0 ? (
    <>
      <LeasingOrFinanceQuestionAnswer
        question={
          interestChargesValue && interestChargesValue?.length !== 0
            ? t("/vehicleDetails.What is target financing?")
            : t("/vehicleDetails.What is basic financing?")
        }
        answer={
          interestChargesValue && interestChargesValue?.length !== 0
            ? t("/vehicleDetails.withTargetFinancingText")
            : t("/vehicleDetails.withBasicFinancingText")
        }
      />
      <div className="p-2">
        <div className="flex gap-2 p-4 max-md:flex-col justify-center">
          <div className="w-2/4 max-md:w-full">
            <ul className="pr-2 divide-y divide-[var(--primary-color-10)] space-y-3 text-[15px]">
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>
                  {t("/vehicleDetails.Financing example from")} {bankName}
                </p>
                <p className="text-end">{bankName}</p>
              </li>
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{t("/vehicleDetails.Vehicle price")}</p>
                <p className="text-end">{isOfferError ? "" : totalPrice}</p>
              </li>
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{t("/vehicleDetails.Down payment")}</p>
                <p className="text-end">
                  {isOfferError
                    ? ""
                    : convertNumberFormat(advancePaymentValue, currency)}
                </p>
              </li>
              {mileageItem && (
                <li className="flex justify-between flex-wrap gap-2 pt-3">
                  <p>{t("/vehicleDetails.Mileage pa")}</p>
                  <p className="text-end">{isOfferError ? "" : mileageItem}</p>
                </li>
              )}
              {durationItem && (
                <li className="flex justify-between flex-wrap gap-2 pt-3">
                  <p>{t("/vehicleDetails.Duration")}</p>
                  <p className="text-end">{isOfferError ? "" : durationItem}</p>
                </li>
              )}
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>
                  {noOfInstallment - 1}&nbsp;
                  {t("/vehicleDetails.monthly financing installments of")}
                </p>
                <p className="text-end">
                  {isOfferError
                    ? ""
                    : convertNumberFormat(monthlyInstallmentValue, currency)}
                </p>
              </li>
              {interestChargesValue && interestChargesValue !== 0 ? (
                <li className="flex justify-between flex-wrap gap-2 pt-3">
                  <p>
                    {t("/vehicleDetails.Plus target rate")} ({noOfInstallment}th
                    rate)
                  </p>
                  <p className="text-end">
                    {isOfferError
                      ? ""
                      : convertNumberFormat(interestChargesValue, currency)}
                  </p>
                </li>
              ) : null}
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{t("/vehicleDetails.Net loan amount")}</p>
                <p className="text-end">
                  {isOfferError
                    ? ""
                    : convertNumberFormat(financedAmountValue, currency)}
                </p>
              </li>
              <li className="flex  justify-between  flex-wrap gap-2 pt-3">
                <div>
                  <p>{t("/vehicleDetails.Debit interest rate pa")}</p>
                </div>
                <div className="text-end">
                  <p>
                    {isOfferError
                      ? ""
                      : `${effectiveInterestRateValue?.toLocaleString(currency?.locale)} %`}
                  </p>
                  <p className="text-sm">
                    {t("/vehicleDetails.fixed for the entire contract period")}
                  </p>
                </div>
              </li>
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{t("/vehicleDetails.Effective annual interest rate")}</p>
                <p className="text-end">
                  {isOfferError
                    ? ""
                    : `${nominalInterestRateValue?.toLocaleString(currency?.locale)} %`}
                </p>
              </li>
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{t("/vehicleDetails.Total loan amount")}</p>
                <p className="text-end">
                  {isOfferError
                    ? ""
                    : convertNumberFormat(totalCreditValue, currency)}
                </p>
              </li>
            </ul>
          </div>
          {doesProductsExist && (
            <div className="border-l border-dashed pl-2 w-2/4 max-md:w-full border-[var(--primary-dark-color)] max-md:border-0 max-md:pl-0 max-md:border-t max-md:pt-2">
              <div className="space-y-3">
                <div className="block">
                  <label
                    htmlFor="advancePayment"
                    className="block font-medium text-base text-[var(--text-black-white)] mb-3"
                  >
                    {t("/vehicleDetails.Down payment")}
                  </label>
                  <div className="flex-auto flex">
                    <span className="bg-[#CCCCCC] w-11 border border-[#CCCCCC] rounded rounded-tr-none rounded-br-none text-sm flex justify-center items-center">
                      {currency?.currencySymbol}
                    </span>
                    <input
                      id="advancePayment"
                      type="text"
                      className="rounded w-full bg-white placeholder:text-[var(--davy-gray-color)] bg-[var(--white-dark-shade)] border rounded-l-none rounded-r-none focus:ring-0 focus:border-[#CCCCCC] border-[#CCCCCC] text-sm px-4 pr-11 text-black"
                      value={advancePaymentValue}
                      onChange={handleInputChange(setAdvancePaymentValue)}
                    />
                    <span className="bg-[#CCCCCC] w-11 border border-[#CCCCCC] rounded rounded-tl-none rounded-bl-none text-sm flex justify-center items-center">
                      ,00
                    </span>
                  </div>
                </div>
                <div className="block">
                  <label
                    htmlFor="duration"
                    className="block font-medium text-base text-[var(--text-black-white)] mb-3"
                  >
                    {t("/vehicleDetails.Duration")}
                  </label>
                  <select
                    id="duration"
                    className="border border-[#CCCCCC] p-2 text-[#555555] w-full text-sm rounded"
                    value={durationItem}
                    onChange={handleSelectChange(setDurationItem)}
                  >
                    {termsOptions.map(({ label }, index) => (
                      <option key={index} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="block">
                  <label
                    htmlFor="mileage"
                    className="block font-medium text-base text-[var(--text-black-white)] mb-3"
                  >
                    {t("/vehicleDetails.Mileage pa")}
                  </label>
                  <select
                    id="mileage"
                    className="border border-[#CCCCCC] p-2 text-[#555555] w-full text-sm rounded"
                    value={mileageItem}
                    onChange={handleSelectChange(setMileageItem)}
                  >
                    {mileagesOptions.map(({ label }, index) => (
                      <option key={index} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="my-10 border rounded-sm bg-[var(--black-dark-color)] p-4">
          <p className="text-xs">
            {financingDisclaimer({
              t,
              nameOfBank: vehicleDetails?.financingOptions?.[0]?.nameOfBank,
            })}
          </p>
        </div>
      </div>
    </>
  ) : null;
};

export default BMWFinancingCalculator;
