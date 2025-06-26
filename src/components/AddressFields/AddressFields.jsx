import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const AddressFields = () => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const { t } = useTranslation();
  const inputFieldClass = `${getEdgeClass(edge)} w-full bg-transparent text-sm py-3 px-4 pr-11 h-[48px]`;
  return (
    <div>
      <div className="flex gap-3 py-2 max-[360px]:flex-col">
        <div className="flex-auto basis-[145%]">
          <label
            className="flex items-center gap-2 mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
            htmlFor="streetName"
          >
            {t("/vehicleDetails.Street")}
          </label>
          <div className="flex-auto">
            <Field name="streetName" type="text" className={inputFieldClass} />
          </div>
        </div>
        <div className="flex-auto">
          <label
            className="flex items-center gap-2 mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
            htmlFor="houseNumber"
          >
            {t("/vehicleDetails.House No.")}
          </label>
          <div className="flex-auto">
            <Field name="houseNumber" type="text" className={inputFieldClass} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 py-2 max-[360px]:flex-col">
        <div className="flex-auto">
          <label
            className="flex items-center gap-2 mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
            htmlFor="zipCode"
          >
            {t("/vehicleDetails.Postcode")}
          </label>
          <div className="flex-auto">
            <Field name="zipCode" type="text" className={inputFieldClass} />
          </div>
        </div>
        <div className="flex-auto basis-[145%]">
          <label
            className="flex items-center gap-2 mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
            htmlFor="town"
          >
            {t("/vehicleDetails.Place")}
          </label>
          <div className="flex-auto">
            <Field name="town" type="text" className={inputFieldClass} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressFields;
