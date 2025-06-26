import React, { useEffect } from "react";
import SwiperImageWithContent from "../common-components/SwiperImageWithContent";
import { useTranslation } from "react-i18next";
import { getVehicleSimilar } from "../../redux/VehiclesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const VehicleOffers = () => {
  const { t } = useTranslation();
  const { vehicleSimilar } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const vehicleId = parseInt(queryParams.get("vehicle-id"));

  // Get similar vehicles
  useEffect(() => {
    if (vehicleId) {
      dispatch(getVehicleSimilar(vehicleId));
    }
  }, [dispatch, vehicleId]);

  if (
    !vehicleSimilar?.length ||
    (vehicleSimilar?.length === 1 && vehicleSimilar?.[0]?.id === vehicleId)
  )
    return null;
  return (
    <section className="pt-8 mb-14 max-md:my-5">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <h3 className="text-[var(--primary-dark-color)] font-semibold text-2xl max-md:text-lg pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
          {t("/vehicleDetails.You may also be interested in these vehicles")}
        </h3>
        <div className="mt-6">
          <SwiperImageWithContent
            data={vehicleSimilar}
            pagination={false}
            mouseWheel={false}
            spaceBetween={0}
            isShowButton={true}
            isShowContentSection={true}
          />
        </div>
      </div>
    </section>
  );
};

export default VehicleOffers;
