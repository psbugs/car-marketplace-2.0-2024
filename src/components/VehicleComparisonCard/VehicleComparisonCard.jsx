import { useCompares } from "../../hooks/useCompares";
import { defaultImg } from "../../constants/common-constants";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import VehicleComparisonVehicleData from "../VehicleComparisonVehicleData";
import VehicleComparisonEquipmentData from "../VehicleComparisonEquipmentData";
import VehicleComparisonTechnicalData from "../VehicleComparisonTechnicalData";
import VehicleComparisonLocation from "../VehicleComparisonLocation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";

const VehicleComparisonCard = ({
  vehicle,
  currentIndex,
  filteredVehiclesInComparison,
  setFilteredVehiclesInComparison,
  openDropdownIndex,
  setOpenDropdownIndex,
  activeTab,
  filteredVehicleDetailsArray,
}) => {
  const { toggleComparison } = useCompares();
  const { t } = useTranslation();
  const { edge } = useSelector((state) => state?.uiConfig);
  const handlePositionSelect = (event) => {
    const selectedIndex = parseInt(event.target.value, 10) - 1;
    if (selectedIndex !== currentIndex) {
      setFilteredVehiclesInComparison((prevVehicles) => {
        const updatedVehicles = [...prevVehicles];
        const [movedVehicle] = updatedVehicles.splice(currentIndex, 1);
        updatedVehicles.splice(selectedIndex, 0, movedVehicle);
        return updatedVehicles;
      });
    }
    setOpenDropdownIndex(null);
  };

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //eslint-disable-next-line
  }, []);

  const renderTabContent = (vehicle) => {
    switch (activeTab) {
      case "vehicle-data":
        return <VehicleComparisonVehicleData vehicle={vehicle} />;
      case "equipment":
        const allEquipmentsData = filteredVehicleDetailsArray?.flatMap(
          (vehicle) => [
            ...(vehicle?.equipment?.feature || []),
            ...(vehicle?.equipment?.standard || []),
            ...(vehicle?.equipment?.jatostandard || []),
            ...(vehicle?.equipment?.jatooptional || []),
            ...(vehicle?.equipment?.optional || []),
          ],
        );

        const uniqueEquipmentMap = new Map();
        allEquipmentsData
          ?.flatMap((a) => a?.item || [])
          ?.forEach((item) => {
            if (item && item.title1) {
              uniqueEquipmentMap?.set(item?.title1, item);
            }
          });

        const uniqueEquipmentList = Array.from(
          uniqueEquipmentMap?.values(),
        ).sort((a, b) => a?.title1?.localeCompare(b?.title1));
        return (
          <VehicleComparisonEquipmentData
            vehicle={vehicle}
            allEquipment={uniqueEquipmentList}
          />
        );
      case "technical-data":
        return <VehicleComparisonTechnicalData vehicle={vehicle} />;
      case "location":
        return <VehicleComparisonLocation vehicle={vehicle} />;

      default:
        return null;
    }
  };

  return (
    <div className="mb-4 h-full">
      <div
        className={`border primary-color ${getEdgeClass(edge, "rounded-2xl")} whitespace-normal  max-md:w-auto h-full`}
      >
        <div className="p-5 border-b primary-color">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <label
                className="text-[var(--primary-dark-color)] font-medium text-sm"
                htmlFor="position-select"
              >
                {t("/vehicleComparison.Position")}
              </label>
              <div className="relative">
                <div
                  className="bg-[var(--white-light-smoke-color)] ml-3 border-none rounded p-2 cursor-pointer flex items-center gap-2 text-[var(--primary-dark-color)]"
                  onClick={() => handleDropdownToggle(currentIndex)}
                >
                  {currentIndex + 1}
                  <SVGSelector name="arrow-down-svg" />
                </div>
                {openDropdownIndex === currentIndex && (
                  <ul className="absolute bg-[var(--whitesmoke-color)] border-none rounded  w-[80%] p-1 mt-1 ml-3 z-10 text-center text-[var(--primary-dark-color)]">
                    {filteredVehiclesInComparison?.map((_, index) => (
                      <li
                        key={index}
                        className={`p-2 cursor-pointer ${
                          currentIndex + 1 === index + 1
                            ? "bg-[var(--primary-dark-color)] text-[var(--text-white-black)]"
                            : ""
                        }`}
                        onClick={() =>
                          handlePositionSelect({
                            target: { value: index + 1 },
                          })
                        }
                      >
                        {index + 1}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div
              onClick={() => toggleComparison(vehicle?.id)}
              className="cursor-pointer"
            >
              <SVGSelector name="delete-svg" />
            </div>
          </div>
          <figure>
            <Link to={`?view=vehicle-details&vehicle-id=${vehicle?.id}`}>
              <img
                className="rounded-lg h-[214px] object-contain max-lg:w-full w-full"
                src={
                  (vehicle?.mediaItems?.length &&
                    vehicle?.mediaItems[0]?.downloadUrl) ||
                  defaultImg
                }
                alt="Vehicle"
              />
            </Link>
          </figure>
          <div className="mt-4">
            <div className="h-[3rem]">
              <p className="text-xl text-[var(--text-black-white)] font-semibold max-md:text-xl line-clamp-2 hyphens-auto">
                {vehicle?.manufacturer?.name} {vehicle?.model?.name}{" "}
                {vehicle?.modelExtension}
              </p>
            </div>
            {/* Not included in initial scope */}
            {/* <div className="flex mt-4 items-center">
                <input
                  id="quotation-checkbox"
                  type="checkbox"
                  value=""
                  className="w-5 h-5 text-xl primary-color rounded-[3px] focus:ring-0"
                />
                <label
                  htmlFor="quotation-checkbox"
                  className="ms-2 text-base primary-color"
                >
                  Quotation Request
                </label>
              </div> */}
          </div>
        </div>
        <div className="p-5">{renderTabContent(vehicle)}</div>
      </div>
    </div>
  );
};
export default VehicleComparisonCard;
