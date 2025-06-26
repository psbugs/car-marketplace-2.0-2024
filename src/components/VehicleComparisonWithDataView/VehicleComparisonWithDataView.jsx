import { useDispatch, useSelector } from "react-redux";
import { getVehicleDetails } from "../../redux/VehiclesSlice";
import { useRef, useMemo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VehicleComparisonCard from "../VehicleComparisonCard";
import StyledBottomBorderTabs from "../common-components/StyledBottomBorderTabs";
import { useTranslation } from "react-i18next";
import { getEdgeClass } from "../../utils";

const VehicleComparisonWithDataView = () => {
  const dispatch = useDispatch();
  const { comparablesData } = useSelector((state) => state?.transferCode);
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const comparableVehicleIdsArr = comparablesData?.items;
  const comparableVehicleIds = useMemo(
    () => comparableVehicleIdsArr?.map((a) => a?.id) || [],
    [comparableVehicleIdsArr],
  );
  const requestedIdsRef = useRef(new Set());
  const [vehicleDetailsArray, setVehicleDetailsArray] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicle-data");
  const { t } = useTranslation();
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const results = [];
      for (const vehId of comparableVehicleIds) {
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
    if (comparableVehicleIds?.length > 0) {
      fetchVehicleDetails();
    }
  }, [dispatch, comparableVehicleIds]);

  const filteredVehicleDetailsArray = vehicleDetailsArray?.filter((item) =>
    comparableVehicleIds?.includes(item?.id),
  );

  const [filteredVehiclesInComparison, setFilteredVehiclesInComparison] =
    useState([]);

  useEffect(() => {
    if (filteredVehicleDetailsArray && filteredVehicleDetailsArray?.length) {
      setFilteredVehiclesInComparison(filteredVehicleDetailsArray);
    }
    // eslint-disable-next-line
  }, [filteredVehicleDetailsArray?.length]);

  let tabs = [
    { title: "Vehicle Data", titleId: "vehicle-data" },
    { title: "Equipment", titleId: "equipment" },
    { title: "Technical Data", titleId: "technical-data" },
    { title: "Location", titleId: "location" },
  ];
  tabs = tabs.map((item) => ({
    ...item,
    title: t(`/vehicleComparison.${item.title}`),
  }));

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  return (
    <div className="mt-10">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto  px-2">
        <div
          className={`${getEdgeClass(edge, "rounded-2xl")}  bg-[var(--white-shade)]`}
        >
          <div className="mb-4 max-md:mb-2">
            <ul
              className="flex text-base max-md:overflow-x-auto max-md:whitespace-nowrap scrollbar-hide gap-10 w-full"
              id="default-styled-tab"
              role="tablist"
            >
              {tabs.map((tab) => (
                <StyledBottomBorderTabs
                  key={tab.titleId}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  title={tab.title}
                  titleId={tab.titleId}
                />
              ))}
            </ul>
          </div>
          <div className="px-6 w-full max-md:px-2 pb-2">
            <Swiper
              spaceBetween={20}
              slidesPerView="3.3"
              freeMode={true}
              mousewheel={true}
              style={{ padding: "0.2rem" }}
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                },
                640: {
                  slidesPerView: 2.3,
                },
                1024: {
                  slidesPerView: 3.3,
                },
              }}
              className="cursor-grabbing"
            >
              {filteredVehiclesInComparison?.map((vehicle, index) => (
                <SwiperSlide key={index} style={{ width: "auto" }}>
                  <VehicleComparisonCard
                    key={index}
                    vehicle={vehicle}
                    currentIndex={index}
                    filteredVehiclesInComparison={filteredVehiclesInComparison}
                    setFilteredVehiclesInComparison={
                      setFilteredVehiclesInComparison
                    }
                    openDropdownIndex={openDropdownIndex}
                    setOpenDropdownIndex={setOpenDropdownIndex}
                    filteredVehicleDetailsArray={filteredVehicleDetailsArray}
                    activeTab={activeTab}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VehicleComparisonWithDataView;
