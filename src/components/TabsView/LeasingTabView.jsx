import { useTranslation } from "react-i18next";
import { convertNumberFormat, leasingDisclaimer } from "../../utils";
import StyledListItem from "./StyledListItem";
import TabInstallmentPriceAndScrollToCalcBtn from "./TabInstallmentPriceAndScrollToCalcBtn";

const LeasingTabView = ({ vehicleDetails, currency, scrollToCalculator }) => {
  const { t } = useTranslation();

  return (
    <>
      <ul className="space-y-1 pe-2">
        {vehicleDetails?.leasingOptions?.[0]?.instalment ? (
          <TabInstallmentPriceAndScrollToCalcBtn
            notes={
              vehicleDetails?.leasingOptions?.[0]?.notes
                ? vehicleDetails?.leasingOptions?.[0]?.notes
                : leasingDisclaimer({
                    t,
                    nameOfBank: vehicleDetails?.leasingOptions?.[0]?.nameOfBank,
                  })
            }
            installment={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.instalment,
              currency,
            )}
            header={t("/vehicles.Leases/month")}
            scrollToCalculator={scrollToCalculator}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.financedAmount ? (
          <StyledListItem
            label={t("/vehicleDetails.Net loan amount")}
            value={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.financedAmount,
              currency,
            )}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.mileagePerYear ? (
          <StyledListItem
            label={t("/vehicleDetails.Mileage p.a.")}
            value={`${convertNumberFormat(vehicleDetails?.leasingOptions?.[0]?.mileagePerYear)} km`}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.leasingLowMileageCompensation ? (
          <StyledListItem
            label={t("/vehicleDetails.Less kilometers")}
            value={`${convertNumberFormat(vehicleDetails?.leasingOptions?.[0]?.leasingLowMileageCompensation)}
          ${t("/vehicleDetails.cents")}`}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.leasingExtraMileageCosts ? (
          <StyledListItem
            label={t("/vehicleDetails.Additional kilometers")}
            value={`${convertNumberFormat(vehicleDetails?.leasingOptions?.[0]?.leasingExtraMileageCosts)}
        ${t("/vehicleDetails.cents")}`}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.numberOfMonths ? (
          <StyledListItem
            label={t("/vehicleDetails.Duration")}
            value={`${vehicleDetails?.leasingOptions?.[0]?.numberOfMonths} ${t(
              "/vehicleDetails.Months",
            )}`}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.nominalInterestRate ? (
          <StyledListItem
            label={t("/vehicleDetails.Nominal interest rate pa")}
            value={`${vehicleDetails?.leasingOptions?.[0]?.nominalInterestRate?.toLocaleString(currency?.locale)}%`}
            additionalText={t(
              "/vehicleDetails.fixed for the entire contract period",
            )}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.effectiveInterestRate ? (
          <StyledListItem
            label={t("/vehicleDetails.Effective annual interest rate")}
            value={`${vehicleDetails?.leasingOptions?.[0]?.effectiveInterestRate?.toLocaleString(currency?.locale)}%`}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.totalCredit ? (
          <StyledListItem
            label={t("/vehicleDetails.Total Amount")}
            value={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.totalCredit,
              currency,
            )}
          />
        ) : null}{" "}
        {vehicleDetails?.leasingOptions?.[0]?.leasingDestinationCharges ? (
          <StyledListItem
            label={t("/vehicleDetails.Transfer costs")}
            value={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.leasingDestinationCharges,
              currency,
            )}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.advancePayment ? (
          <StyledListItem
            label={t("/vehicleDetails.Down payment")}
            value={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.advancePayment,
              currency,
            )}
          />
        ) : null}
        {vehicleDetails?.leasingOptions?.[0]?.leasingResidualValue ? (
          <StyledListItem
            label={t("/vehicleDetails.Residual Value")}
            value={convertNumberFormat(
              vehicleDetails?.leasingOptions?.[0]?.leasingResidualValue,
              currency,
            )}
          />
        ) : null}
      </ul>
    </>
  );
};
export default LeasingTabView;
