import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const FirstNameLastNameFields = ({ errors, touched }) => {
  const { edge } = useSelector((state) => state.uiConfig);
  const inputFieldClass = `${getEdgeClass(edge)} w-full bg-transparent text-sm py-3 px-4 pr-11 h-[48px]`;
  const { t } = useTranslation();
  return (
    <div className="flex gap-3 py-2 max-[360px]:flex-col">
      <div className="flex-auto my-2">
        <label
          className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
          htmlFor="firstName"
        >
          {t("/vehicleDetails.First Name")}
          <span className="text-red-700">*</span>
        </label>
        <div className="flex-auto">
          <Field
            name="firstName"
            type="text"
            className={`${inputFieldClass} ${
              errors?.firstName && touched?.firstName
                ? "border-[var(--red-color)]"
                : "border-[#8b8a8b]"
            }`}
          />
        </div>
      </div>
      <div className="flex-auto my-2">
        <label
          className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
          htmlFor="lastName"
        >
          {t("/vehicleDetails.Last Name")}
          <span className="text-red-700">*</span>
        </label>
        <div className="flex-auto">
          <Field
            name="lastName"
            type="text"
            className={`${inputFieldClass} ${
              errors?.lastName && touched?.lastName
                ? "border-[var(--red-color)]"
                : "border-[#8b8a8b]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
export default FirstNameLastNameFields;
