import { useState, useEffect } from "react";
import SVGSelector from "../common-components/SVGSelector";
import { scrollToTopFunction } from "../../utils";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      className={`fixed bottom-4 right-[14%] max-lg:right-[53px] max-xl:right-[53px] rounded-full shadow-lg transition-opacity duration-300 bg-[var(--primary-color)] p-2 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTopFunction}
    >
      <SVGSelector name={"arrow-up-with-car-svg"} />
    </button>
  );
};

export default ScrollToTopButton;
