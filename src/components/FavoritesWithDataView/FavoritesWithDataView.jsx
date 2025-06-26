import { useDispatch, useSelector } from "react-redux";
import { getVehicleDetails } from "../../redux/VehiclesSlice";
import { useEffect, useRef, useState, useMemo } from "react";
import VehicleFourFeaturesBlock from "../VehicleFourFeaturesBlock";
import { useLocation } from "react-router-dom";
import VehicleListCard from "../../pages/Vehicle/VehicleListCard";

const FavoritesWithDataView = () => {
  const dispatch = useDispatch();
  const { favData } = useSelector((state) => state?.transferCode);
  const favVehicleIdsArr = favData?.items;
  const { search } = useLocation();
  const [loadedImages, setLoadedImages] = useState({});
  const vehIds = useMemo(
    () => favVehicleIdsArr?.map((a) => a?.id) || [],
    [favVehicleIdsArr],
  );
  const requestedIdsRef = useRef(new Set());
  const [vehicleDetailsArray, setVehicleDetailsArray] = useState([]);

  // Fetches vehicle details for vehicles in favorite.
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const results = [];
      for (const vehId of vehIds) {
        if (!requestedIdsRef.current.has(vehId)) {
          requestedIdsRef.current.add(vehId);
          try {
            const res = await dispatch(getVehicleDetails(vehId)).unwrap();
            results?.push(res?.data);
          } catch (error) {
            console.error("Error fetching vehicle details:", error);
          }
        }
      }
      setVehicleDetailsArray((prevArray) => [...prevArray, ...results]);
    };
    if (vehIds?.length > 0) {
      fetchVehicleDetails();
    }
  }, [dispatch, vehIds]);

  const filteredVehicleDetailsArray = vehicleDetailsArray?.filter((item) =>
    vehIds.includes(item?.id),
  );

  // Handles image load state
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-12 max-md:mt-5">
      <ul>
        {filteredVehicleDetailsArray?.map((item, idx) => {
          return (
            <div key={idx}>
              <div className="max-w-max mb-4">
                <VehicleFourFeaturesBlock
                  vehicleDetails={item}
                  isFavoritesPage={true}
                />
              </div>
              <VehicleListCard
                cars={item}
                idx={idx}
                key={item?.id + search}
                loadedImage={loadedImages[item?.id]}
                onImageLoad={handleImageLoad}
                isFavoritesPage={true}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};
export default FavoritesWithDataView;
