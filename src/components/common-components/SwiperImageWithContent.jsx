import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import VehicleGridCard from "../../pages/Vehicle/VehicleGridCard";
import SVGSelector from "./SVGSelector";
import { useLocation } from "react-router-dom";
import { getEdgeClass } from "../../utils";
import { useSelector } from "react-redux";

// Initialize Swiper with Navigation module
SwiperCore.use([Navigation]);

const SwiperImageWithContent = ({
  pagination,
  mouseWheel,
  spaceBetween,
  isShowButton,
  data,
}) => {
  const swiperRef = useRef(null);
  const { edge = false } = useSelector((state) => state.uiConfig);

  const prevSlide = () => {
    swiperRef.current?.swiper?.slidePrev();
  };

  const nextSlide = () => {
    swiperRef.current?.swiper?.slideNext();
  };
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const vehicleId = parseInt(queryParams.get("vehicle-id"));
  return (
    <>
      <Swiper
        ref={swiperRef}
        spaceBetween={spaceBetween}
        navigation={{
          nextEl: ".swiper-button-next-car",
          prevEl: ".swiper-button-prev-car",
        }}
        pagination={pagination}
        mousewheel={mouseWheel}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1299: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {data?.length > 0 &&
          data
            ?.filter?.((a) => a?.id !== vehicleId)
            ?.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <div className="swiper h-full">
                    <VehicleGridCard cars={item} key={idx} idx={idx} />
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
      {data?.length > 4 && isShowButton && (
        <div className="flex gap-8 justify-center mt-10 max-md:gap-4">
          <div
            className={`swiper-button-prev-car w-[24px] h-[24px] ${getEdgeClass(edge, "rounded-[4px]")} bg-[var(--primary-dark-color)] flex items-center justify-center cursor-pointer`}
            onClick={prevSlide}
          >
            <SVGSelector
              name="arrow-left-svg"
              pathFill={"var(--text-white-black)"}
            />
          </div>
          <div
            className={`swiper-button-next-car w-[24px] h-[24px] ${getEdgeClass(edge, "rounded-[4px]")} bg-[var(--primary-dark-color)] flex items-center justify-center cursor-pointer`}
            onClick={nextSlide}
          >
            <SVGSelector
              name="arrow-right-svg"
              pathFill={"var(--text-white-black)"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SwiperImageWithContent;
