import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { culture } from "../../constants/common-constants";

const VehicleAccessoriesServiceLister = ({ vehicle }) => {
  // eslint-disable-next-line
  const [mode, setMode] = useState("model");
  const domain = "https://selekt.sl-gcp.itt-dev.de/";

  const update = useCallback(() => {
    if (
      vehicle &&
      !vehicle?.data?.serviceListerSeries &&
      vehicle?.data?.hsn &&
      vehicle?.data?.tsn
    ) {
      setMode("hsntsn");
    } else {
      setMode("model");
    }

    if (vehicle?.data?.serviceListerDealerId) {
      // Load external script dynamically
      if (
        !document.querySelector(`script[src="${domain}/static/js/main.js"]`)
      ) {
        const script = document.createElement("script");
        script.src = `${domain}/static/js/main.js`;
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [vehicle]);

  useEffect(() => {
    update();
  }, [update]);

  const { vehicleDetailsHeaders } = useSelector((state) => state.vehicles);
  const environment = vehicleDetailsHeaders?.["x-environment"];

  return (
    <>
      {domain && (
        <link rel="stylesheet" href={`${domain}/static/css/main.css`} />
      )}
      {domain && (
        <div
          className="relative z-0"
          id="itt-sl-ucl"
          data-dealerid={vehicle?.data?.serviceListerDealerId}
          data-price={vehicle?.data?.currentPrice?.totalPrice || "0"}
          data-brand={vehicle?.data?.brand}
          data-intent="pixelconcept"
          data-currencycode={vehicle?.data?.currentPrice?.currency || "0"}
          data-language={culture}
          data-storageid={`${environment || "AM"}_${vehicle?.id}`}
          attributes-for-service-lister={JSON.stringify(vehicle)}
          data-hsn={vehicle?.hsn}
          data-tsn={vehicle?.tsn}
          data-series={vehicle?.data?.serviceListerSeries}
          data-cartdisabled={true}
        />
      )}
    </>
  );
};

export default VehicleAccessoriesServiceLister;
