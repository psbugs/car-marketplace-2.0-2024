import Features from "../../components/Features";
import FuelInformationSection from "../../components/FuelInformationSection";
import VehicleComparisonWithDataView from "../../components/VehicleComparisonWithDataView";
import { useState, useEffect } from "react";
import EnterTransferCodeModal from "../../components/EnterTransferCodeModal";
import { useSelector, useDispatch } from "react-redux";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import TransferCodeAndSaveButton from "../../components/TransferCodeAndSaveButton";
import Preloader from "../../components/Preloader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";

const VehicleComparison = () => {
  const { comparablesData } = useSelector((state) => state.transferCode);
  const { loading } = useSelector((state) => state.vehicles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    uiConfigData = false,
    theme = false,
    loading: uiConfigLoading,
  } = useSelector((state) => state?.uiConfig) || {};
  const comparableVehicleIdsArr = comparablesData?.items;
  const { companyName = false } = theme || {};
  const features = uiConfigData?.features;
  const dispatch = useDispatch();
  const docTitle = useDocumentTitle();
  const { t } = useTranslation();

  // Transfer code modal handler
  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Change the title of a page using custom hook
  // useEffect(() => {
  //   if (companyName) {
  //     docTitle(`${t("/.Vehicle Comparison")} | ${companyName}`);
  //   }
  // }, [companyName, docTitle, t]);

  // Ui config api call to get features if uiConfigData is not available.
  useEffect(() => {
    if (uiConfigLoading === false && uiConfigData === false) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, uiConfigData, uiConfigLoading]);

  return (
    <div>
      {loading && <Preloader />}
      <Features />
      <div
        className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2"
        id="comparison-section"
      >
        {!comparableVehicleIdsArr?.length ? (
          <div className="my-6">
            <h4 className="text-[28px] font-semibold max-md:text-xl ">
              {t("/.Vehicle Comparison")}
            </h4>
            <p className="text-base text-[var(--davy-gray-color)] mt-4 max-md:text-xs">
              {t(
                "/vehicleComparison.There is currently no vehicle for comparison.",
              )}{" "}
              {t(
                "/vehicleComparison.You can activate vehicles for comparison in the results list and on the vehicle details page.",
              )}
              <br />
              {features?.includes("TransferCode") ? (
                <span>
                  {t("/vehicleComparison.If you created a transfer code,")}{" "}
                  {t("/vehicleComparison.click")} "
                  {t("/vehicleComparison.Enter transfer code")}"{" "}
                  {t("/vehicleComparison.to restore your comparison.")}
                </span>
              ) : null}
            </p>
          </div>
        ) : null}
        {comparableVehicleIdsArr?.length ? (
          <div className="my-6">
            <h4 className="text-[28px] font-semibold max-md:text-xl ">
              {t("/.Vehicle Comparison")}
            </h4>{" "}
          </div>
        ) : null}
        <TransferCodeAndSaveButton
          handleModalToggle={handleModalToggle}
          comparableVehicleIdsArr={comparableVehicleIdsArr}
        />
        {comparableVehicleIdsArr?.length ? (
          <VehicleComparisonWithDataView />
        ) : null}
        <FuelInformationSection />
      </div>
      <EnterTransferCodeModal
        isVisible={isModalVisible}
        handleModalToggle={handleModalToggle}
        loadTitleText={t("/vehicleComparison.Load comparison")}
        restoreOptionText={"comparison"}
      />
    </div>
  );
};
export default VehicleComparison;
