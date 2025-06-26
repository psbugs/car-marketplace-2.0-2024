import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  formatDate,
  getEdgeClass,
  modalOverlayOnAccessories,
} from "../../utils";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import SubmitButton from "../common-components/SubmitButton";
import ConsentPrivacyPolicyCheckboxField from "../ConsentPrivacyPolicyCheckboxField";
import LicenseAndIDCardFields from "../LicenseAndIDCardFields/LicenseAndIDCardFields";
import ModalSummarySection from "../ModalSummarySection";
import {
  showTestDriveForm,
  // showSummary,
  requestTestDrive,
} from "../../redux/TestDriveSlice";
import DateAndTimeSelectionFields from "../DateAndTimeSelectionFields";
import { toast } from "react-toastify";
import SVGSelector from "../common-components/SVGSelector";
import VehicleDetailCommonWrap from "../VehicleDetailCommonWrap";
import PersonalInformationForm from "../PersonalInformationForm/PersonalInformationForm";
import MandatoryFieldText from "../common-components/MandatoryFieldText";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";
import SuccessMessageTextBox from "../SuccessToastMessageBox/SuccessToastMessageBox";
import ErrorToastMessageBox from "../ErrorToastMessageBox";
import Preloader from "../Preloader";
import { useSearchParams } from "react-router-dom";

