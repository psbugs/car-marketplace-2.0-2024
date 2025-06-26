import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getVehicleOffers } from "../../redux/VehiclesSlice";
import debounce from "lodash/debounce";
import LeasingOrFinanceQuestionAnswer from "./LeasingOrFinanceQuestionAnswer";
import { useTranslation } from "react-i18next";
import {
  convertNumberFormat,
  financingDisclaimer,
  leasingDisclaimer,
} from "../../utils";
import BdkOnlineFinancialCalculator from "./BdkOnlineFinancialCalculator";
import FinancialCalculatorStyledListItem from "../FinancialCalculatorStyledListItem";
import CalculatorFields from "./CalculatorFields";

const BDKFinancingCalculator = ({ vehicleDetails, bankName, currency }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle-id");
  const { uiConfigData } = useSelector((state) => state.uiConfig);
  // eslint-disable-next-line
  const [isOfferError, setOfferError] = useState(false);
  const financingOptions = vehicleDetails?.financingOptions?.[0] || {};
  const leasingOptions = vehicleDetails?.leasingOptions?.[0] || {};
  let totalPrice = vehicleDetails?.consumerPrice?.totalPrice || "";
  let isLeasingOptionsExists =
    Object.keys(leasingOptions).length > 0 ? true : false;
  const hasFinancingOrLeasingOptions =
    Object.keys(financingOptions).length > 0 ||
    Object.keys(leasingOptions).length > 0;

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
    notes = "",
  } = isLeasingOptionsExists ? leasingOptions : financingOptions;
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
  const mileageNumber = parseInt(mileageItem?.replace(/\D/g, ""), 10);
  const formattedNumber = mileageNumber?.toLocaleString("de-DE");
  const formattedMileage = `${formattedNumber} km`;
  const [durationItem, setDurationItem] = useState(`${noOfInstallment} Monate`);
  const [activeTabs, setActiveTab] = useState(
    hasFinancingOrLeasingOptions
      ? {
          isLeasing: true,
          isOnlineFinancing: false,
        }
      : { isLeasing: false, isOnlineFinancing: true },
  );
  const doesProductsExist = Boolean(financingOptions.products);
  const generateOptions = (items = [], suffix) => [
    { label: t("/.Please choose"), value: "" },
    ...items.map((item) => ({ label: `${item} ${suffix}`, value: item })),
  ];
  const mileagesOptions = generateOptions(
    financingOptions?.products?.financialProductItems?.[0]?.mileages || [],
    "km",
  );
  const termsOptions = generateOptions(
    financingOptions?.products?.financialProductItems?.[0]?.terms || [],
    "Monate",
  );
  /* eslint-disable */
  const debouncedFetchCalculateFinanceApiBasedOnParams = useCallback(
    debounce(async () => {
      if (
        typeof leasingOptions == "undefined" &&
        !activeTabs?.isOnlineFinancing &&
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
          const mileageValue = mileagesOptions.find(
            (item) => item.label === mileageItem,
          )?.value;
          if (mileageValue) apiUrl.append("mileage", mileageValue);
        }
        if (productCode) apiUrl.append("product", productCode);
        if (durationItem !== "") {
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

  const tabActivationHandler = (type) => {
    setActiveTab({
      isLeasing: type === 1 ? true : false,
      isOnlineFinancing: type === 2 ? true : false,
    });
  };

  const renderLeasingCalcular = () => {
    return (
      <div className="w-2/4 max-md:w-full">
        <ul className="pr-2 divide-y divide-[var(--primary-dark-color)] space-y-3 text-[15px]">
          <FinancialCalculatorStyledListItem
            prefixLabel={`
            ${t("/vehicleDetails.Leasing example from")}
            ${nameOfBank?.split(",")[0]} ${t("/vehicleDetails.for private and commercial customers")}`}
            value={`${vehicleDetails?.manufacturer?.name} ${vehicleDetails?.model?.name}`}
          />
          <FinancialCalculatorStyledListItem
            label="Net loan amount"
            value={financedAmountValue}
            isNumber
          />
          <FinancialCalculatorStyledListItem
            label="Special leasing payment"
            value={specialPayment}
            isNumber
          />
          {mileageItem && mileageItem !== " km" ? (
            <FinancialCalculatorStyledListItem
              label="Mileage pa"
              value={formattedMileage}
            />
          ) : null}
          <FinancialCalculatorStyledListItem
            label="Less kilometers"
            value={`${leasingLowMileageCompensation} Cent`}
          />
          <FinancialCalculatorStyledListItem
            label="Additional kilometers"
            value={`${leasingExtraMileageCosts} Cent`}
          />
          <FinancialCalculatorStyledListItem
            label="Duration"
            value={durationItem}
          />
          <FinancialCalculatorStyledListItem
            label="monthly financing installments of"
            prefixLabel={noOfInstallment}
            value={`${convertNumberFormat(monthlyInstallmentValue, currency)} ${t("/vehicleDetails.gross")}`}
          />
          <FinancialCalculatorStyledListItem
            label="Debit interest rate pa"
            value={`${nominalInterestRateValue?.toLocaleString(currency?.locale)} %`}
            secondaryValue="fixed for the entire contract period"
          />
          <FinancialCalculatorStyledListItem
            label="Effective annual interest rate"
            value={`${effectiveInterestRateValue?.toLocaleString(currency?.locale)} %`}
          />
          {leasingDestinationCharges && leasingDestinationCharges !== 0 ? (
            <FinancialCalculatorStyledListItem
              label="Transfer costs"
              isNumber
              value={leasingDestinationCharges}
            />
          ) : null}
          {leasingRegistrationFees && leasingRegistrationFees !== 0 ? (
            <FinancialCalculatorStyledListItem
              label="Registration costs"
              isNumber
              value={leasingRegistrationFees}
            />
          ) : null}
          <FinancialCalculatorStyledListItem
            label="Total loan amount"
            isNumber
            value={totalCreditValue}
          />
          <li className="flex justify-between flex-wrap gap-2 pt-3">
            <p>{notes}</p>
          </li>
        </ul>
      </div>
    );
  };

  const renderFinanceCalculator = () => {
    return (
      <div className="w-2/4 max-md:w-full">
        <ul className="pr-2 divide-y divide-[var(--primary-color)] space-y-3 text-[15px]">
          <FinancialCalculatorStyledListItem
            prefixLabel={`
              ${t("/vehicleDetails.Financing example from")}
              ${nameOfBank?.split(",")[0]}`}
            value={`${vehicleDetails?.manufacturer?.name} ${vehicleDetails?.model?.name}`}
          />
          <FinancialCalculatorStyledListItem
            label="Vehicle price"
            isNumber
            value={totalPrice}
          />
          <FinancialCalculatorStyledListItem
            label="Down payment"
            isNumber
            value={advancePaymentValue}
          />
          {mileageItem && mileageItem !== " km" ? (
            <FinancialCalculatorStyledListItem
              label="Mileage pa"
              value={formattedMileage}
            />
          ) : null}
          {durationItem ? (
            <FinancialCalculatorStyledListItem
              label="Duration"
              value={durationItem}
            />
          ) : null}
          <FinancialCalculatorStyledListItem
            prefixLabel={noOfInstallment - 1}
            label="monthly financing installments of"
            isNumber
            value={monthlyInstallmentValue}
          />
          {interestChargesValue && interestChargesValue?.length !== 0 ? (
            <FinancialCalculatorStyledListItem
              postfixLabel={`(${noOfInstallment}.
              Rate)`}
              label="Plus target rate"
              isNumber
              value={interestChargesValue}
            />
          ) : null}
          <FinancialCalculatorStyledListItem
            label="Net loan amount"
            value={financedAmountValue}
            isNumber
          />

          <FinancialCalculatorStyledListItem
            label="Debit interest rate pa"
            value={`${nominalInterestRateValue?.toLocaleString(currency?.locale)} %`}
            secondaryValue="fixed for the entire contract period"
          />
          <FinancialCalculatorStyledListItem
            label="Effective annual interest rate"
            value={`${effectiveInterestRateValue?.toLocaleString(currency?.locale)} %`}
          />
          <FinancialCalculatorStyledListItem
            label="Total loan amount"
            value={totalCreditValue}
            isNumber
          />
        </ul>
      </div>
    );
  };

  const renderLeasingTabCalculator = () => {
    return (
      <div className="flex gap-2 p-4 max-md:flex-col justify-center">
        {activeTabs?.isLeasing && (
          <div className="w-2/4 max-md:w-full">
            <ul className="pr-2 divide-y divide-[var(--primary-color-10)] space-y-3 text-[15px]">
              <FinancialCalculatorStyledListItem
                label="Net loan amount"
                value={financedAmountValue}
                isNumber
              />
              <FinancialCalculatorStyledListItem
                label="Special leasing payment"
                isNumber
                value={specialPayment}
              />
              {mileageItem && mileageItem !== " km" ? (
                <FinancialCalculatorStyledListItem
                  label="Mileage pa"
                  value={formattedMileage}
                />
              ) : null}
              <FinancialCalculatorStyledListItem
                label="Less kilometers"
                value={`${leasingLowMileageCompensation} Cent`}
              />
              <FinancialCalculatorStyledListItem
                label="Additional kilometers"
                value={`${leasingExtraMileageCosts} Cent`}
              />
              <FinancialCalculatorStyledListItem
                label="Duration"
                value={durationItem}
              />
              <FinancialCalculatorStyledListItem
                label="monthly financing installments of"
                prefixLabel={noOfInstallment - 1}
                value={`${convertNumberFormat(monthlyInstallmentValue, currency)} ${t("/vehicleDetails.gross")}`}
              />
              <FinancialCalculatorStyledListItem
                label="Debit interest rate pa"
                value={`${nominalInterestRateValue?.toLocaleString(currency?.locale)} %`}
                secondaryValue="fixed for the entire contract period"
              />
              <FinancialCalculatorStyledListItem
                label="Effective annual interest rate"
                value={`${effectiveInterestRateValue?.toLocaleString(currency?.locale)} %`}
              />
              <FinancialCalculatorStyledListItem
                label="Transfer costs"
                isNumber
                value={leasingDestinationCharges}
              />
              <FinancialCalculatorStyledListItem
                label="Registration costs"
                isNumber
                value={leasingRegistrationFees}
              />
              <FinancialCalculatorStyledListItem
                label="Total loan amount"
                value={totalCreditValue}
                isNumber
              />
              <li className="flex justify-between flex-wrap gap-2 pt-3">
                <p>{notes}</p>
              </li>
            </ul>
          </div>
        )}
        {doesProductsExist && (
          <CalculatorFields
            termsOptions={termsOptions}
            mileagesOptions={mileagesOptions}
            advancePaymentValue={advancePaymentValue}
            setAdvancePaymentValue={setAdvancePaymentValue}
            interestChargesValue={interestChargesValue}
            setInterestChargesValue={setInterestChargesValue}
            durationItem={durationItem}
            setDurationItem={setDurationItem}
            mileageItem={mileageItem}
            setMileageItem={setMileageItem}
          />
        )}
      </div>
    );
  };

  const StyledTabs = ({ activeTab, tabTitle, handler }) => {
    return (
      <div
        className={
          activeTab
            ? "bg-[var(--primary-dark-color)] text-lg text-[var(--text-white-black)] rounded-md py-[10px] border px-8 max-md:text-sm max-md:px-4"
            : "bg-white text-lg rounded-md py-[10px] px-8 primary-color border max-md:text-sm max-md:px-4 cursor-pointer"
        }
        onClick={() => tabActivationHandler(handler)}
      >
        {t(`/vehicleDetails.${tabTitle}`)}
      </div>
    );
  };

  // if (!hasFinancingOrLeasingOptions) return null;

  return (
    <>
      {/* TABS -- Leasing Option/Target Financing or Online Finance Calculator */}
      {hasFinancingOrLeasingOptions ? (
        <div className="flex justify-center gap-2 p-4 pb-9">
          <StyledTabs
            activeTab={activeTabs?.isLeasing}
            tabTitle={
              isLeasingOptionsExists
                ? "Leasing"
                : (interestChargesValue &&
                      interestChargesValue?.length !== 0) ||
                    interestChargesValue === 0
                  ? "Target Financing"
                  : "Basic Financing"
            }
            handler={1}
          />
          <StyledTabs
            activeTab={activeTabs?.isOnlineFinancing}
            tabTitle={
              bankName === "SantanderAustria" || bankName === "Santander"
                ? "Santander Consumer Bank Calculator"
                : "Online Finance Calculator"
            }
            handler={2}
          />
        </div>
      ) : null}
      {/* QUESTION ANSWER BLOCK */}
      <LeasingOrFinanceQuestionAnswer
        question={
          activeTabs?.isLeasing && isLeasingOptionsExists
            ? t("/vehicleDetails.What is leasing?")
            : (interestChargesValue && interestChargesValue?.length !== 0) ||
                interestChargesValue === 0
              ? t("/vehicleDetails.What is target financing?")
              : t("/vehicleDetails.What is basic financing?")
        }
        answer={
          activeTabs?.isLeasing && isLeasingOptionsExists
            ? t(
                "/vehicleDetails.Leasing is a type of 'rental agreement' for a vehicle, which is concluded for an agreed period of time. The vehicle does not become the property of the lessee during the entire contract period. At the end of the contract period, the vehicle is returned to the lessor.",
              )
            : (interestChargesValue && interestChargesValue?.length !== 0) ||
                interestChargesValue === 0
              ? t("/vehicleDetails.withTargetFinancingText")
              : t("/vehicleDetails.withBasicFinancingText")
        }
      />

      {/* LEASING CALCULATOR */}
      <div className="p-2 hidden">
        {renderLeasingTabCalculator()}
        <div className="my-10 border rounded-sm bg-[var(--black-dark-color)] p-4">
          <p className="text-xs">
            {leasingDisclaimer({
              t,
              nameOfBank,
            })}
          </p>
        </div>
      </div>

      <div className="p-2">
        {/* FINANCING AND LEASING CALCULATOR WITH TABS */}
        <div className="flex gap-2 p-4 max-md:flex-col justify-center">
          {activeTabs?.isLeasing
            ? isLeasingOptionsExists
              ? renderLeasingCalcular()
              : renderFinanceCalculator()
            : null}
          {doesProductsExist ? (
            <CalculatorFields
              termsOptions={termsOptions}
              mileagesOptions={mileagesOptions}
              advancePaymentValue={advancePaymentValue}
              setAdvancePaymentValue={setAdvancePaymentValue}
              interestChargesValue={interestChargesValue}
              setInterestChargesValue={setInterestChargesValue}
              durationItem={durationItem}
              setDurationItem={setDurationItem}
              mileageItem={mileageItem}
              setMileageItem={setMileageItem}
            />
          ) : null}
        </div>

        {/* BDK BANK ONLINE FINANING CALCULATOR */}
        <div className="flex gap-2 p-4 max-md:flex-col justify-center">
          {activeTabs?.isOnlineFinancing ? (
            <BdkOnlineFinancialCalculator
              vehicleDetails={vehicleDetails}
              bankName={bankName}
            />
          ) : null}
        </div>
        {/* DISCLAIMER SECTION. IDEAL FOR ALL */}
        <div className="my-10 border rounded-sm bg-[var(--black-dark-color)] p-4">
          <p className="text-xs">
            {isLeasingOptionsExists
              ? leasingDisclaimer({
                  t,
                  nameOfBank,
                })
              : financingDisclaimer({
                  t,
                  nameOfBank,
                })}
          </p>
        </div>
      </div>
    </>
  );
};

export default BDKFinancingCalculator;
