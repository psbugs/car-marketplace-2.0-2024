import { getEdgeClass } from "../../utils";
import SVGSelector from "./SVGSelector";

const FilledButton = ({ title, onClick, classnames, edge, vehiclePage }) => {
  return (
    <button
      data-modal-target="default-modal"
      data-modal-toggle="default-modal"
      className={`flex items-center gap-2 bg-[var(--primary-color-single)] mt-8 text-base text-white py-[8px] border px-8 max-md:text-sm max-md:px-4 hover-text-primary-color ${classnames} ${getEdgeClass(edge, "rounded-[4px]")} hover:stroke-white`}
      type="button"
      onClick={onClick}
    >
      {vehiclePage ? <SVGSelector name="reset-svg" /> : null}

      {title}
    </button>
  );
};
export default FilledButton;
