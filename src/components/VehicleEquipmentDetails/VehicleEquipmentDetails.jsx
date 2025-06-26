import { useState } from "react";
import ViewAllStandardModal from "../ViewAllStandardModal";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass, hideNavWhenModalIsActive } from "../../utils";

const VehicleEquipmentDetails = ({ vehicleDetails }) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalToggle = () => {
    const updatedModalState = !isModalVisible;
    setIsModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };

  const standardData = vehicleDetails?.equipment?.standard;
  const jatoStandardData = vehicleDetails?.equipment?.jatostandard;
  const jatoOptionalData = vehicleDetails?.equipment?.jatooptional;
  const specialData = vehicleDetails?.equipment?.optional;
  const technicalData = vehicleDetails?.technicalData;
  const { t } = useTranslation();

  const flattenData = (data) =>
    data?.flatMap((feature) => feature?.item || []) || [];

  const specialItems = flattenData(specialData);
  const jatoOptionalItems = flattenData(jatoOptionalData);
  const standardItems = flattenData(standardData);
  const jatoStandardItems = flattenData(jatoStandardData);
  const technicalItems = flattenData(technicalData);

  const combinedEquipments = [
    ...specialItems,
    ...jatoOptionalItems,
    ...standardItems,
    ...jatoStandardItems,
    ...technicalItems,
  ];

  const filteredEquipments = combinedEquipments?.filter((item) => {
    const isTechnicalItem = technicalItems?.includes(item);
    const displayText = isTechnicalItem
      ? `${item?.key}: ${item?.stringValue || ""}`
      : item?.title1 || item?.key || "";
    return displayText?.trim() !== "";
  });

  const combinedLimitedEquipments = filteredEquipments?.slice(0, 15);

  const renderFilteredData = () =>
    combinedLimitedEquipments?.map((item, idx) => {
      let displayText = item?.title1 || item?.key || "";

      const isTechnicalItem = technicalItems.includes(item);
      if (isTechnicalItem) {
        displayText = `${item?.key}: ${item?.stringValue || ""}`;
      }

      if (
        idx === combinedLimitedEquipments?.length - 1 &&
        filteredEquipments?.length > combinedLimitedEquipments?.length
      ) {
        displayText = displayText?.slice(0, -3) + "...";
      }

      return (
        <li className="ml-4 text-[15px]" key={idx}>
          {displayText}
        </li>
      );
    });

  return (
    <>
      {!combinedEquipments?.length ? null : (
        <section className="mt-7 max-md:mt-5">
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
            <div
              className={`${getEdgeClass(edge, "rounded-[20px]")} bg-[var(--white-shade)] p-7 max-md:p-4"`}
            >
              <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
                {t("/vehicleDetails.Equipments")}
              </h3>
              <div className="my-6">
                <ul className="grid grid-cols-3 gap-1 list-disc text-[var(--davy-gray-color)] max-lg:grid-cols-2 max-md:grid-cols-1">
                  {renderFilteredData()}
                </ul>
              </div>
              {filteredEquipments?.length >
                combinedLimitedEquipments?.length && (
                <button
                  className={`${getEdgeClass(edge, "rounded-[4px]")} w-full ml-auto block primary-bg-color max-md:ml-0 mt-8 text-base text-white py-[10px] border px-8 max-md:text-sm max-md:px-4 hover-text-primary-color`}
                  type="button"
                  onClick={handleModalToggle}
                >
                  {t("/vehicleDetails.View more")}...
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      <ViewAllStandardModal
        isVisible={isModalVisible}
        handleModalToggle={handleModalToggle}
        vehicleDetails={vehicleDetails}
      />
    </>
  );
};
export default VehicleEquipmentDetails;
