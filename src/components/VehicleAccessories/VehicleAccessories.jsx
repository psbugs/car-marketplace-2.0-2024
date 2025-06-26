import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { priceValue } from "../../constants/common-constants";
import VehicleAccessoriesServiceLister from "../VehicleAccessoriesServiceLister";
// import "./VehicleAccessories.css";

const VehicleAccessories = ({ vehicleDetails, serviceListerDealerId }) => {
  const { edge = false, uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { t } = useTranslation();
  const priceDetails = priceValue({
    consumerPrice: vehicleDetails?.consumerPrice,
    campaignPriceMarket: vehicleDetails?.campaignPriceMarket,
    uiConfigData,
  });
  const currency = () => {
    if (uiConfigData?.priceField === "CampaignPriceMarket") {
      return vehicleDetails?.campaignPriceMarket?.currency
        ? vehicleDetails?.campaignPriceMarket?.currency
        : vehicleDetails?.consumerPrice?.currency;
    } else if (uiConfigData?.priceField === "StandardPrice") {
      return vehicleDetails?.consumerPrice?.currency
        ? vehicleDetails?.consumerPrice?.currency
        : vehicleDetails?.campaignPriceMarket?.currency;
    } else return vehicleDetails?.campaignPriceMarket?.currency;
  };
  const vehicle = {
    data: {
      hsn: vehicleDetails?.hsn,
      tsn: vehicleDetails?.tsn,
      serviceListerDealerId: serviceListerDealerId?.[0]?.dealerId,
      serviceListerSystem: "prod",
      currentPrice: {
        totalPrice: priceDetails?.totalPrice,
        currency: currency(),
      },
      source: "API",
      brand: vehicleDetails?.manufacturer?.name,
      serviceListerSeries: vehicleDetails?.serviceListerSeries,
    },
    id: vehicleDetails?.id,
  };
  return uiConfigData?.serviceLister?.enabled &&
    serviceListerDealerId?.length ? (
    <section className="pxc-accessories-section">
      <div className="pxc-accessories-container">
        <div
          className={`${
            edge && edge !== "sharp" ? "border-radius-20px" : ""
          } pxc-accessories-bg-white-shade`}
        >
          <h3 className="pxc-accessories-h3">
            {t("/vehicleDetails.Accessories")}
          </h3>
          <div className="pxc-accessories-my-6">
            <div id="pxc-accessories">
              <VehicleAccessoriesServiceLister vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : null;
};
export default VehicleAccessories;
