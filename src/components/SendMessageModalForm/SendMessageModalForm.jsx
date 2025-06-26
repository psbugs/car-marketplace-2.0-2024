import { Form, Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";
import FirstNameLastNameFields from "../FirstNameLastNameFields";
import ContactnoEmailFields from "../ContactnoEmailFields/ContactnoEmailFields";
import * as Yup from "yup";
import { postSendMessage } from "../../redux/VehiclesSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import SubmitButton from "../common-components/SubmitButton";
import ConsentPrivacyPolicyCheckboxField from "../ConsentPrivacyPolicyCheckboxField";
import PrivatePersonOrBusinessFields from "../PrivatePersonOrBusinessFields";
import AddressFields from "../AddressFields";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";
import MandatoryFieldText from "../common-components/MandatoryFieldText";

const SendMessageModalForm = ({
  vehicleDetails,
  formikRef,
  handleModalToggle,
}) => {
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const dispatch = useDispatch();
  const inputFieldClass = `${getEdgeClass(edge)} w-full bg-transparent text-sm py-3 px-4 pr-11 h-[48px]`;
  const [privatePerson, setPrivatePerson] = useState(true);
  const { t } = useTranslation();
  const initialFormValues = {
    additionalAnnotation: "",
    company: "",
    consentPrivacyPolicy: false,
    emailAddress: "",
    firstName: "",
    imprintUrl: uiConfigData?.urls?.imprint?.de,
    privacyUrl: uiConfigData?.urls?.privacy?.de,
    privatPerson: privatePerson,
    requestConsultation: false,
    requestIndividualInstalment: false,
    streetName: "",
    houseNumber: "",
    lastName: "",
    telephone: "",
    town: "",
    zipCode: "",
  };
  const sendMessageValidationSchema = Yup.object().shape({
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
  });
  const campaign = sessionStorage.getItem("campaign");
  const source = sessionStorage.getItem("source");

  const handleSubmitHandler = (formValue) => {
    const streetNumber = `${formValue.streetName}, ${formValue.houseNumber}`;

    const payload = {
      ...formValue,
      streetNumber: streetNumber,
      vehicleId: vehicleDetails?.id,
      ...(campaign &&
        source && {
          googleAdTrackingInfo: {
            CampaignId: campaign,
            source: source,
          },
        }),
    };

    dispatch(postSendMessage(payload))
      .unwrap()
      .then((data) => {
        if (data?.status === 200) {
          toast?.success(
            <p>
              {t("/vehicleDetails.Thank you for your inquiry.")} <br />{" "}
              {t("/vehicleDetails.We will contact you as soon as possible.")}
            </p>,
          );
        }
        handleModalToggle();
      })
      .catch((err) => {
        handleModalToggle();
        console.error(err, "err");
      });
  };

  return (
    <div className="px-8 pb-4 max-md:p-4">
      <Formik
        enableReinitialize
        innerRef={formikRef}
        validationSchema={sendMessageValidationSchema}
        initialValues={initialFormValues}
        onSubmit={handleSubmitHandler}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <div>
              <StyledHeadingBox
                header={t("/vehicleDetails.I am a...")}
                className={"mt-0"}
              />
              <PrivatePersonOrBusinessFields
                privatePerson={privatePerson}
                setPrivatePerson={setPrivatePerson}
              />
            </div>
            <div className={getEdgeClass(edge)}>
              <StyledHeadingBox header={t("/vehicleDetails.Contact Person")} />
              <div>
                <FirstNameLastNameFields errors={errors} touched={touched} />
                {!privatePerson && (
                  <>
                    <StyledHeadingBox header={t("/vehicleDetails.Address")} />

                    <div className="flex gap-3 p-2 max-[360px]:flex-col">
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
                    <AddressFields />
                  </>
                )}
                <StyledHeadingBox header={t("/vehicleDetails.Contact")} />
                <ContactnoEmailFields errors={errors} touched={touched} />
                <StyledHeadingBox
                  header={t("/vehicleDetails.Questions or Requests")}
                />
                <div className="flex gap-3 max-[360px]:flex-col">
                  <div className="flex mt-4 max-md:mt-4 flex-1 justify-center">
                    <div
                      role="checkbox"
                      aria-checked={values?.requestIndividualInstalment}
                      onClick={() =>
                        setFieldValue(
                          "requestIndividualInstalment",
                          !values?.requestIndividualInstalment,
                        )
                      }
                      className={`cursor-pointer p-2 ${getEdgeClass(edge)} flex flex-col items-center justify-center w-[100%] text-center gap-3 ${
                        values?.requestIndividualInstalment
                          ? "bg-[var(--primary-color-single)] text-white"
                          : "bg-gray-200"
                      } focus:ring-0 dark:bg-white dark:border-[#CCCCCC]`}
                    >
                      <SVGSelector
                        name="calculator-svg"
                        pathStroke={
                          values?.requestIndividualInstalment
                            ? "#ffffff"
                            : "#000000"
                        }
                        className="w-16 h-16"
                      />
                      <span
                        className={`ms-2 text-sm ${
                          values?.requestIndividualInstalment
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {t(
                          "/vehicleDetails.I would like an individual financing offer",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-4 max-md:mt-4 flex-1 justify-center">
                    <div
                      role="checkbox"
                      aria-checked={values?.requestConsultation}
                      onClick={() =>
                        setFieldValue(
                          "requestConsultation",
                          !values?.requestConsultation,
                        )
                      }
                      className={`cursor-pointer p-2 ${getEdgeClass(edge)} flex flex-col items-center justify-center w-[100%] text-center gap-3 ${
                        values?.requestConsultation
                          ? "bg-[var(--primary-color-single)] text-white"
                          : "bg-gray-200"
                      } focus:ring-0 dark:bg-white dark:border-[#CCCCCC]`}
                    >
                      <SVGSelector
                        name="person-svg"
                        pathStroke={
                          values?.requestConsultation ? "#ffffff" : "#000000"
                        }
                      />
                      <span
                        className={`ms-2 text-sm ${
                          values?.requestConsultation
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {t(
                          "/vehicleDetails.I would like to arrange a consultation",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <StyledHeadingBox header={t("/vehicleDetails.Further notes")} />
                <div className="flex-auto mt-4">
                  <div className="flex-auto">
                    <Field
                      name="additionalAnnotation"
                      as="textarea"
                      className={`${inputFieldClass} h-[100px]`}
                    />
                  </div>
                </div>
                <ConsentPrivacyPolicyCheckboxField
                  setFieldValue={setFieldValue}
                  values={values}
                />
                <SubmitButton
                  title={t("/vehicleDetails.Submit")}
                  isDisabled={!values?.consentPrivacyPolicy}
                />
              </div>
            </div>
            <MandatoryFieldText />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default SendMessageModalForm;
