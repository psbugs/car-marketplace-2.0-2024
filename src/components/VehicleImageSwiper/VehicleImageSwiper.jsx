import ThreeSixtyView from "../ThreeSixtyView/ThreeSixtyView";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { notAvailableImg } from "../../constants/common-constants";
import { useLocation } from "react-router-dom";
import VehicleDetailsZoomableImageModal from "../VehicleDetailsZoomableImageModal/VehicleDetailsZoomableImageModal";
import SVGSelector from "../common-components/SVGSelector";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";
import { useTranslation } from "react-i18next";

const VehicleImageSwiper = ({
  vehicleDetails = [],
  panoramaImages,
  imagesLoaded,
  internalPanoramaImages,
}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const { search } = useLocation();
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(search);
  const vehicleId = parseInt(queryParams.get("vehicle-id"));
  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };
  useEffect(() => {
    return () => {
      setLoadedImages({});
    };
  }, [vehicleId]);

  useEffect(() => {
    setSelectedIndex(0);
    if (swiperInstance && swiperInstance.slideTo) {
      swiperInstance.slideTo(0, 0);
    }
    //eslint-disable-next-line
  }, [vehicleDetails, search]);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const [vehicleItem, setVehicleItem] = useState(null);
  const [isOverlayModalVisible, setIsOverlayModalVisible] = useState(false);

  const handleZoomModalToggle = (item) => {
    setVehicleItem(item);
    setIsZoomModalVisible(!isZoomModalVisible);
  };

  const handleOverlayModalToggle = () => {
    setIsOverlayModalVisible(!isOverlayModalVisible);
  };
  const thumbnailSwiperRef = useRef(null);

  useEffect(() => {
    if (thumbnailSwiperRef?.current) {
      thumbnailSwiperRef?.current?.navigation?.init();
      thumbnailSwiperRef?.current?.navigation?.update();
    }
  }, []);

  useEffect(() => {
    const swiperInstance = thumbnailSwiperRef.current?.swiper;
    if (!swiperInstance) return;

    const shadowRoot = document.querySelector(
      "#am-marketplace #main-container",
    )?.shadowRoot;
    const nextButton = shadowRoot?.querySelector(".thumbnail-swiper-next-btn");
    const prevButton = shadowRoot?.querySelector(".thumbnail-swiper-prev-btn");

    if (!nextButton || !prevButton) return;

    const updateButtonStates = () => {
      if (!swiperInstance) return;

      prevButton?.classList?.toggle(
        "swiper-button-disabled",
        swiperInstance.isBeginning,
      );
      nextButton?.classList?.toggle(
        "swiper-button-disabled",
        swiperInstance.isEnd,
      );

      prevButton.disabled = swiperInstance.isBeginning;
      nextButton.disabled = swiperInstance.isEnd;
    };

    const handleNextClick = () => {
      if (!swiperInstance.isEnd) {
        swiperInstance.slideNext();
        setTimeout(updateButtonStates, 50);
      }
    };

    const handlePrevClick = () => {
      if (!swiperInstance.isBeginning) {
        swiperInstance.slidePrev();
        setTimeout(updateButtonStates, 50);
      }
    };

    // Initial state update
    updateButtonStates();

    nextButton.addEventListener("click", handleNextClick);
    prevButton.addEventListener("click", handlePrevClick);
    swiperInstance.on("slideChange", updateButtonStates);

    return () => {
      nextButton.removeEventListener("click", handleNextClick);
      prevButton.removeEventListener("click", handlePrevClick);
      swiperInstance.off("slideChange", updateButtonStates);
    };
  }, [thumbnailSwiperRef.current?.swiper, vehicleDetails]);

  return (
    <>
      <div
        className="w-[60%] max-[1299px]:w-2/4 max-lg:w-full"
        key={vehicleDetails?.length + 1}
      >
        <div className={`swiper ${getEdgeClass(edge, "rounded-md")}`}>
          <Swiper
            modules={[Navigation]}
            key={vehicleDetails?.length + 1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
            spaceBetween={0}
            slidesPerView={1}
            pagination={false}
            mousewheel={false}
          >
            {vehicleDetails?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="h-full w-full max-h-[650px] relative">
                    {!loadedImages[index] && (
                      <div
                        className={`absolute top-0 left-0 h-full w-full bg-gray-300 animate-pulse ${getEdgeClass(edge)}`}
                      ></div>
                    )}
                    <img
                      className={`${getEdgeClass(edge, "rounded-t-lg")} ${
                        loadedImages[index] ? "opacity-100" : "opacity-0"
                      } h-auto object-cover max-lg:w-full w-full aspect-[4/3]`}
                      src={item?.downloadUrl || notAvailableImg}
                      alt={`Vehicle ${index + 1}`}
                      onError={(e) => {
                        e.target.src = notAvailableImg;
                      }}
                      onClick={() => handleZoomModalToggle(item)}
                      onLoad={() => handleImageLoad(index)}
                    />
                    {index === 0 && panoramaImages?.length ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <button
                          className="px-4 py-2 bg-white text-black text-lg font-semibold rounded-lg shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOverlayModalToggle();
                          }}
                        >
                          {t("/vehicleDetails.Open in 360°")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="pt-5" key={vehicleDetails?.length + 1}>
          <Swiper
            ref={thumbnailSwiperRef}
            spaceBetween={12}
            slidesPerView="auto"
            freeMode={true}
            mousewheel={true}
            speed={300}
            key={vehicleDetails?.length + 1}
            navigation={{
              nextEl: ".thumbnail-swiper-next-btn",
              prevEl: ".thumbnail-swiper-prev-btn",
            }}
            modules={[Navigation]}
          >
            {vehicleDetails?.map((item, index) => (
              <SwiperSlide key={index} style={{ width: "auto" }}>
                <div className="h-[9rem] w-[12.5rem] relative max-sm:h-[6rem] max-sm:w-[8rem]">
                  {!loadedImages[index] && (
                    <div
                      className={`absolute top-0 left-0 h-full w-full bg-gray-300 animate-pulse ${getEdgeClass(edge)}`}
                    ></div>
                  )}
                  <img
                    className={`${getEdgeClass(edge)} h-full w-full object-cover cursor-pointer transition-opacity duration-300 ${
                      loadedImages[index] ? "opacity-100" : "opacity-0"
                    } ${
                      index === selectedIndex && loadedImages[index]
                        ? "border-4 primary-color"
                        : ""
                    }`}
                    src={item?.downloadUrl + "&w=300&h=220" || notAvailableImg}
                    alt="car"
                    onClick={() => handleThumbnailClick(index)}
                    onError={(e) => {
                      e.target.src = notAvailableImg;
                    }}
                    onLoad={() => handleImageLoad(index)}
                  />
                  {index === 0 && panoramaImages?.length ? (
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${getEdgeClass(edge)}`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <SVGSelector name="360-view" />
                    </div>
                  ) : null}
                </div>
              </SwiperSlide>
            ))}
            <button className="thumbnail-swiper-prev-btn">
              <SVGSelector
                name="arrow-left-svg"
                pathFill={"var(--text-white-black)"}
              />
            </button>
            <button className="thumbnail-swiper-next-btn">
              <SVGSelector
                name="arrow-right-svg"
                pathFill={"var(--text-white-black)"}
              />
            </button>
          </Swiper>
        </div>
      </div>
      <VehicleDetailsZoomableImageModal
        isVisible={isZoomModalVisible}
        handleModalToggle={() => setIsZoomModalVisible(!isZoomModalVisible)}
        edge={edge}
        vehicleItem={vehicleItem}
        vehicleDetails={vehicleDetails}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      {isOverlayModalVisible && (
        <ThreeSixtyView
          isVisible={isOverlayModalVisible}
          handleModalToggle={handleOverlayModalToggle}
          panoramaImages={panoramaImages}
          imagesLoaded={imagesLoaded}
          internalPanoramaImages={internalPanoramaImages}
        />
      )}
    </>
  );
};
export default VehicleImageSwiper;
