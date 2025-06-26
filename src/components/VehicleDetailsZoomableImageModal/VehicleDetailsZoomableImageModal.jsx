import { useEffect } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { useSelector } from "react-redux";
import { notAvailableImg } from "../../constants/common-constants";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";

const VehicleDetailsZoomableImageModal = ({
  isVisible,
  handleModalToggle,
  vehicleDetails = [],
  selectedIndex,
  setSelectedIndex,
}) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < vehicleDetails?.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      {isVisible ? (
        <div
          aria-hidden="true"
          className={`${
            isVisible ? "flex" : "hidden"
          } overflow-y-auto overflow-x-hidden fixed bg-[#0000005e] h-full top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
        >
          <div className="relative p-4 w-full max-w-[1000px] max-h-[880px]">
            <div
              className={`${getEdgeClass(edge)} bg-[var(--white-shade)] shadow p-4`}
            >
              <div className="relative">
                <button
                  type="button"
                  className={`${getEdgeClass(edge)} absolute top-4 right-4 text-sm w-8 h-8 inline-flex justify-center items-center z-10 bg-[var(--text-white-black)]`}
                  onClick={handleModalToggle}
                  aria-label="Close"
                >
                  <SVGSelector
                    name="cross-svg"
                    svgHeight={16}
                    svgWidth={16}
                    pathStroke={"var(--secondary-color)"}
                  />
                </button>
                {selectedIndex > 0 && (
                  <button
                    className={`${getEdgeClass(edge)} absolute left-4 top-1/2 -translate-y-1/2 text-sm w-8 h-8 inline-flex justify-center items-center z-10 bg-[var(--text-white-black)]`}
                    onClick={handlePrev}
                    aria-label="Previous"
                  >
                    <SVGSelector
                      name="arrow-left-svg"
                      svgHeight={16}
                      svgWidth={16}
                      pathFill={"var(--secondary-color)"}
                    />
                  </button>
                )}
                {selectedIndex < vehicleDetails?.length - 1 && (
                  <button
                    className={`${getEdgeClass(edge)} absolute right-4 top-1/2 -translate-y-1/2 text-sm w-8 h-8 inline-flex justify-center items-center z-10 bg-[var(--text-white-black)]`}
                    onClick={handleNext}
                    aria-label="Next"
                  >
                    <SVGSelector
                      name="arrow-right-svg"
                      svgHeight={16}
                      svgWidth={16}
                      pathFill={"var(--secondary-color)"}
                    />
                  </button>
                )}
                <InnerImageZoom
                  src={
                    vehicleDetails?.[selectedIndex]?.downloadUrl ||
                    notAvailableImg
                  }
                  className={`${getEdgeClass(edge, "rounded-t-lg")} h-auto object-cover max-lg:w-full w-full !block`}
                  alt={`Vehicle ${selectedIndex + 1}`}
                  onError={(e) => {
                    e.target.src = notAvailableImg;
                  }}
                  zoomType="click"
                  zoomPreload={false}
                  onClick={handleModalToggle}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default VehicleDetailsZoomableImageModal;
