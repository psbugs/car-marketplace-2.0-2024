import React from "react";
import { defaultImg, priceValue } from "../../constants/common-constants";
import { useSelector } from "react-redux";
import { convertNumberFormat } from "../../utils";
import { useLocation } from "react-router-dom";

const VehicleDetailCommonWrap = ({ vehicleDetails, isTradeInForm }) => {
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };

  const priceDetails = priceValue({
    consumerPrice: vehicleDetails?.consumerPrice,
    campaignPriceMarket: vehicleDetails?.campaignPriceMarket,
    uiConfigData,
  });
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");
  if (isTradeInForm && view !== "vehicle-details") return null;
  return (
    <div
      className={`flex gap-2 ${isTradeInForm ? "mt-6" : "justify-center items-center"}`}
    >
      <img
        src={
          vehicleDetails?.mediaItems &&
          vehicleDetails?.mediaItems?.[0]?.downloadUrl
            ? vehicleDetails?.mediaItems?.[0]?.downloadUrl +
              "&w=120&h=100&bg=ffffff&q=81"
            : defaultImg
        }
        alt={vehicleDetails?.manufacturer?.name}
        loading="lazy"
      />
      <div className="flex flex-col gap-2 pt-3">
        <span className="font-semibold text-lg leading-6">
          {" "}
          {vehicleDetails?.manufacturer?.name} {vehicleDetails?.model?.name}{" "}
          {vehicleDetails?.modelExtension}
        </span>
        {priceDetails?.totalPrice ? (
          <span className="text-lg">
            {convertNumberFormat(priceDetails?.totalPrice, currency)}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default VehicleDetailCommonWrap;
