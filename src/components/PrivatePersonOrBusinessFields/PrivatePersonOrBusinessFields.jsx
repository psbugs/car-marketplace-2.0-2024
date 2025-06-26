import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";
import SVGSelector from "../common-components/SVGSelector";

const PrivatePersonOrBusinessFields = ({
  setFieldValue,
  privatePerson,
  setPrivatePerson,
}) => {
  const { t } = useTranslation();
  const { edge = false } = useSelector((state) => state?.uiConfig);
  return (
    <ul className="flex text-sm font-medium text-center gap-3 mb-2 max-[360px]:flex-col items-stretch">
      <li className="w-2/4 max-md:w-full">
        <div
          className={`flex h-full cursor-pointer border border-[#cccccc] p-2 text-lg font-medium ${getEdgeClass(edge)}  py-6 gap-2 items-center w-full justify-center max-md:gap-2 max-md:p-2 max-md:text-base ${
            privatePerson
              ? "border-[var(--primary-dark-color)] text-[var(--primary-dark-color)] border-2"
              : "text-[#D9D9D9]"
          }`}
          onClick={() => {
            setPrivatePerson(true);
            setFieldValue && setFieldValue("company", "");
            setFieldValue && setFieldValue("privatPerson", true);
          }}
        >
          <SVGSelector
            name="people-svg"
            pathFill={privatePerson ? `var(--primary-dark-color)` : "#D9D9D9"}
          />
          {t("/vehicleDetails.Private Person")}
        </div>
      </li>
      <li className="w-2/4 max-md:w-full" role="presentation">
        <div
          className={`flex h-full p-4 cursor-pointer border border-[#cccccc]  text-lg font-medium ${getEdgeClass(edge)} py-6 fill=[var(--black-color)] gap-6 items-center w-full justify-center max-md:gap-2 max-md:p-2 max-md:text-base 
        ${
          !privatePerson
            ? "border-[var(--primary-dark-color)] text-[var(--primary-dark-color)] border-2"
            : "text-[#D9D9D9]"
        }`}
          onClick={() => {
            setPrivatePerson(false);
            setFieldValue && setFieldValue("privatPerson", false);
          }}
        >
          <span>
            <SVGSelector
              name="company-svg"
              pathFill={
                !privatePerson ? `var(--primary-dark-color)` : "#D9D9D9"
              }
            />
          </span>
          {t("/vehicleDetails.Business")}
        </div>
      </li>
    </ul>
  );
};
export default PrivatePersonOrBusinessFields;
