import { useTranslation } from "react-i18next";
import { notSpecifiedText } from "../../constants/common-constants";
import VehicleComparisonDetailItem from "../VehicleComparisonDetailItem";

const VehicleComparisonLocation = ({ vehicle }) => {
  const { t } = useTranslation();
  let translatedNotSpecifiedText = t(`/vehicleComparison.${notSpecifiedText}`);
  return (
    <div>
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Name")}
        value={vehicle?.contact?.name}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Address")}
        value={
          vehicle?.contact?.address1 ||
          vehicle?.contact?.zip ||
          vehicle?.contact?.town ? (
            <>
              <span>
                {" "}
                {vehicle?.contact?.address1 || translatedNotSpecifiedText},{" "}
                <br />
                {vehicle?.contact?.zip || translatedNotSpecifiedText}{" "}
                {vehicle?.contact?.town || translatedNotSpecifiedText}
              </span>
            </>
          ) : (
            translatedNotSpecifiedText
          )
        }
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Telephone")}
        value={vehicle?.contact?.contactTyps?.[0]?.formattedPhone}
      />
      <VehicleComparisonDetailItem
        label={t("/vehicleComparison.Fax")}
        value={vehicle?.contact?.contactTyps?.[0]?.formattedFax}
        noBorder
      />
    </div>
  );
};
export default VehicleComparisonLocation;
