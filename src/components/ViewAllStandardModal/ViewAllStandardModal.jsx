import { useEffect, useState } from "react";
import StyledBottomBorderTabs from "../common-components/StyledBottomBorderTabs";
import ViewAllStdEquipmentData from "../ViewAllStdEquipmentData";
import ViewAllStdTechnicalData from "../ViewAllStdTechnicalData";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass, modalOverlayOnAccessories } from "../../utils";

const ViewAllStandardModal = ({
  isVisible,
  handleModalToggle,
  vehicleDetails,
}) => {
  const [activeTab, setActiveTab] = useState("");
  const { t } = useTranslation();
  const { edge = false } = useSelector((state) => state.uiConfig);
  const standardData = vehicleDetails?.equipment?.standard?.length
    ? vehicleDetails?.equipment?.standard
    : vehicleDetails?.equipment?.jatostandard?.length
      ? vehicleDetails?.equipment?.jatostandard
      : [];
  const specialData = vehicleDetails?.equipment?.optional?.length
    ? vehicleDetails?.equipment?.optional
    : vehicleDetails?.equipment?.jatooptional?.length
      ? vehicleDetails?.equipment?.jatooptional
      : [];

  let tabs = [
    {
      title: "Special Equipments",
      titleId: "optional-equipments",
      isDisabled: !specialData?.length,
    },
    {
      title: "Standard Equipments",
      titleId: "standard-equipments",
      isDisabled: !standardData?.length,
    },
    {
      title: "Technical Data",
      titleId: "technical-data",
      isDisabled: !vehicleDetails?.technicalData,
    },
  ];
  tabs = tabs.map((item) => ({
    ...item,
    title: t(`/vehicleDetails.${item?.title}`),
  }));
  useEffect(() => {
    setActiveTab(
      specialData?.length
        ? "optional-equipments"
        : standardData?.length
          ? "standard-equipments"
          : "technical-data",
    );
  }, [specialData?.length, standardData?.length, vehicleDetails?.id]);

  useEffect(() => {
    modalOverlayOnAccessories(isVisible);
  }, [isVisible]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "optional-equipments":
        return (
          <ViewAllStdEquipmentData
            data={specialData}
            vehicleDetails={vehicleDetails}
          />
        );
      case "standard-equipments":
        return (
          <ViewAllStdEquipmentData
            data={standardData}
            vehicleDetails={vehicleDetails}
          />
        );
      case "technical-data":
        return <ViewAllStdTechnicalData data={vehicleDetails?.technicalData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          isVisible ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 bg-[#0000005e] right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div
          className={`relative w-full max-w-[1199px] ${getEdgeClass(edge, "rounded-[4px]")} bg-[var(--white-shade)] max-sm:pt-4 max-lg:top-24 max-sm:top-[1.5rem]`}
        >
          <button
            type="button"
            className={`text-gray-400 bg-transparent top-0 right-0 absolute ${getEdgeClass(edge, "rounded-[4px]")} text-sm w-[4%] h-8 max-lg:w-[12%] max-lg:h-[1.5rem]  ms-auto inline-flex justify-end px-4 py-2 max-sm:pb-2 max-sm:pt-4 items-center z-[999999]`}
            onClick={() => {
              handleModalToggle();
              setActiveTab(
                specialData?.length
                  ? "optional-equipments"
                  : standardData?.length
                    ? "standard-equipments"
                    : "technical-data",
              );
            }}
          >
            <SVGSelector
              name="cross-svg"
              pathStroke={"currentColor"}
              svgHeight={16}
              svgWidth={16}
            />
          </button>
          <div className="mb-4 max-md:mb-2">
            <ul
              className="flex text-base max-md:overflow-x-auto max-md:whitespace-nowrap scrollbar-hide gap-10 w-full py-4"
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
                  disabled={tab?.isDisabled}
                />
              ))}
            </ul>
          </div>
          <div className="pt-0 p-5 overflow-auto h-[80vh] custom-scrollbar">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewAllStandardModal;
