import { useEffect, useMemo, useRef, useState } from "react";
import {
  getPrevNextVehicle,
  getVehicleDetails,
  setIsAccessoriesScrolledToFalse,
  setVehicleDataManually,
} from "../../redux/VehiclesSlice";
import { useDispatch, useSelector } from "react-redux";
import TabsView from "../../components/TabsView/TabsView";
import VehicleSpecifications from "../../components/VehicleSpecifications";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import VehicleLeftRightArrow from "../../components/VehicleLeftRightArrow";
import VehicleButtonsContainer from "../../components/VehicleButtonsContainer";
import VehicleImageSwiper from "../../components/VehicleImageSwiper";
import VehicleHighlights from "../../components/VehicleHighlights";
import VehiclesGeneralInfo from "../../components/VehiclesGeneralInfo";
import VehicleEquipmentDetails from "../../components/VehicleEquipmentDetails";
import VehicleConsumptionInfo from "../../components/VehicleConsumptionInfo";
// import VehicleOffers from "../../components/VehicleOffers";
import InfoBlocks from "../../components/InfoBlocks";
import { useLocation, useNavigate } from "react-router-dom";
import Features from "../../components/Features";
import Preloader from "../../components/Preloader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import VehicleFinancingAndLeasing from "../../components/VehicleFinancing&Leasing";
// import FuelInformationSection from "../../components/FuelInformationSection";
import { useTranslation } from "react-i18next";
import SVGSelector from "../../components/common-components/SVGSelector";
// import VehicleAccessories from "../../components/VehicleAccessories";
import { getEdgeClass } from "../../utils";
import VehicleFurtherFeatures from "../../components/VehicleFurtherFeatures";

const VehicleDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search } = useLocation();
  const docTitle = useDocumentTitle();
  const queryParams = new URLSearchParams(search);
  const vehicleId = queryParams.get("vehicle-id");
  const index = parseInt(queryParams.get("index")) || 0;
  const dispatch = useDispatch();
  const {
    vehicleDetails,
    loading,
    vehiclesRegistrationDates,
    prevNextVehicleData,
  } = useSelector((state) => state.vehicles);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const {
    uiConfigData = false,
    theme = false,
    edge = false,
    loading: uiConfigLoading = false,
  } = useSelector((state) => state?.uiConfig) || {};
  const { companyName = false } = theme || {};
  const redirectedUrlFromVehiclesPage = useSelector(
    (state) => state?.vehicles?.redirectedUrl,
  );
  // Do not scroll to top on click of Trade in form.
  const shouldTriggerScroll = useMemo(() => {
    queryParams.delete("tradeIn");
    return queryParams.toString();
    // eslint-disable-next-line
  }, [search]);

  // Scroll to top on location change.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    dispatch(setIsAccessoriesScrolledToFalse());
  }, [shouldTriggerScroll, dispatch]);

  useEffect(() => {
    if (uiConfigData?.resultAppearance) {
      const {
        defaultOrdering = false,
        defaultOrderDir = false,
        defaultResultPageLayout = false,
      } = uiConfigData?.resultAppearance;
      const defaultParams = {
        take: 3,
        index,
        skip: index > 0 ? index - 1 : 0,
        orderby: defaultOrdering,
        orderdir: defaultOrderDir,
        pageLayout: defaultResultPageLayout,
      };
      dispatch(getPrevNextVehicle(defaultParams));
    }
  }, [dispatch, index, vehicleId, uiConfigData]);

  // Change the title of a page using custom hook
  // useEffect(() => {
  //   if (companyName) {
  //     docTitle(`${t("/vehicleDetails.Vehicle Details")} | ${companyName}`);
  //   }
  // }, [companyName, docTitle, t]);

  // Get Vehicle details
  useEffect(() => {
    if (
      index &&
      vehicleId &&
      vehiclesRegistrationDates?.total &&
      vehiclesRegistrationDates.total > 0
    ) {
      const selectedVehicle = vehiclesRegistrationDates?.items?.[index];
      if (selectedVehicle && selectedVehicle?.id) {
        dispatch(setVehicleDataManually(selectedVehicle));
        return;
      }
    }

    if (vehicleId) {
      dispatch(getVehicleDetails(vehicleId))
        .unwrap()
        .then((result) => {
          if (result === "ERR_NETWORK" || result === "ERR_BAD_REQUEST") {
            navigate(`?view=not-found`);
          }
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line
  }, [dispatch, vehicleId, navigate]);

  // Get ui config data call for highlights section if data not available.
  useEffect(() => {
    if (
      !uiConfigLoading &&
      (uiConfigData === false || theme === false || edge === false)
    ) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, uiConfigData, theme, edge, uiConfigLoading]);

  const year = vehicleDetails?.availableFrom?.dateString?.split(".")[2] || "";

  const fuelConsumption = vehicleDetails?.wltpFuelConsumptionCombined
    ? `${vehicleDetails.wltpFuelConsumptionCombined} l/100 km`
    : "";

  const fuelName = vehicleDetails?.fuel?.name || "";

  const co2Emission = vehicleDetails?.wltpCo2ClassWeighted
    ? `${vehicleDetails.wltpCo2ClassWeighted} g CO₂/km`
    : "";

  const vehicleDataAttributes = vehicleDetails
    ? {
        "order-number": vehicleDetails.orderNumber || "",
        "stock-id": vehicleDetails.id || "",
        manufacturer: vehicleDetails.manufacturer?.name || "",
        model: vehicleDetails.model?.name || "",
        "model-extension": vehicleDetails.modelExtension || "",
        hsn: vehicleDetails.hsn || "",
        tsn: vehicleDetails.tsn || "",
        "eva-model-code": vehicleDetails.evaModelCode || "",
        year: year,
        mileage: vehicleDetails.mileage || "",
        fuel: vehicleDetails.fuel?.name || "",
        "price-brutto": vehicleDetails?.consumerPrice?.totalPrice || "",
        "price-netto": vehicleDetails?.consumerPrice?.netPrice || "",
        currency: vehicleDetails?.consumerPrice?.currency || "",
        consumptionLabel: `${fuelConsumption}${fuelName ? ` ${fuelName}` : ""}${
          co2Emission ? `, ${co2Emission}` : ""
        }`,
        image: vehicleDetails?.mediaItems?.[0]?.downloadUrl || "",
      }
    : {};

  const serviceListerDealerId = uiConfigData?.serviceLister?.entries?.filter(
    (a) => a?.manufacturerId === vehicleDetails?.manufacturer?.id,
  );

  const calculatorRef = useRef(null);
  const scrollToCalculator = () => {
    if (calculatorRef.current) {
      calculatorRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const panoramaImages = useMemo(
    () =>
      vehicleDetails?.mediaItems?.filter(
        (a) => a?.type === "ExternalPanorama",
      ) || [],
    [vehicleDetails],
  );

  const internalPanoramaImages = useMemo(
    () =>
      vehicleDetails?.mediaItems?.filter(
        (a) => a?.type === "InternalPanorama",
      ) || [],
    [vehicleDetails],
  );

  // Preload images
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    const loadImages = async () => {
      try {
        const promises = panoramaImages
          .filter((img) => !loadedImages.has(img?.downloadUrl))
          .map((image) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = image?.downloadUrl;
              img.onload = () => {
                setLoadedImages(
                  (prev) => new Set([...prev, image?.downloadUrl]),
                );
                resolve();
              };
              img.onerror = () =>
                reject(
                  new Error(`Failed to load image: ${image?.downloadUrl}`),
                );
            });
          });
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    if (panoramaImages.length > 0) {
      loadImages();
    }
  }, [panoramaImages, loadedImages]);
  const vehicleImgTypeMediaItems = vehicleDetails?.mediaItems?.filter(
    (a) => a?.type === "Image",
  );
  const vehicleDetailsForPano = vehicleDetails?.mediaItems?.length
    ? [panoramaImages?.[0], ...vehicleImgTypeMediaItems]
    : [];
  return (
    <div>
      {loading && <Preloader />}
      <Features />
      <section>
        <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 ">
          <div className="flex justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  onClick={() => navigate(redirectedUrlFromVehiclesPage)}
                  className="inline-flex items-center text-sm font-medium text-[var(--text-black-white)]  cursor-pointer"
                >
                  <SVGSelector
                    name="arrow-left-svg"
                    pathFill={"var(--text-black-white)"}
                  />
                  &nbsp;
                  {t("/vehicleDetails.Back to search results")}
                </div>
              </div>
            </div>
            <VehicleLeftRightArrow prevNextVehicleData={prevNextVehicleData} />
          </div>
          <div
            className={`mt-6 bg-[var(--white-shade)] p-7 max-md:p-4 ${getEdgeClass(edge, "rounded-[20px]")} `}
          >
            <h4 className="text-[26px] font-semibold max-md:text-xl flex gap-2 items-center leading-normal flex-wrap text-[var(--primary-dark-color)] word-break-break-word">
              {vehicleDetails?.manufacturer?.name} {vehicleDetails?.model?.name}{" "}
              {vehicleDetails?.modelExtension}
            </h4>
            {vehicleDetails?.wltpEnVkvText ? (
              <div className="text-[var(--davy-gray-color)]">
                {vehicleDetails?.wltpEnVkvText}
              </div>
            ) : null}
          </div>
          <div className="mt-6">
            <div className="flex gap-6 max-lg:flex-col">
              <VehicleImageSwiper
                vehicleDetails={
                  panoramaImages?.length
                    ? vehicleDetailsForPano
                    : vehicleImgTypeMediaItems
                }
                panoramaImages={panoramaImages}
                imagesLoaded={imagesLoaded}
                internalPanoramaImages={internalPanoramaImages}
              />
              <div
                className={`w-[40%] bg-[var(--white-shade)] px-5 py-6 max-[1299px]:w-2/4 max-lg:w-full max-md:p-4 flex flex-col justify-between ${getEdgeClass(edge, "rounded-2xl")}`}
              >
                <TabsView
                  vehicleDetails={vehicleDetails}
                  vehicleId={vehicleId}
                  scrollToCalculator={scrollToCalculator}
                />
                <div className="text-left">
                  {vehicleDetails?.contact ? (
                    <span className="text-left text-[var(--secondary-color)] text-sm line-clamp-2 flex items-center ms-[-2px] gap-1">
                      <SVGSelector
                        name={"cards-location-pin-svg"}
                        detailsPage={true}
                      />
                      {`${vehicleDetails?.contact?.address1 ? vehicleDetails?.contact?.address1 : ""} ${
                        vehicleDetails?.contact?.address2
                          ? `${vehicleDetails?.contact?.address2} •`
                          : ""
                      }, ${vehicleDetails?.contact?.zip ? vehicleDetails?.contact?.zip : ""}  ${vehicleDetails?.contact?.town ? vehicleDetails?.contact?.town : ""}`}
                    </span>
                  ) : null}
                  <VehicleSpecifications vehicleDetails={vehicleDetails} />
                  <VehicleButtonsContainer
                    vehicleDetails={vehicleDetails}
                    serviceListerDealerId={serviceListerDealerId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <pxc-os-vehicle-data {...vehicleDataAttributes}></pxc-os-vehicle-data>
      <VehicleHighlights vehicleDetails={vehicleDetails} />
      <VehiclesGeneralInfo vehicleDetails={vehicleDetails} />
      <VehicleEquipmentDetails vehicleDetails={vehicleDetails} />
      <VehicleFurtherFeatures vehicleDetails={vehicleDetails} />
      {/* <div ref={accessoriesRef} id="pxc-accessories-section">
        <VehicleAccessories
          vehicleDetails={vehicleDetails}
          serviceListerDealerId={serviceListerDealerId}
        />
      </div> */}
      <div ref={calculatorRef}>
        <VehicleFinancingAndLeasing vehicleDetails={vehicleDetails} />
      </div>
      <VehicleConsumptionInfo vehicleDetails={vehicleDetails} />
      <InfoBlocks vehicleDetails={vehicleDetails?.inCampaigns} />
      {/* <VehicleOffers />
      <FuelInformationSection /> */}
    </div>
  );
};

export default VehicleDetails;
