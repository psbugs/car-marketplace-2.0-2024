import { useSelector } from "react-redux";
import { notSpecifiedText, priceValue } from "../../constants/common-constants";
import {
  convertNumberFormat,
  extractMonthAndYear,
  scrollToBottomFunction,
} from "../../utils";
import SuperscriptScrollToBottom from "../common-components/SuperscriptScrollToBottom";
import { useTranslation } from "react-i18next";
import VehicleComparisonDetailItem from "../VehicleComparisonDetailItem";

const VehicleComparisonVehicleData = ({ vehicle }) => {
  const { t } = useTranslation();
  const { uiConfigData } = useSelector((state) => state.uiConfig);
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  const priceDetails = priceValue({
    consumerPrice: vehicle?.consumerPrice,
    campaignPriceMarket: vehicle?.campaignPriceMarket,
    uiConfigData,
  });
  let translatedNotSpecifiedText = t(`/vehicleComparison.${notSpecifiedText}`);
  return (
    <div>
      <div className="border-b border-[var(--gray-color)] pb-2  mb-2">
        <label className="text-[var(--primary-dark-color)] font-medium text-sm mb-2 block ">
          {t("/.Price")}
        </label>
        {priceDetails?.totalPrice ? (
          <div className="flex">
            <p className="font-medium text-[var(--text-black-white)]">
              {convertNumberFormat(priceDetails?.totalPrice, currency)}
            </p>
            &nbsp;
            <span className="text-[var(--text-black-white)]">
              {t("/vehicleDetails.Gross")}
              {priceDetails?.vatDeductible ? (
                <SuperscriptScrollToBottom
                  title={"i"}
                  onClick={() => scrollToBottomFunction("main-container")}
                />
              ) : null}
            </span>
          </div>
        ) : (
          translatedNotSpecifiedText
        )}
        {priceDetails?.netPrice ? (
          <div className="flex">
            <p className="font-medium text-[var(--text-black-white)]">
              {convertNumberFormat(priceDetails?.netPrice, currency)}
            </p>
            &nbsp;
            <span className="text-[var(--text-black-white)]">
              {t("/vehicleDetails.Net")}
            </span>
          </div>
        ) : (
          translatedNotSpecifiedText
        )}
      </div>
      <VehicleComparisonDetailItem
        label={t("/.Offer number")}
        value={`${vehicle?.kuerzel || ""}${vehicle?.orderNumber || ""}`}
      />
      <VehicleComparisonDetailItem
        label={t("/.Vehicle Type")}
        value={vehicle?.previousUsageType?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicles.Mileage")}
        value={convertNumberFormat(vehicle?.mileage)}
        unit="km"
      />
      <VehicleComparisonDetailItem
        label={t("/vehicles.Displacement")}
        value={convertNumberFormat(vehicle?.cubicCapacity)}
        unit="cm³"
      />
      <VehicleComparisonDetailItem
        label={t("/.Performance")}
        value={
          vehicle?.kw ? (
            <>
              {vehicle.kw} kW
              {vehicle.hp && (
                <>
                  {" "}
                  ({vehicle.hp} {t("/vehicles.HP")})
                </>
              )}
            </>
          ) : (
            translatedNotSpecifiedText
          )
        }
      />
      <VehicleComparisonDetailItem
        label={t("/.Fuel")}
        value={vehicle?.fuel?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Gearbox")}
        value={vehicle?.gearbox?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/.Color")}
        value={vehicle?.paintColor}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleDetails.Cushion")}
        value={
          vehicle?.seatCover
            ? vehicle?.seatCover
            : (vehicle?.seatCoverMaterial?.name || translatedNotSpecifiedText,
              vehicle?.seatCoverBaseColor?.name || translatedNotSpecifiedText)
        }
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Inspection Date")}
        value={
          vehicle?.dateOfNextTechnicialInspection?.date &&
          extractMonthAndYear(vehicle?.dateOfNextTechnicialInspection?.date)
        }
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Number of doors")}
        value={vehicle?.doorsCount}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Number of seats")}
        value={vehicle?.seatCount}
      />
      <VehicleComparisonDetailItem
        label={"HSN/TSN"}
        value={
          <>
            <span>
              {vehicle?.hsn ? vehicle?.hsn : translatedNotSpecifiedText}/
            </span>
            <span>
              {vehicle?.tsn ? vehicle?.tsn : translatedNotSpecifiedText}
            </span>
          </>
        }
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Pollutant class")}
        value={vehicle?.emissionClass?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Environmental badge")}
        value={vehicle?.environmentBadge?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleDetails.Energy consumption (combined)")}
        value={convertNumberFormat(vehicle?.wltpFuelConsumptionCombined)}
        unit="l/100km"
        isSuperscript
        superscriptTitle={"ii"}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleDetails.CO₂ emissions (combined)")}
        value={vehicle?.wltpCo2EmissionCombined}
        unit="g/km"
        isSuperscript
        superscriptTitle={"ii"}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleDetails.CO₂ class (combined)")}
        value={vehicle?.wltpCo2ClassCombined}
        isSuperscript
      />
      <VehicleComparisonDetailItem
        label={t(
          "/vehicleComparison.Fuel consumption (with discharged battery)",
        )}
        value={vehicle?.wltpCo2ClassDischarged}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleDetails.Electric range")}
        value={vehicle?.wltpElectricRange}
        unit={"km"}
        isSuperscript
        superscriptTitle={"ii"}
        noBorder
      />
    </div>
  );
};
export default VehicleComparisonVehicleData;
