import { useLocation } from "react-router-dom";
import FuelInformationSection from "../FuelInformationSection";
import VehicleOffers from "../VehicleOffers/VehicleOffers";

const VehicleOffersPortal = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");

  return (
    view === "vehicle-details" && (
      <>
        <VehicleOffers />
        <FuelInformationSection />
      </>
    )
  );
};

export default VehicleOffersPortal;
