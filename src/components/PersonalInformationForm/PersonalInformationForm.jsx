import React from "react";
import PrivatePersonOrBusinessFields from "../PrivatePersonOrBusinessFields";
import { Field } from "formik";
import FirstNameLastNameFields from "../FirstNameLastNameFields";
import AddressFields from "../AddressFields";
import ContactnoEmailFields from "../ContactnoEmailFields/ContactnoEmailFields";
import { getEdgeClass } from "../../utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";

const PersonalInformationForm = ({
  setFieldValue,
  errors,
  touched,
  personalDetailsRef,
  privatePerson,
  setPrivatePerson,
}) => {
  const { edge } = useSelector((state) => state.uiConfig);
  const inputFieldClass = `${getEdgeClass(edge)} w-full bg-transparent text-sm py-3 px-4 pr-11 h-[48px]`;
  const { t } = useTranslation();
  return (
    <>
      <div ref={personalDetailsRef}>
        <StyledHeadingBox header={t("/vehicleDetails.Personal details")} />
        <PrivatePersonOrBusinessFields
          privatePerson={privatePerson}
          setPrivatePerson={setPrivatePerson}
          setFieldValue={setFieldValue}
        />
        {!privatePerson && (
          <div className="flex gap-3 py-2 max-[360px]:flex-col">
            <div className="flex-auto">
              <label
                className="flex items-center gap-2 mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
                htmlFor="company"
              >
                {t("/vehicleDetails.Company")}
                <span className="text-red-700">*</span>
              </label>
              <div className="flex-auto">
                <Field
                  name="company"
                  type="text"
                  className={`${inputFieldClass} ${
                    errors?.company && touched?.company
                      ? "border-[var(--red-color)]"
                      : "border-[#8b8a8b]"
                  }`}
                />
              </div>
            </div>
          </div>
        )}
        <FirstNameLastNameFields errors={errors} touched={touched} />
        <AddressFields />
        <ContactnoEmailFields errors={errors} touched={touched} />
      </div>
    </>
  );
};

export default PersonalInformationForm;
