import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getVehicleOfferCalculations,
  getVehicleOffers,
} from "../../redux/VehiclesSlice";
import debounce from "lodash/debounce";
import LeasingOrFinanceQuestionAnswer from "./LeasingOrFinanceQuestionAnswer";
import { useTranslation } from "react-i18next";
import {
  convertNumberFormat,
  getEdgeClass,
  leasingDisclaimer,
} from "../../utils";

const BMWFinancialLeasingTypeFinancingCalculator = ({
  vehicleDetails,
  bankName,
  currency,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle-id");
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const [isOfferError, setOfferError] = useState(false);
  const leasingOptions = vehicleDetails?.leasingOptions?.[0] || {};
  /* eslint-disable */
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
    mileagePerYear = "",
    specialPayment = 0,
    leasingLowMileageCompensation = 0,
    leasingExtraMileageCosts = 0,
    leasingRegistrationFees = 0,
    leasingDestinationCharges = 0,
    nameOfBank = "",
    decliningBalance = 0,
    notes = "",
  } = leasingOptions;
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

  const [activeTabs, setActiveTab] = useState({
    isLeasing: false,
    isOnlineFinancing: true,
  });
  // Using toLocaleString directly please do not remove it
  const generateOptions = (items = [], suffix) => [
    { label: t("/.Please choose"), value: "" },
    ...items.map((item) => ({
      label: `${item?.toLocaleString(currency?.locale)} ${suffix}`,
      value: item,
    })),
  ];

  const [mileagesOptionsArr, setMileageOptionsArr] = useState([]);
  const [termsOptionsArr, setTermOptionsArr] = useState([]);

  const debouncedFetchCalculateFinanceApiBasedOnParams = useCallback(
    debounce(async () => {
      if (
        // typeof leasingOptions == "undefined" &&
        durationItem !== "0 Monate" &&
        mileageItem !== "0 km" &&
        durationItem !== "" &&
        mileageItem !== ""
      ) {
        const apiUrl = new URLSearchParams();

        const calculator =
          uiConfigData?.detailsAppearance?.financialCalculators?.[0];
        if (calculator) apiUrl.append("calculator", calculator);

        if (advancePaymentValue) apiUrl.append("deposit", advancePaymentValue);
        if (mileageItem !== "") {
          const mileageValue = mileagesOptionsArr.find(
            (item) => item.label === mileageItem,
          )?.value;
          if (mileageValue) apiUrl.append("mileage", mileageValue);
        }
        if (productCode) apiUrl.append("product", productCode);
        if (durationItem !== "") {
          const termValue = termsOptionsArr.find(
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
      mileagesOptionsArr,
      termsOptionsArr,
    ],
  );

  useEffect(() => {
    // call the offers/parameters api
    let apiParams = { vehicleId };
    dispatch(getVehicleOfferCalculations(apiParams))
      .then((res) => {
        if (res?.payload?.calculations?.length) {
          setMileageOptionsArr(
            generateOptions(
              res?.payload?.calculations[0]?.mileage?.allowedValues,
              "km",
            ),
          );

          setTermOptionsArr(
            generateOptions(
              res?.payload?.calculations[0]?.term?.allowedValues,
              "Monate",
            ),
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    if (
      durationItem !== "0 Monate" &&
      mileageItem !== "0 km" &&
      durationItem !== "" &&
      mileageItem !== "" &&
      mileagesOptionsArr.length > 0 &&
      termsOptionsArr?.length > 0
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
    const selectedValue = event.target.value;
    const label = event.target.options[event.target.selectedIndex]?.text;
    setter(label === t("/.Please choose") ? "" : label);
  };

  const renderLeasingCalculator = () => {
    return (
      <div className="w-2/4 max-md:w-full">
        <ul className="pr-2 divide-y divide-[var(--primary-dark-color)] space-y-3 text-[15px]">
          <li className="flex justify-between flex-wrap gap-2 pt-3">
            <p>{t("/vehicleDetails.Net loan amount")}</p>
            <p className="text-end">
              {isOfferError
                ? ""
                : convertNumberFormat(financedAmountValue, currency)}
            </p>
          </li>
          <li className="flex justify-between flex-wrap gap-2 pt-3">
            <p>{t("/vehicleDetails.Special leasing payment")} </p>
            <p className="text-end">
              {isOfferError
                ? ""
                : convertNumberFormat(specialPayment, currency)}
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
                : `${convertNumberFormat(monthlyInstallmentValue, currency)} ${t("/vehicleDetails.gross")}`}
            </p>
          </li>
          <li className="flex justify-between flex-wrap gap-2 pt-3">
            <p>{t("/vehicleDetails.Effective annual interest rate")}</p>
            <p className="text-end">
              {isOfferError
                ? ""
                : `${effectiveInterestRateValue?.toLocaleString(currency?.locale)} %`}
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
          {decliningBalance && (
            <li className="flex justify-between flex-wrap gap-2 pt-3">
              <p>{t("/vehicleDetails.Residual Value")}</p>
              <p className="text-end">
                {isOfferError
                  ? ""
                  : convertNumberFormat(decliningBalance, currency)}
              </p>
            </li>
          )}
          {notes && (
            <li className="flex justify-between flex-wrap gap-2 pt-3">
              <p>{notes}</p>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return Object.keys(leasingOptions).length > 0 ? (
    <>
      <LeasingOrFinanceQuestionAnswer
        question={t("/vehicleDetails.What is leasing?")}
        answer={t(
          "/vehicleDetails.Leasing is a type of 'rental agreement' for a vehicle, which is concluded for an agreed period of time. The vehicle does not become the property of the lessee during the entire contract period. At the end of the contract period, the vehicle is returned to the lessor.",
        )}
      />
      {/* Using leasing data here */}
      <div className="p-2">
        <div className="flex gap-2 p-4 max-md:flex-col justify-center">
          {renderLeasingCalculator()}
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
                  <span
                    className={`bg-[#CCCCCC] w-11 border border-[#CCCCCC] text-sm flex justify-center items-center ${
                      edge && edge !== "sharp"
                        ? "rounded-[20px] rounded-tr-none rounded-br-none"
                        : ""
                    }`}
                  >
                    {currency?.currencySymbol}
                  </span>
                  <input
                    id="advancePayment"
                    type="text"
                    className="rounded w-full bg-white placeholder:text-[#CCCCCC] border rounded-l-none rounded-r-none focus:ring-0 focus:border-[#CCCCCC] border-[#CCCCCC] text-sm px-4 pr-11 text-black"
                    value={advancePaymentValue}
                    onChange={handleInputChange(setAdvancePaymentValue)}
                  />
                  <span
                    className={`bg-[#CCCCCC] w-11 border border-[#CCCCCC] text-sm flex justify-center items-center ${
                      edge && edge !== "sharp"
                        ? "rounded-[20px] rounded-tr-none rounded-br-none"
                        : ""
                    }`}
                  >
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
                  className={`border border-[#CCCCCC] p-2 text-[#555555] w-full text-sm ${getEdgeClass(edge, "rounded-[20px]")}`}
                  value={durationItem}
                  onChange={handleSelectChange(setDurationItem)}
                >
                  {termsOptionsArr?.length &&
                    termsOptionsArr.map(({ label }, index) => (
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
                  className={`border border-[#CCCCCC] p-2 text-[#555555] w-full text-sm ${getEdgeClass(edge, "rounded-[20px]")}`}
                  value={mileageItem}
                  onChange={handleSelectChange(setMileageItem)}
                >
                  {mileagesOptionsArr?.length &&
                    mileagesOptionsArr?.map(({ label }, index) => (
                      <option key={index} value={label}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`my-10 border ${getEdgeClass(edge, "rounded-sm")} bg-[var(--black-dark-color)] p-4`}
        >
          <p className="text-xs">
            {leasingDisclaimer({
              t,
              nameOfBank,
            })}
          </p>
        </div>
      </div>
    </>
  ) : null;
};

export default BMWFinancialLeasingTypeFinancingCalculator;
