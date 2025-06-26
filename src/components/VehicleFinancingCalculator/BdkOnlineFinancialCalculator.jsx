import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleOffers } from "../../redux/VehiclesSlice";
import { convertNumberFormat } from "../../utils";
import FinancialCalculatorStyledListItem from "../FinancialCalculatorStyledListItem";
import CalculatorFields from "./CalculatorFields";

const BdkOnlineFinancialCalculator = ({ vehicleDetails, bankName }) => {
  const { detailsAppearance = {} } = useSelector(
    (state) => state.uiConfig?.uiConfigData,
  );
  const uiconfigCalculatorSettings =
    detailsAppearance?.financialCalculatorSettings?.[0];
  const calculator = detailsAppearance?.financialCalculators?.[0];
  const dispatch = useDispatch();

  const { vehicleOffers } = useSelector((state) => state.vehicles);

  const {
    finalPayment = 0,
    instalment = 0,
    interestRateEffective = 0,
    interestRatePerYear = 0,
    netLoanAmount = 0,
    termUsed,
    totalLoanAmount = 0,
  } = vehicleOffers || {};

  const vehiclePrice = vehicleDetails?.consumerPrice?.totalPrice;
  const santanderBank =
    bankName === "SantanderAustria" || bankName === "Santander";

  const [downPayment, setDownPayment] = useState(
    (vehiclePrice * uiconfigCalculatorSettings?.defaultDeposit) / 100,
  );
  const [finalInstallment, setFinalInstallment] = useState(
    (vehiclePrice * uiconfigCalculatorSettings?.defaultDeposit * 2) / 100,
  );
  const [durationItem, setDurationItem] = useState(
    `${termUsed || (santanderBank ? 48 : 36)} Monate`,
  );
  const financingOptions = vehicleDetails?.financingOptions?.[0] || {};
  const leasingOptions = vehicleDetails?.leasingOptions?.[0] || {};
  let isLeasingOptionsExists =
    Object.keys(leasingOptions).length > 0 ? true : false;
  const mileagePerYear = isLeasingOptionsExists
    ? leasingOptions?.mileagePerYear
    : financingOptions?.mileagePerYear;

  const [mileageItem, setMileageItem] = useState(
    `${convertNumberFormat(mileagePerYear)} km`,
  );
  /* eslint-disable */
  const mileagesOptions = [
    { label: `${convertNumberFormat(10000)} km`, value: 10000 },
    { label: `${convertNumberFormat(15000)} km`, value: 15000 },
    { label: `${convertNumberFormat(20000)} km`, value: 20000 },
    { label: `${convertNumberFormat(25000)} km`, value: 25000 },
    { label: `${convertNumberFormat(30000)} km`, value: 30000 },
    { label: `${convertNumberFormat(35000)} km`, value: 35000 },
    { label: `${convertNumberFormat(40000)} km`, value: 40000 },
    { label: `${convertNumberFormat(45000)} km`, value: 45000 },
    { label: `${convertNumberFormat(50000)} km`, value: 50000 },
  ];
  /* eslint-disable */
  const termsOptions = [
    { label: `12 Monate`, value: 12 },
    { label: `24 Monate`, value: 24 },
    { label: `36 Monate`, value: 36 },
    { label: `48 Monate`, value: 48 },
    { label: `54 Monate`, value: 54 },
    { label: `60 Monate`, value: 60 },
    { label: `72 Monate`, value: 72 },
    { label: `84 Monate`, value: 84 },
  ];
  const debouncedFetchCalculateFinanceApiBasedOnParams = useCallback(
    debounce(async () => {
      if (durationItem !== "0 Monate" && durationItem !== "") {
        const apiUrl = new URLSearchParams();

        if (calculator) apiUrl.append("calculator", calculator);
        if (downPayment) apiUrl.append("deposit", downPayment);
        if (finalInstallment) apiUrl.append("balloon", finalInstallment);
        if (mileageItem !== "") {
          const mileageValue = mileagesOptions?.find(
            (item) => item.label === mileageItem,
          )?.value;
          if (mileageValue) apiUrl.append("mileage", mileageValue);
        }
        // if (mileageItem) apiUrl.append("mileage", mileageItem);
        if (durationItem !== "") {
          const termValue = termsOptions?.find(
            (item) => item.label === durationItem,
          )?.value;
          if (termValue) apiUrl.append("term", termValue);
        }

        apiUrl.append("product", santanderBank ? "pl" : "ac");
        const url = apiUrl.toString();
        const params = { appendedUrl: url, vehicleId: vehicleDetails?.id };

        if (params && vehicleDetails) {
          dispatch(getVehicleOffers(params));
        }
      }
    }, 500),
    [downPayment, durationItem, finalInstallment, mileageItem],
  );

  useEffect(() => {
    if (
      durationItem !== "0 Monate" &&
      durationItem !== "" &&
      downPayment !== ""
    ) {
      debouncedFetchCalculateFinanceApiBasedOnParams();
    }
    return () => debouncedFetchCalculateFinanceApiBasedOnParams.cancel();
  }, [durationItem, downPayment, finalInstallment, mileageItem]);

  return (
    <>
      <div className="w-2/4 max-md:w-full">
        <ul className="pr-2 divide-y divide-[var(--primary-dark-color)] space-y-3 text-[15px]">
          <FinancialCalculatorStyledListItem
            label="MonthlyRate"
            isNumber
            value={instalment}
          />
          <FinancialCalculatorStyledListItem
            label="Nominal interest rate pa"
            secondaryValue="fixed for the entire contract period"
            value={parseFloat(interestRatePerYear?.toFixed(2))}
            isPercentageVal={true}
          />
          <FinancialCalculatorStyledListItem
            label="Effective annual interest rate"
            value={parseFloat(interestRateEffective?.toFixed(2))}
            isPercentageVal={true}
          />
          <FinancialCalculatorStyledListItem
            label="Final installment"
            value={finalPayment}
            isNumber
          />
          <FinancialCalculatorStyledListItem
            label="Duration"
            value={durationItem}
          />
          {mileageItem && mileageItem !== "0,000 km" ? (
            <FinancialCalculatorStyledListItem
              label="Mileage pa"
              value={mileageItem}
            />
          ) : null}
          <FinancialCalculatorStyledListItem
            label="Net loan amount"
            value={netLoanAmount}
            isNumber
          />
          <FinancialCalculatorStyledListItem
            label="Total loan amount"
            value={totalLoanAmount}
            isNumber
          />
        </ul>
      </div>
      <CalculatorFields
        isFinalInstallment={santanderBank ? false : true}
        termsOptions={termsOptions}
        advancePaymentValue={downPayment}
        setAdvancePaymentValue={setDownPayment}
        interestChargesValue={finalInstallment}
        setInterestChargesValue={setFinalInstallment}
        durationItem={durationItem}
        setDurationItem={setDurationItem}
        mileageItem={mileageItem}
        setMileageItem={setMileageItem}
        mileagesOptions={mileagesOptions}
      />
    </>
  );
};
export default BdkOnlineFinancialCalculator;
