import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultImg } from "../../constants/common-constants";
import { getVehicleDetails } from "../../redux/VehiclesSlice";
import { getEdgeClass } from "../../utils";

const StyledToastContainer = ({ primaryText, secondaryText, vehicleId }) => {
  const dispatch = useDispatch();
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const { edge } = useSelector((state) => state?.uiConfig);

  useEffect(() => {
    if (vehicleId) {
      dispatch(getVehicleDetails(vehicleId))
        .unwrap()
        .then((res) => setVehicleDetails(res?.data));
    }
  }, [dispatch, vehicleId]);

  return (
    <div>
      <div className="relative flex gap-4 items-center max-md:gap-2">
        <div className={getEdgeClass(edge)}>
          <img
            className={`h-[100px] w-[120px] object-contain ${getEdgeClass(edge, "rounded-2xl")} `}
            src={
              vehicleDetails?.mediaItems &&
              vehicleDetails?.mediaItems?.[0]?.downloadUrl
                ? vehicleDetails?.mediaItems?.[0]?.downloadUrl +
                  "&w=120&h=100&bg=ffffff&q=81"
                : defaultImg
            }
            alt={`${
              vehicleDetails?.manufacturer &&
              vehicleDetails?.manufacturer?.resourceName
            } ${vehicleDetails?.model && vehicleDetails?.model?.name} ${
              vehicleDetails?.modelExtension && vehicleDetails?.modelExtension
            }`}
          />
        </div>
        <div>
          {primaryText} {secondaryText} <br />
          <span className="font-bold">
            {vehicleDetails?.manufacturer &&
              vehicleDetails?.manufacturer?.resourceName}{" "}
            {vehicleDetails?.model && vehicleDetails?.model?.name}{" "}
            {vehicleDetails?.modelExtension && vehicleDetails?.modelExtension}
          </span>
        </div>
      </div>
    </div>
  );
};
export default StyledToastContainer;
