import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getEdgeClass } from "../../utils";

const ConsentPrivacyPolicyCheckboxField = ({ setFieldValue, values }) => {
  const { t } = useTranslation();
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const handleCheckboxChange = () => {
    setFieldValue("consentPrivacyPolicy", !values?.consentPrivacyPolicy);
  };
  return (
    <div className="flex mt-4">
      <Field
        id="default-checkbox-p"
        type="checkbox"
        className={`w-5 h-5 text-xl primary-color ${getEdgeClass(edge)} focus:ring-blue-500 dark:focus:ring-[var(--gray-color)] focus:ring-0 dark:bg-white dark:border-gray-600`}
        name="consentPrivacyPolicy"
        checked={values?.consentPrivacyPolicy}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor="default-checkbox-p"
        className={`ms-2 text-sm font-medium cursor-pointer ${values?.consentPrivacyPolicy ? "text-[var(--davy-gray-color)]" : "text-[var(--red-color)]"} `}
        onClick={handleCheckboxChange}
      >
        {t(
          "/vehicleDetails.I consent to my data being processed in order to answer the request. I have taken note of the revocation instructions and consequences in the",
        )}{" "}
        <Link
          to="https://www.pixelconcept.de/datenschutz/"
          className="underline"
          target="_blank"
        >
          {t("/vehicleDetails.data protection regulations")}&nbsp;
        </Link>
        .
      </label>
    </div>
  );
};
export default ConsentPrivacyPolicyCheckboxField;
