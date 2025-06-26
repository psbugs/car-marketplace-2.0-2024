import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const SubmitButton = ({
  title,
  isDisabled,
  onClick,
  buttonInEnd,
  containerClass,
  buttonClass,
  type,
}) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  return (
    <div
      className={`flex items-center ${buttonInEnd ? "justify-end" : "justify-center"} py-4 ${containerClass}`}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={`block text-base ${getEdgeClass(edge)} py-[10px] border px-8 max-md:text-sm max-md:px-4 text-white ${
          isDisabled
            ? "cursor-not-allowed bg-gray-400"
            : "cursor-pointer bg-[var(--primary-color-single)]  hover-text-primary-color hover:bg-white"
        } ${buttonClass}`}
      >
        {title}
      </button>
    </div>
  );
};
export default SubmitButton;
