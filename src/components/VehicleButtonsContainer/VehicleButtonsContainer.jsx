import VehicleFourFeaturesBlock from "../VehicleFourFeaturesBlock";
import { useState, useRef, useEffect } from "react";
import SendMessageModalForm from "../SendMessageModalForm";
import TestDriveModalForm from "../TestDriveModalForm";
import CustomModal from "../common-components/CustomModal";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
import { useDispatch, useSelector } from "react-redux";
import {
  getEdgeClass,
  hideNavWhenModalIsActive,
  modalOverlayOnAccessories,
} from "../../utils";
import { showTestDriveForm } from "../../redux/TestDriveSlice";
import TradeInModalForm from "../TradeInModalForm/TradeInModalForm";
import { showTradeInForm } from "../../redux/TradeInSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import { triggerAccessoriesScroll } from "../../redux/VehiclesSlice";

const VehicleButtonsContainer = ({ vehicleDetails, serviceListerDealerId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTradeInModalVisible, setTradeInModalVisible] = useState(false);
  const { t } = useTranslation();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { features = false } = uiConfigData || {};
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  const handleModalToggle = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    const updatedModalState = !isModalVisible;
    setIsModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };
  const [isTestDriveModalVisible, setIsTestDriveModalVisible] = useState(false);
  const testDriveFormikRef = useRef(null);
  const tradeInFormikRef = useRef(null);

  useEffect(() => {
    modalOverlayOnAccessories(isModalVisible);
  }, [isModalVisible]);

  const handleTestDriveModalToggle = () => {
    if (testDriveFormikRef.current) {
      testDriveFormikRef.current.resetForm();
    }
    dispatch(showTestDriveForm());
    const updatedModalState = !isTestDriveModalVisible;
    setIsTestDriveModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };

  const accessoriesEnabled =
    uiConfigData?.serviceLister?.enabled && serviceListerDealerId?.length;
  const tradeInEnabled = features && features?.includes("TradeIn");
  const testDriveEnabled = features && features?.includes("TestDrive");

  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const handleTradeInModalToggle = () => {
    if (tradeInFormikRef.current) {
      tradeInFormikRef.current.resetForm();
    }

    if (!isTradeInModalVisible) {
      newSearchParams.append("tradeIn", "true");
    } else {
      newSearchParams.delete("tradeIn");
    }

    setSearchParams(newSearchParams);
    dispatch(showTradeInForm());
    const updatedModalState = !isTradeInModalVisible;
    setTradeInModalVisible(updatedModalState);
    hideNavWhenModalIsActive(updatedModalState);
  };
  const location = useLocation();

  useEffect(() => {
    const shouldShowModal = searchParams?.has("tradeIn");
    const shouldBlockModal = features && !features?.includes("TradeIn");

    if (!shouldBlockModal && isTradeInModalVisible !== shouldShowModal) {
      setTradeInModalVisible(shouldShowModal);
      hideNavWhenModalIsActive(shouldShowModal);
    }
    // eslint-disable-next-line
  }, [location?.search, features]);

  const enabledButtons = [
    features && features?.includes("TradeIn") && "TradeIn",
    features && features?.includes("TestDrive") && "TestDrive",
    uiConfigData?.serviceLister?.enabled &&
      serviceListerDealerId?.length &&
      "Accessories",
  ]?.filter(Boolean);

  const buttonClass = `py-[10px] px-6 flex items-center gap-4 font-medium justify-center cursor-pointer bg-[var(--primary-dark-color)] text-[var(--text-white-black)] ${getEdgeClass(edge, "rounded-md")}`;

  const AccessoriesButton = ({ className }) => {
    return accessoriesEnabled ? (
      <div
        className={`${className} ${buttonClass}`}
        onClick={() => dispatch(triggerAccessoriesScroll())}
      >
        <SVGSelector
          name="accessories-svg"
          pathFill="var(--text-white-black)"
          svgHeight={20}
          svgWidth={20}
        />
        {t("/vehicleDetails.Accessories")}
      </div>
    ) : null;
  };

  const TestDriveButton = ({ className }) => {
    return testDriveEnabled ? (
      <button
        className={`${className} ${buttonClass}`}
        onClick={handleTestDriveModalToggle}
      >
        <SVGSelector
          name="test-drive-svg"
          pathFill="var(--text-white-black)"
          svgHeight={26}
          svgWidth={26}
        />
        {t("/vehicleDetails.Test drive")}
      </button>
    ) : null;
  };

  const TradeInButton = ({ className }) => {
    return tradeInEnabled ? (
      <button
        className={`${className} ${buttonClass}`}
        onClick={handleTradeInModalToggle}
      >
        <SVGSelector
          name="coins-svg"
          pathFill="var(--text-white-black)"
          svgHeight={26}
          svgWidth={26}
        />
        {t("/vehicleDetails.Trade In")}
      </button>
    ) : null;
  };
  const formattedPhoneNumber =
    vehicleDetails?.contact?.contactTyps?.[0]?.formattedPhone;
  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <button
          className={`bg-white text-sm ${getEdgeClass(edge, "rounded-md")} group py-[10px] ${
            formattedPhoneNumber ? "w-1/2" : "w-full"
          } text-center gap-[10px] flex item px-3 justify-center primary-color border max-md:px-3 items-center`}
          onClick={handleModalToggle}
        >
          <SVGSelector name="message-svg" />
          {t("/vehicleDetails.Send a message")}
        </button>
        {formattedPhoneNumber ? (
          <a
            href={`tel:${formattedPhoneNumber}`}
            className={`${getEdgeClass(edge, "rounded-md")} bg-white group text-sm py-[10px] w-1/2 flex items-center gap-[10px] text-center justify-center px-3 primary-color border max-md:text-sm max-md:px-3`}
          >
            <SVGSelector name="phone-svg" />
            {t("/vehicleDetails.Call now")}
          </a>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 mt-5">
        {enabledButtons?.length === 1 ? (
          <div className="w-full flex justify-center">
            <TradeInButton className="w-full" />
            <TestDriveButton className="w-full" />
            <AccessoriesButton className="w-full" />
          </div>
        ) : null}

        {enabledButtons?.length === 2 ? (
          <div className="w-full flex gap-2">
            <TradeInButton className="w-1/2" />
            <TestDriveButton className="w-1/2" />
            <AccessoriesButton className="w-1/2" />
          </div>
        ) : null}

        {enabledButtons?.length === 3 ? (
          <div className="w-full flex flex-wrap gap-4">
            <div className="w-full flex gap-2">
              <TradeInButton className="w-1/2" />
              <TestDriveButton className="w-1/2" />
            </div>
            <div className="w-full flex justify-center">
              <AccessoriesButton className="w-full" />
            </div>
          </div>
        ) : null}
      </div>
      <VehicleFourFeaturesBlock vehicleDetails={vehicleDetails} />
      <CustomModal
        isVisible={isModalVisible}
        handleModalToggle={handleModalToggle}
        modalHeader={t("/vehicleDetails.Contact Dealer")}
        modalContent={
          <SendMessageModalForm
            vehicleDetails={vehicleDetails}
            formikRef={formikRef}
            handleModalToggle={handleModalToggle}
          />
        }
      />
      {features && features.includes("TradeIn") && (
        <CustomModal
          customPopupWidth={1199}
          isVisible={isTradeInModalVisible}
          handleModalToggle={handleTradeInModalToggle}
          modalHeader={t("/vehicleDetails.Trade In")}
          modalContent={
            <TradeInModalForm
              vehicleDetails={vehicleDetails}
              formikRef={tradeInFormikRef}
              handleModalToggle={handleTradeInModalToggle}
              isTradeInModalVisible={isTradeInModalVisible}
            />
          }
        />
      )}
      <CustomModal
        isVisible={isTestDriveModalVisible}
        handleModalToggle={handleTestDriveModalToggle}
        modalHeader={t("/vehicleDetails.Test drive")}
        modalContent={
          <TestDriveModalForm
            vehicleDetails={vehicleDetails}
            formikRef={testDriveFormikRef}
            handleModalToggle={handleTestDriveModalToggle}
            isTestDriveModalVisible={isTestDriveModalVisible}
          />
        }
      />
    </div>
  );
};

export default VehicleButtonsContainer;
