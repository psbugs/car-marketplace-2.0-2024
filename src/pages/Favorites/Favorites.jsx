import { useDispatch, useSelector } from "react-redux";
import EnterTransferCodeModal from "../../components/EnterTransferCodeModal";
import Features from "../../components/Features";
import FavoritesWithDataView from "../../components/FavoritesWithDataView";
import { useEffect, useState } from "react";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import FuelInformationSection from "../../components/FuelInformationSection";
import TransferCodeAndSaveButton from "../../components/TransferCodeAndSaveButton";
import Preloader from "../../components/Preloader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { favData } = useSelector((state) => state.transferCode);
  const favVehicleIdsArr = favData?.items;
  const dispatch = useDispatch();
  const {
    uiConfigData = false,
    theme = false,
    loading: uiConfigLoading,
  } = useSelector((state) => state?.uiConfig) || {};
  const { companyName = false } = theme || {};
  const features = uiConfigData?.features;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { loading } = useSelector((state) => state.vehicles);
  const docTitle = useDocumentTitle();
  const { t } = useTranslation();

  // Transfer code modal handler
  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Change the title of a page using custom hook
  // useEffect(() => {
  //   if (companyName) {
  //     docTitle(`${t("/.Favorites")} | ${companyName}`);
  //   }
  // }, [companyName, docTitle, t]);

  // Ui config api call to get features if uiConfigData is not available.
  useEffect(() => {
    if (!uiConfigLoading && uiConfigData === false) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, uiConfigData, uiConfigLoading]);

  return (
    <div>
      {loading && <Preloader />}
      <Features />
      <section>
        <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 ">
          {!favVehicleIdsArr?.length ? (
            <div className="my-6">
              <h4 className="text-[28px] text-[var(--text-black-white)] font-semibold max-md:text-xl ">
                {t("/.Favorites")}
              </h4>
              <p className="text-base text-[var(--davy-gray-color)] mt-4 max-md:text-xs">
                {t(
                  "/favorites.There is currently no vehicle in your Favorites.",
                )}{" "}
                {t(
                  "/favorites.You have the option to park vehicles in the results list and on the vehicle details page.",
                )}
                <br />
                {features?.includes("TransferCode") ? (
                  <span>
                    {t("/favorites.If you created a transfer code")}{" "}
                    {t("/favorites.click")} "
                    {t("/favorites.Enter transfer code")}"{" "}
                    {t("/favorites.to restore your Favorites.")}
                  </span>
                ) : null}
              </p>
            </div>
          ) : null}
          {favVehicleIdsArr?.length ? (
            <div className="my-6">
              <h4 className="text-[28px] text-[var(--text-black-white)] font-semibold max-md:text-xl">
                {t("/.Favorites")}
              </h4>
            </div>
          ) : null}
          <TransferCodeAndSaveButton
            handleModalToggle={handleModalToggle}
            favVehicleIdsArr={favVehicleIdsArr}
          />
          {favVehicleIdsArr?.length ? <FavoritesWithDataView /> : null}
          <FuelInformationSection />
        </div>
      </section>
      <EnterTransferCodeModal
        isVisible={isModalVisible}
        handleModalToggle={handleModalToggle}
        loadTitleText={t("/favorites.Load favorites")}
        restoreOptionText={"Favorites"}
      />
    </div>
  );
};
export default Favorites;
