import React, { useState, useRef, useEffect } from "react";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ThreeSixtyView = ({
  isVisible,
  handleModalToggle,
  panoramaImages,
  imagesLoaded,
  internalPanoramaImages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [backgroundPositionX, setBackgroundPositionX] = useState(-800);
  const [backgroundPositionY, setBackgroundPositionY] = useState(-400);
  const [isInternalView, setIsInternalView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const { t } = useTranslation();

  // Handle mouse/touch start
  const handleStart = (clientX, clientY) => {
    if (isDragging) return; // Prevent dragging if already zooming
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
  };

  // Handle mouse/touch move for internal view
  const handleMoveInternal = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const sensitivity = 2;

    setBackgroundPositionX((prev) => prev + deltaX / sensitivity);
    setBackgroundPositionY((prev) => prev + deltaY / sensitivity);
    setStartX(clientX);
    setStartY(clientY);
  };

  // Handle mouse/touch move for external view
  const handleMoveExternal = (clientX) => {
    if (!isDragging) return;
    const deltaX = startX - clientX;
    const sensitivity = 12;
    const newIndex = currentIndex + Math.round(deltaX / sensitivity);

    setCurrentIndex(
      (newIndex + panoramaImages?.length) % panoramaImages?.length,
    );
    setStartX(clientX);
  };

  // Handle mouse/touch end
  const handleEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse and touch
  useEffect(() => {
    const container = containerRef.current;

    const onMouseDown = (e) => handleStart(e?.clientX, e?.clientY);
    const onMouseMove = (e) =>
      isInternalView
        ? handleMoveInternal(e?.clientX, e?.clientY)
        : handleMoveExternal(e?.clientX);
    const onMouseUp = () => handleEnd();

    const onTouchStart = (e) =>
      handleStart(e?.touches?.[0]?.clientX, e?.touches?.[0]?.clientY);
    const onTouchMove = (e) =>
      isInternalView
        ? handleMoveInternal(e?.touches?.[0]?.clientX, e?.touches?.[0]?.clientY)
        : handleMoveExternal(e?.touches?.[0]?.clientX);
    const onTouchEnd = () => handleEnd();

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);

      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    isDragging,
    startX,
    startY,
    currentIndex,
    backgroundPositionX,
    backgroundPositionY,
    isInternalView,
  ]);

  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    if (autoRotate && !isInternalView) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % panoramaImages?.length);
      }, 200); // Adjust interval for rotation speed
      return () => clearInterval(interval);
    }
  }, [autoRotate, panoramaImages?.length, isInternalView]);

  const toggleFullscreen = () => {
    const container = containerRef?.current;
    if (document?.fullscreenElement) {
      document?.exitFullscreen();
    } else {
      container?.requestFullscreen();
    }
  };

  // Handle Previous button click for external view
  const handlePrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + panoramaImages?.length) % panoramaImages?.length,
    );
  };

  // Handle Next button click for external view
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % panoramaImages?.length);
  };

  // Toggle between external and internal views
  const toggleInternalView = () => {
    setIsInternalView((prev) => !prev);
    setBackgroundPositionX(-800);
    setBackgroundPositionY(-400);
    setZoomLevel(1);
  };

  // Handle directional button clicks for internal view
  const moveInternalView = (dir) => {
    const step = 50;

    switch (dir) {
      case "up":
        setBackgroundPositionY((prev) => prev + step);
        break;
      case "down":
        setBackgroundPositionY((prev) => prev - step);
        break;
      case "left":
        setBackgroundPositionX((prev) => prev + step);
        break;
      case "right":
        setBackgroundPositionX((prev) => prev - step);
        break;
      default:
        console.warn("Invalid direction:", dir);
        break;
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
    }
  };

  // Handle double-click to toggle zoom
  const handleDoubleClick = () => {
    setZoomLevel((prev) => (prev === 1 ? 2 : 1));
  };

  const btnClass = "bg-black bg-opacity-50 text-white px-4 py-2 rounded";

  const preventDoubleClickZoom = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      {isVisible ? (
        <div
          // aria-hidden="true"
          className={`${
            isVisible ? "flex" : "hidden"
          } overflow-y-auto overflow-x-hidden fixed bg-[#0000005e] h-full top-0 right-0 left-0 z-50 justify-center items-center md:inset-0`}
        >
          <div className="relative p-4 w-full max-w-[850px] max-h-full">
            <div
              className={`${getEdgeClass(edge)} bg-[var(--white-shade)] shadow p-4`}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  aria-label="Close"
                  className="float-right p-2"
                >
                  <SVGSelector
                    name="cross-svg"
                    svgHeight={16}
                    svgWidth={16}
                    pathStroke={"var(--secondary-color)"}
                  />
                </button>
                <div
                  ref={containerRef}
                  className="relative w-full h-[500px] overflow-hidden cursor-grab transition-fullscreen"
                  onDoubleClick={handleDoubleClick}
                >
                  {imagesLoaded &&
                  (isInternalView
                    ? internalPanoramaImages
                    : panoramaImages?.length > 0) ? (
                    isInternalView ? (
                      <div
                        style={{
                          backgroundImage: `url(${internalPanoramaImages?.[0]?.downloadUrl})`,
                          backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
                          backgroundSize: "auto 250%",
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: "center center",
                        }}
                        className="w-full h-full bg-repeat-x transition-bg transition-zoom"
                        draggable="false"
                      />
                    ) : (
                      <img
                        src={panoramaImages[currentIndex]?.downloadUrl}
                        alt={`360 View - ${currentIndex + 1}`}
                        className="w-full h-full object-cover transition-img"
                        draggable="false"
                      />
                    )
                  ) : (
                    <div className="flex justify-center items-center h-full bg-gray-200">
                      <p>{t("/vehicleDetails.Loading images")}...</p>
                    </div>
                  )}
                  {imagesLoaded &&
                  (isInternalView
                    ? internalPanoramaImages
                    : panoramaImages?.length > 0) ? (
                    <>
                      {!isInternalView ? (
                        <>
                          <button
                            onClick={handlePrevious}
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${btnClass}`}
                          >
                            &lt;
                          </button>
                          <button
                            onClick={handleNext}
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${btnClass}`}
                          >
                            &gt;
                          </button>
                        </>
                      ) : null}
                      {!isInternalView ? (
                        <button
                          onClick={() => setAutoRotate(!autoRotate)}
                          className={`absolute top-4 right-4 ${btnClass}`}
                        >
                          {autoRotate
                            ? t("/vehicleDetails.Pause")
                            : t("/vehicleDetails.Play")}
                        </button>
                      ) : null}
                      <button
                        onClick={toggleFullscreen}
                        className={`absolute top-4 left-4 ${btnClass}`}
                      >
                        {t("/vehicleDetails.Fullscreen")}
                      </button>
                      {internalPanoramaImages?.length ? (
                        <button
                          onClick={toggleInternalView}
                          className={`absolute bottom-4 left-4 ${btnClass}`}
                          onDoubleClick={preventDoubleClickZoom}
                        >
                          {isInternalView
                            ? t("/vehicleDetails.External view")
                            : t("/vehicleDetails.Internal view")}
                        </button>
                      ) : null}
                      {isInternalView ? (
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <button
                            onClick={() => moveInternalView("up")}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveInternalView("down")}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => moveInternalView("left")}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            ←
                          </button>
                          <button
                            onClick={() => moveInternalView("right")}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            →
                          </button>
                          <button
                            onClick={handleZoomIn}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            +
                          </button>
                          <button
                            onClick={handleZoomOut}
                            className={btnClass}
                            onDoubleClick={preventDoubleClickZoom}
                          >
                            -
                          </button>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ThreeSixtyView;