const TestDriveModalForm = ({
  vehicleDetails,
  formikRef,
  handleModalToggle,
  isTestDriveModalVisible,
}) => {
  const [privatePerson, setPrivatePerson] = useState(true);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {
    // isSummarySection = false,
    loading = false,
  } = useSelector((state) => state.testDrive);
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  const { t } = useTranslation();
  const personalDetailsRef = useRef(null);
  const desiredDateRef = useRef(null);
  const documentUploadRef = useRef(null);
  const [driverLicenseFiles, setDriverLicenseFiles] = useState([]);
  const [idCardFiles, setIdCardFiles] = useState([]);
  const attachments = driverLicenseFiles
    ?.map((a) => a?.xIdentity)
    ?.concat(idCardFiles?.map((a) => a?.xIdentity));

  useEffect(() => {
    modalOverlayOnAccessories(isTestDriveModalVisible);
  }, [isTestDriveModalVisible]);

  const scrollToSection = (ref) => {
    dispatch(showTestDriveForm());
    setTimeout(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  const initialFormValues = {
    company: "",
    desiredDate: null,
    consentPrivacyPolicy: false,
    emailAddress: "",
    firstName: "",
    imprintUrl: uiConfigData?.urls?.imprint?.de,
    privacyUrl: uiConfigData?.urls?.privacy?.de,
    privatPerson: privatePerson,
    streetName: "",
    houseNumber: "",
    lastName: "",
    telephone: "",
    town: "",
    zipCode: "",
    driverLicense: null,
    idCard: null,
    timeValue: "",
  };
  const sendMessageValidationSchema = Yup.object().shape({
    firstName: Yup.string().required(
      t("/vehicleDetails.Please enter first name"),
    ),
    lastName: Yup.string().required(
      t("/vehicleDetails.Please enter last name"),
    ),
    telephone: Yup.string()
      .required(t("/vehicleDetails.Please enter your phone number"))
      .matches(
        /^[0-9+\-\s]+$/,
        t(
          "/vehicleDetails.Please check your input. Allowed characters are 0-9, +, - and spaces.",
        ),
      ),
    emailAddress: Yup.string()
      .email(t("/vehicleDetails.This is not a valid email."))
      .required(t("/vehicleDetails.Please enter your email address")),
    company: Yup.string().required(
      t("/vehicleDetails.Please enter company name"),
    ),
  });
  const campaign = sessionStorage.getItem("campaign");
  const source = sessionStorage.getItem("source");

  const submitHandler = (formValue) => {
    const streetNumber = `${formValue?.streetName}, ${formValue?.houseNumber}`;
    const payload = {
      ...formValue,
      streetNumber: streetNumber,
      vehicleId: vehicleDetails?.id,
      testDrive: { DateTime: formatDate(formValue?.desiredDate), attachments },
      ...(campaign &&
        source && {
          googleAdTrackingInfo: {
            CampaignId: campaign,
            source: source,
          },
        }),
    };
    dispatch(requestTestDrive(payload))
      ?.unwrap()
      .then((res) => {
        if (res?.status === 200) {
          toast.success(
            <SuccessMessageTextBox
              primaryText={`${t("/vehicleDetails.Thank You")} ${payload?.firstName} ${payload?.lastName}`}
              secondaryTextLines={[
                t(
                  "/vehicleDetails.We have received your requested appointment for a test drive.",
                ),
                t("/vehicleDetails.We will contact you as soon as possible."),
                t("/vehicleDetails.Please check your email inbox."),
              ]}
            />,
            {
              className: `loaded-vehicles-by-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="checkmark-transfer-code-svg" />,
            },
          );
        } else {
          toast.error(
            <ErrorToastMessageBox
              primaryText={t("/vehicleDetails.Couldn't schedule test drive!")}
            />,
            {
              className: `wrong-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="exclaimation-transfer-code-svg" />,
            },
          );
        }
        setDriverLicenseFiles([]);
        setIdCardFiles([]);
        handleModalToggle();
      });
  };

  return (
    <div className="px-8 pb-4 max-md:p-4">
      {loading && <Preloader />}
      {!searchParams?.has("tradeIn") && (
        <VehicleDetailCommonWrap
          vehicleDetails={vehicleDetails}
          currency={currency}
        />
      )}
      <Formik
        innerRef={formikRef}
        validationSchema={sendMessageValidationSchema}
        initialValues={initialFormValues}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <DateAndTimeSelectionFields
              setFieldValue={setFieldValue}
              vehicleDetails={vehicleDetails}
              values={values}
              desiredDateRef={desiredDateRef}
            />
            <LicenseAndIDCardFields
              setFieldValue={setFieldValue}
              values={values}
              driverLicenseFiles={driverLicenseFiles}
              setDriverLicenseFiles={setDriverLicenseFiles}
              idCardFiles={idCardFiles}
              setIdCardFiles={setIdCardFiles}
              vehicleDetails={vehicleDetails}
              documentUploadRef={documentUploadRef}
            />
            <PersonalInformationForm
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              personalDetailsRef={personalDetailsRef}
              privatePerson={privatePerson}
              setPrivatePerson={setPrivatePerson}
            />
            <ConsentPrivacyPolicyCheckboxField
              setFieldValue={setFieldValue}
              values={values}
            />
            <SubmitButton
              title={t("/vehicleDetails.Arrange a test drive")}
              type="submit"
              buttonClass="w-full"
              containerClass="flex-1"
              onClick={() => submitHandler(values)}
              isDisabled={
                !values?.firstName ||
                !values?.lastName ||
                !values?.telephone ||
                !values?.emailAddress ||
                (!privatePerson && !values?.company) ||
                !values?.desiredDate ||
                !values?.timeValue ||
                !values?.consentPrivacyPolicy ||
                loading
              }
            />
            <MandatoryFieldText />
            {/* KEPT IT FOR FURTHER CONFIRMATION */}
            {false && (
              <>
                <StyledHeadingBox header={t("/vehicleDetails.Summary")} />
                <ModalSummarySection
                  values={values}
                  scrollToSection={scrollToSection}
                  sectionRefs={{
                    personalDetailsRef,
                    desiredDateRef,
                    documentUploadRef,
                  }}
                />
                <ConsentPrivacyPolicyCheckboxField
                  setFieldValue={setFieldValue}
                  values={values}
                />
                <div className="flex gap-2">
                  <SubmitButton
                    title={t("/vehicles.Back")}
                    onClick={() => dispatch(showTestDriveForm())}
                    containerClass="flex-1"
                    buttonClass="w-full"
                  />
                  <SubmitButton
                    title={t("/vehicleDetails.Arrange a test drive")}
                    isDisabled={!values?.consentPrivacyPolicy || loading}
                    containerClass="flex-1"
                    buttonClass="w-full"
                    type="submit"
                    onClick={() => submitHandler(values)}
                  />
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default TestDriveModalForm;
