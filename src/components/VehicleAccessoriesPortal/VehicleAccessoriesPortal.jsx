import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Preloader from "../../components/Preloader";
import VehicleAccessories from "../../components/VehicleAccessories";

const VehicleAccessoriesPortal = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { vehicleDetails, loading } = useSelector((state) => state.vehicles);
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};

  const view = queryParams.get("view");

  const serviceListerDealerId = uiConfigData?.serviceLister?.entries?.filter(
    (a) => a?.manufacturerId === vehicleDetails?.manufacturer?.id,
  );
  const accessoriesRef = useRef(null);
  const { isAccessoriesScrolled } = useSelector((state) => state?.vehicles);

  const scrollToAccessories = () => {
    if (accessoriesRef.current) {
      accessoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isAccessoriesScrolled) {
      scrollToAccessories();
    }
  }, [isAccessoriesScrolled]);

  return (
    view === "vehicle-details" && (
      <>
        {loading && <Preloader />}
        <div
          ref={accessoriesRef}
          id="pxc-accessories-section"
          className="pxc-accessories-section"
        >
          <VehicleAccessories
            vehicleDetails={vehicleDetails}
            serviceListerDealerId={serviceListerDealerId}
          />
        </div>
      </>
    )
  );
};

export default VehicleAccessoriesPortal;
