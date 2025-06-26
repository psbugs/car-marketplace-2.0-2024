import { useTranslation } from "react-i18next";
import { convertNumberFormat, financingDisclaimer } from "../../utils";
import StyledListItem from "./StyledListItem";
import TabInstallmentPriceAndScrollToCalcBtn from "./TabInstallmentPriceAndScrollToCalcBtn";

const FinanceTabView = ({
  vehicleDetails,
  priceDetails,
  currency,
  scrollToCalculator,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ul className="space-y-1 pe-2 ">
        {vehicleDetails?.financingOptions?.[0]?.numberOfMonths ? (
          <TabInstallmentPriceAndScrollToCalcBtn
            notes={
              vehicleDetails?.financingOptions?.[0]?.notes
                ? vehicleDetails?.financingOptions?.[0]?.notes
                : financingDisclaimer({
                    t,
                    nameOfBank:
                      vehicleDetails?.financingOptions?.[0]?.nameOfBank,
                  })
            }
            installment={convertNumberFormat(
              vehicleDetails?.financingOptions?.[0]?.instalment,
              currency,
            )}
            header={t("/vehicles.Financing/month")}
            scrollToCalculator={scrollToCalculator}
          />
        ) : null}
        {priceDetails?.totalPrice ? (
          <StyledListItem
            label={t("/vehicleDetails.Vehicle price")}
            value={
              <>{convertNumberFormat(priceDetails?.totalPrice, currency)}</>
            }
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.advancePayment ? (
          <StyledListItem
            label={t("/vehicleDetails.Down payment")}
            value={convertNumberFormat(
              vehicleDetails?.financingOptions?.[0]?.advancePayment,
              currency,
            )}
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.numberOfMonths ? (
          <StyledListItem
            label={t("/vehicleDetails.Duration")}
            value={`${
              vehicleDetails?.financingOptions?.[0]?.numberOfMonths
            } ${t("/vehicleDetails.Months")}`}
          />
        ) : null}{" "}
        {vehicleDetails?.financingOptions?.[0]?.numberOfMonths ? (
          <StyledListItem
            label={`${t("/vehicleDetails.Plus target rate")} (${
              vehicleDetails?.financingOptions?.[0]?.numberOfMonths
            }. Rate)`}
            value={convertNumberFormat(
              vehicleDetails?.financingOptions?.[0]?.finalPayment,
              currency,
            )}
          />
        ) : null}{" "}
        {vehicleDetails?.financingOptions?.[0]?.mileagePerYear ? (
          <StyledListItem
            label={t("/vehicleDetails.Mileage p.a.")}
            value={`${convertNumberFormat(vehicleDetails?.financingOptions?.[0]?.mileagePerYear)} km`}
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.financedAmount ? (
          <StyledListItem
            label={t("/vehicleDetails.Net loan amount")}
            value={convertNumberFormat(
              vehicleDetails?.financingOptions?.[0]?.financedAmount,
              currency,
            )}
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.nominalInterestRate ? (
          <StyledListItem
            label={t("/vehicleDetails.Nominal interest rate pa")}
            value={`${vehicleDetails?.financingOptions?.[0]?.nominalInterestRate?.toLocaleString(currency?.locale)} %`}
            additionalText={t(
              "/vehicleDetails.fixed for the entire contract period",
            )}
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.effectiveInterestRate ? (
          <StyledListItem
            label={t("/vehicleDetails.Effective annual interest rate")}
            value={`${vehicleDetails?.financingOptions?.[0]?.effectiveInterestRate?.toLocaleString(currency?.locale)} %`}
          />
        ) : null}
        {vehicleDetails?.financingOptions?.[0]?.totalCredit ? (
          <StyledListItem
            label={t("/vehicleDetails.Total loan amount")}
            value={convertNumberFormat(
              vehicleDetails?.financingOptions?.[0]?.totalCredit,
              currency,
            )}
          />
        ) : null}{" "}
      </ul>
    </>
  );
};
export default FinanceTabView;
