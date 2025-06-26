import SVGSelector from "./SVGSelector";

const SuperscriptScrollToBottom = ({ title, className, onClick }) => {
  return (
    <sup className={`cursor-pointer ${className}`} onClick={onClick}>
      {title === "i" ? <SVGSelector name="i-svg" /> : null}
      {title === "ii" ? <SVGSelector name="ii-svg" /> : null}
      {title === "iii" ? <SVGSelector name="iii-svg" /> : null}
    </sup>
  );
};
export default SuperscriptScrollToBottom;
