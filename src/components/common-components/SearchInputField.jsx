import { useSelector } from "react-redux";
import SVGSelector from "./SVGSelector";
import useDebouncedSearchParams from "../../hooks/useDebouncedParams";
import { getEdgeClass } from "../../utils";
const SearchInputField = ({
  searchInput,
  setSearchInput,
  placeholder,
  edgeClass,
  id,
  spanClassName,
  wrapperClassName,
  labelPrefix,
  paramName,
}) => {
  const { edge } = useSelector((state) => state.uiConfig);
  const handleModelExtensionChange = useDebouncedSearchParams();
  const handleInputChange = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    if (paramName) {
      handleModelExtensionChange({
        key: paramName,
        value: inputValue,
        labelPrefix,
      });
    }
  };

  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        type="text"
        id={id}
        className={`${getEdgeClass(edge, edgeClass)} h-[48px] w-full placeholder:text-[var(--placeholder-gray-color)] border border-[var(--placeholder-gray-color)] text-sm py-3 px-4 pr-11 bg-[var(--white-shade)] focus:ring-0 focus:border-[var(--gray-color)]`}
        placeholder={placeholder}
        value={searchInput}
        onChange={handleInputChange}
      />
      <span className={`absolute ${spanClassName}`}>
        <SVGSelector name={"magnifying-glass-svg"} />
      </span>
    </div>
  );
};
export default SearchInputField;
