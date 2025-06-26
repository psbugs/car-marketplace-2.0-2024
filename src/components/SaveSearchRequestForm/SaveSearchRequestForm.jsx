import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  culture,
  searchRequestDurationOptions,
  searchRequestTitleOptions,
  selectClass,
} from "../../constants/common-constants";
import { useSearchParams } from "react-router-dom";
import { saveSearchAgentInfo } from "../../redux/SearchAgentSlice";
import FiltersSummarySection from "../FiltersSummarySection/FiltersSummarySection";
import { useTranslation } from "react-i18next";
import FirstNameLastNameFields from "../FirstNameLastNameFields";
import ContactnoEmailFields from "../ContactnoEmailFields/ContactnoEmailFields";
import CustomModal from "../common-components/CustomModal";
import SubmitButton from "../common-components/SubmitButton";
import ConsentPrivacyPolicyCheckboxField from "../ConsentPrivacyPolicyCheckboxField";
import MandatoryFieldText from "../common-components/MandatoryFieldText";

const SaveSearchRequestForm = ({ closeSearchRequestPopupHandler }) => {
  const { uiConfigData, edge } = useSelector((state) => state.uiConfig);
  const { resultAppearance, urls } = uiConfigData || {};
  const [searchParams] = useSearchParams();
  const bodyQueParms = searchParams.get("bodies");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showSuccessPopup, setSuccessPopup] = useState(false);

  const defaultSearchReqInitialValues = {
    salutation: "",
    firstName: "",
    lastName: "",
    telephone: "",
    consentPrivacyPolicy: false,
    emailAddress: "",
    duration: "",
  };

  const searchReqValidationSchema = Yup.object({
    firstName: Yup.string().required(
      t("/vehicleDetails.Please enter first name"),
    ),
    lastName: Yup.string().required(
      t("/vehicleDetails.Please enter last name"),
    ),
    telephone: Yup.string().required(
      t("/vehicleDetails.Please enter your phone number"),
    ),
    emailAddress: Yup.string()
      .email(t("/vehicleDetails.This is not a valid email."))
      .required(t("/vehicleDetails.Please enter your email address")),
    duration: Yup.string().required("Enter a valid duration"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const finalApiSearchApiParams = { ...values };
      if (bodyQueParms) {
        finalApiSearchApiParams.bodies = bodyQueParms
          .replaceAll('"', "")
          .split(",");
      }
      if (resultAppearance) {
        Object.assign(finalApiSearchApiParams, {
          take: resultAppearance.defaultPageSize,
          orderby: resultAppearance.defaultOrdering,
          orderdir: resultAppearance.defaultOrderDir,
          pageLayout: resultAppearance.defaultResultPageLayout,
          manufacturersType: "ALL",
          imprintUrl: urls?.imprints?.de || "",
          privacyUrl: urls?.privacy?.de || "",
          unsubscribeUrl: "/pxc-amm-rc/gerd.html",
          culture: culture,
        });
      }
      await dispatch(saveSearchAgentInfo(finalApiSearchApiParams)).unwrap();
      setSuccessPopup(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormikFormForSearchRequest = () => (
    <Formik
      initialValues={defaultSearchReqInitialValues}
      validationSchema={searchReqValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, values, setFieldValue, touched }) => (
        <Form>
          <div className="p-4 md:p-5 space-y-4">
            <div className="block">
              <h4 className="text-[var(--secondary-color)] font-medium text-xl">
                {t("/.My Search")}
              </h4>
              <FiltersSummarySection
                isHideSearchRequestBtn
                callFromSaveSearchRequestForm={true}
              />
              <p className="text-[var(--davy-gray-color)] text-sm mt-5">
                {t(
                  "/.Set up your search request here and we will automatically inform you by email about newly arriving vehicles that match your search criteria.",
                )}
              </p>
            </div>
            <div className="block text-black">
              <div className="flex-auto my-2">
                <label
                  htmlFor="salutation"
                  className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
                >
                  {t("/.Salutation")}
                </label>
                <div className="flex-auto">
                  <Field
                    as="select"
                    id="salutation"
                    className={selectClass(edge)}
                    name="salutation"
                    required
                  >
                    {searchRequestTitleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(`/.${option.label}`)}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <FirstNameLastNameFields errors={errors} touched={touched} />
              <ContactnoEmailFields errors={errors} touched={touched} />
              <div className="block mb-6">
                <label
                  htmlFor="duration"
                  className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
                >
                  {t("/.Duration of the search order")}
                </label>
                <Field
                  as="select"
                  id="duration"
                  className={selectClass(edge)}
                  name="duration"
                  required
                >
                  {searchRequestDurationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`/.${option.label}`)}
                    </option>
                  ))}
                </Field>
              </div>
              <ConsentPrivacyPolicyCheckboxField
                setFieldValue={setFieldValue}
                values={values}
              />
            </div>
          </div>
          <SubmitButton
            title={t("/vehicleDetails.Submit")}
            isDisabled={!values?.consentPrivacyPolicy}
          />
          <MandatoryFieldText />
        </Form>
      )}
    </Formik>
  );

  const renderSuccessMessagePopup = () => (
    <>
      <div className="p-8">
        <div className="p-4 md:p-5 space-y-4 text-green-700 bg-[#d4edda]">
          <p>
            {t(
              "/.Your personal search query has now been set up. As soon as a vehicle that matches your search criteria is added, you will receive a reminder by email.",
            )}
          </p>
        </div>
      </div>
      <div
        className="flex items-center justify-end p-4 md:p-5 border-t border-[var(--gray-color)] rounded-b"
        onClick={closeSearchRequestPopupHandler}
      >
        <button
          type="button"
          className="block bg primary-bg-color bg primary-bg-color bg primary-bg-color text-base text-white rounded-[4px] py-[10px] border px-8 max-md:text-sm max-md:px-4 hover-text-primary-color"
        >
          {t("/.Close the Window")}
        </button>
      </div>
    </>
  );

  return (
    <CustomModal
      isVisible={true}
      handleModalToggle={closeSearchRequestPopupHandler}
      modalHeader={t("/.Set up a search request")}
      modalContent={
        showSuccessPopup
          ? renderSuccessMessagePopup()
          : renderFormikFormForSearchRequest()
      }
    />
  );
};

export default SaveSearchRequestForm;
