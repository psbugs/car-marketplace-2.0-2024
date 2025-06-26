import parse from "html-react-parser";
import { useSelector } from "react-redux";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";
const ViewAllStdIconAndText = ({ htmlText }) => {
  const { edge } = useSelector((state) => state.uiConfig);
  return (
    <div
      className={`text-[var(--davy-gray-color)] bg-[var(--whitesmoke-color)] flex items-center gap-2 p-2 ${getEdgeClass(edge, "rounded-[4px]")}`}
    >
      <SVGSelector name="checkmark-svg" pathStroke={"var(--davy-gray-color)"} />
      {htmlText && (
        <span className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[30rem]  max-lg:max-w-[21rem] max-md:max-w-[30rem] max-sm:whitespace-normal max-md:text-sm">
          {parse(htmlText)}
        </span>
      )}
    </div>
  );
};
export default ViewAllStdIconAndText;
