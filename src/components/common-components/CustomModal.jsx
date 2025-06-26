import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";
import SVGSelector from "./SVGSelector";

const CustomModal = ({
  isVisible,
  handleModalToggle,
  modalHeader,
  modalContent,
  customPopupWidth,
}) => {
  const { edge } = useSelector((state) => state?.uiConfig);
  const popUpWidth = customPopupWidth || 600;
  return (
    <div className="bg-[var(--whitesmoke-color)]">
      <div
        className={`${
          isVisible ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 bg-[#0000005e] h-full right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full`}
      >
        <div
          className={`relative w-full max-w-[${popUpWidth}px] ${getEdgeClass(edge)} bg-[var(--white-shade)] max-sm:top-[1.5rem] max-md:top-[5.5rem] top-[3rem]`}
        >
          <button
            type="button"
            className={`z-30 text-[var(--text-white-black)] top-2 absolute hover:text-gray-300 ${getEdgeClass(edge)} text-sm w-8 h-8 ms-auto inline-flex justify-end w-full px-4 py-2 items-center dark:hover:bg-gray-600 dark:hover:text-white`}
            onClick={handleModalToggle}
          >
            <SVGSelector
              name="cross-svg"
              pathStroke={"currentColor"}
              svgHeight={16}
              svgWidth={16}
            />
          </button>
          <div
            className={`pb-5 overflow-auto h-[90vh] custom-scrollbar mb-2 ${getEdgeClass(edge, "rounded-tr-lg")}`}
          >
            <div
              className={`z-[20] sticky top-0 bg-[var(--primary-dark-color)] text-[var(--text-white-black)] p-3 flex justify-center items-center ${getEdgeClass(edge, "rounded-tl-lg")}`}
            >
              <h3 className="text-2xl font-semibold">{modalHeader}</h3>
            </div>
            {modalContent}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomModal;
