/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  showTradeInForm,
  // showTradeInSummary,
  tradeInManufacturerInfo,
  tradeInManufacturersModelInfo,
  tradeInPostInfo,
  tradeInVariantsInfo,
  tradeInVehiclesInfo,
} from "../../redux/TradeInSlice";
import RadioButtonComponent from "../common-components/RadioButtonComponent";
import TradeInVehicleSubForm from "../TradeInVehicleSubForm";
import ChasisNumberField from "../ChasisNumberField";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import TradeInRegistrationDateFields from "../TradeInRegistrationDateFields/TradeInRegistrationDateFields";
import { culture, selectClass } from "../../constants/common-constants";
import SubmitButton from "../common-components/SubmitButton";
import ModalSummarySection from "../ModalSummarySection";
import ConsentPrivacyPolicyCheckboxField from "../ConsentPrivacyPolicyCheckboxField";
import VehicleDetailCommonWrap from "../VehicleDetailCommonWrap";
import {
  generateIsoDateStringForTradeInForm,
  getEdgeClass,
  modalOverlayOnAccessories,
} from "../../utils";
import MandatoryFieldText from "../common-components/MandatoryFieldText";
import SuccessMessageTextBox from "../SuccessToastMessageBox/SuccessToastMessageBox";
import SVGSelector from "../common-components/SVGSelector";
import ErrorToastMessageBox from "../ErrorToastMessageBox";
import Preloader from "../Preloader";

const TradeInModalForm = ({
  formikRef,
  vehicleDetails,
  handleModalToggle,
  isTradeInModalVisible,
}) => {
  const [tradeInManufacturer, setTradeInManufacturer] = useState("");
  const [tradeInModels, setTradeInModels] = useState([]);
  const [tradeInManId, setTradeInManId] = useState("");
  const [tradeInModelId, setTradeInModelId] = useState("");
  // const [tradeInVariantId, setTradeInVariantId] = useState("");
  const [tradeInModel, setTradeInModel] = useState("");
  const [tradeInVariant, setTradeInVariant] = useState("");
  const [tradeInVariants, setTradeInVariants] = useState([]);
  const [tradeInVehicles, setTradeInVehicles] = useState([]);
  const [isShowTradeInSubForm, setIsShowTradeInSubForm] = useState(false);
  const [isShowChasisOrManufacWrap, setIsShowChasisOrManufacWrap] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { edge = false, uiConfigData = false } = useSelector(
    (state) => state.uiConfig,
  );
  // const { isShowTradeInSummary = false } = useSelector(
  //   (state) => state.tradeIn,
  // );
  const personalDetailsRef = useRef(null);
  const vehiclePurchaseInfoRef = useRef(null);
  const documentUploadRef = useRef(null);

  const vinNumberConstantMessage = t(
    "/vehicleDetails.Please check the VIN entry.",
  );
  const [activeContainer, setActiveContainer] = useState("first");

  const [vehicleImageFiles, setVehicleImageFiles] = useState([]);
  const [registrationDocumentFiles, setRegistrationDocumentFiles] = useState(
    [],
  );
  const attachments = vehicleImageFiles
    ?.map((a) => a?.xIdentity)
    ?.concat(registrationDocumentFiles?.map((a) => a?.xIdentity));

  const handleFirstContainerClick = (setFieldValue) => {
    setActiveContainer("first");
    setFieldValue("activeContainer", "first");
    setIsShowChasisOrManufacWrap(false);
    setTradeInModelId("");
    setIsShowTradeInSubForm(false);
    setTradeInManId("");
    setTradeInManufacturer(t("./Please choose"));
    setTradeInModel(t("./Please choose"));
  };

  const handleSecondContainerClick = (setFieldValue) => {
    setActiveContainer("second");
    setFieldValue("chasisNumber", "");
    setFieldValue("activeContainer", "second");
    setIsShowChasisOrManufacWrap(false);
  };

  const tradeInInitialValues = {
    chasisNumber: "",
    manufacturer: "",
    model: "",
    variant: "",
    year: "",
    month: "",
    container: "",
    datECode: "",
    previousOwners: "",
    mileage: "",
    defects: "",
    additionalInformation: "",
    damageOption: "",
    damage: "",
    streetName: "",
    houseNumber: "",
    lastName: "",
    telephone: "",
    town: "",
    zipCode: "",
    vehicleImages: null,
    registrationDocuments: null,
    privatPerson: true,
    consentPrivacyPolicy: false,
    emailAddress: "",
    firstName: "",
    imprintUrl: uiConfigData?.urls?.imprint?.de,
    privacyUrl: uiConfigData?.urls?.privacy?.de,
    company: "",
    activeContainer: "first",
    manufacturerName: "",
    modelName: "",
    variantName: "",
  };
  const tradeInManufacturersData =
    useSelector((state) => state?.tradeIn?.tradeInManufacturersData) || [];

  useEffect(() => {
    if (!tradeInManId) {
      dispatch(tradeInManufacturerInfo());
    }
  }, [dispatch, tradeInManId]);

  useEffect(() => {
    const fetchTradeInData = async () => {
      try {
        // Fetch models if tradeInManId exists
        if (tradeInManId) {
          const modelsData = await dispatch(
            tradeInManufacturersModelInfo({ tradeInManId }),
          ).unwrap();
          setLoading(false);
          const updatedModels = modelsData.map((item) => ({ ...item }));
          setTradeInModels(updatedModels);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTradeInData();
  }, [dispatch, tradeInManId]);

  const scrollToSection = (ref) => {
    dispatch(showTradeInForm());
    setTimeout(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  // common dropdown handle change for maintaining trade-in manufacturers, models and variants
  const handleSelectChange = (type, setter, setFieldValue) => (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const id = selectedOption.getAttribute(`data-${type}-id`);
    const label = selectedOption.text;
    setter(label === t("/.Please choose") ? "" : label);
    setFieldValue(type, id);
    if (id == null) {
      setIsShowChasisOrManufacWrap(false);
    } else {
      setIsShowChasisOrManufacWrap(
        isShowChasisOrManufacWrap ? isShowChasisOrManufacWrap : false,
      );
    }

    switch (type) {
      case "manufacturer":
        setTradeInManId(id);
        setFieldValue("manufacturerName", label);
        setLoading(true);
        break;
      case "model":
        setTradeInModelId(id);
        setFieldValue("modelName", label);
        setLoading(true);
        fetchAllTradeInVariants(id);
        break;
      case "variant":
        setTradeInVehicles([]);
        setIsShowTradeInSubForm(false);
        setFieldValue("variantName", label);
        // setTradeInVariantId(id);
        fetchAllVehiclesOptions(id, setFieldValue);
        break;
      default:
        break;
    }
  };

  const fetchAllTradeInVariants = (modelId) => {
    if (modelId && tradeInManId) {
      let tradeInVariantApiParams = {
        tradeInModelId: modelId,
        tradeInManId,
      };
      dispatch(tradeInVariantsInfo(tradeInVariantApiParams))
        .unwrap()
        .then((tradeInVariantsDt) => {
          setTradeInVariants(tradeInVariantsDt);
          setLoading(false);
        });
    }
  };

  const fetchAllVehiclesOptions = (variantId, setFieldValue) => {
    if (tradeInManId && tradeInModelId && variantId) {
      let tradeInVehicleApiParams = {
        tradeInManId,
        tradeInModelId,
        tradeInVariantId: variantId,
      };
      setLoading(true);
      dispatch(tradeInVehiclesInfo(tradeInVehicleApiParams))
        .unwrap()
        .then((tradeInVehiclesDt) => {
          setIsShowTradeInSubForm(true);
          setLoading(false);
          setFieldValue(
            "container",
            tradeInVehiclesDt.length
              ? tradeInVehiclesDt[0]?.container || ""
              : "",
          );
          setFieldValue(
            "datECode",
            tradeInVehiclesDt.length
              ? tradeInVehiclesDt[0]?.datECode || ""
              : "",
          );
          if (tradeInVehiclesDt.length > 1) {
            setTradeInVehicles(tradeInVehiclesDt);
          }
        });
    }
  };

  const handleChooseVehicle = () => {
    setIsShowTradeInSubForm(isShowTradeInSubForm);
  };

  const tradeInValidationSchema = Yup.object({
    // activeContainer: Yup.string().required(),
    chasisNumber: Yup.string().when("activeContainer", {
      is: "first",
      then: (schema) =>
        schema
          .length(17, vinNumberConstantMessage)
          .matches(/^[A-HJ-NPR-Z0-9]*$/, vinNumberConstantMessage)
          .required("Chasis number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    manufacturer: Yup.string().when("activeContainer", {
      is: "second",
      then: (schema) => schema.required("Manufacturer is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    model: Yup.string().when("activeContainer", {
      is: "second",
      then: (schema) => schema.required("Model is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    variant: Yup.string().when("activeContainer", {
      is: "second",
      then: (schema) => schema.required("Variant is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    year: Yup.string().required("Year is required"),
    month: Yup.string().required("Month is required"),
    previousOwners: Yup.string().required("Previous owner is required"),
    mileage: Yup.number().required("Mileage is required"),
    condition: Yup.string().required("Condition is required"),
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
    company: Yup.string().when("privatPerson", {
      is: false,
      then: (schema) =>
        schema.required(t("/vehicleDetails.Please enter company name")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const toggleChasisNumberHandler = (value) => {
    setIsShowChasisOrManufacWrap(value);
  };
  const campaign = sessionStorage.getItem("campaign");
  const source = sessionStorage.getItem("source");

  const getFinalValidValuesForFormSubmission = (formValues) => {
    let validValues = {
      privatPerson: formValues?.privatPerson || false,
      firstname: formValues?.firstName || "",
      surname: formValues?.lastName || "",
      company: formValues?.company || "",
      streetNumber:
        `${formValues?.houseNumber} ${formValues?.streetName}` || "",
      zipCode: formValues?.zipCode || "",
      town: formValues?.town || "",
      telephone: formValues?.telephone || "",
      emailAddress: formValues?.emailAddress || "",
      tradeIn: {
        offeredVehicle: {
          manufacturer: formValues?.manufacturer || "",
          model: formValues?.model || "",
          variant: formValues?.variant || "",
          firstRegistrationDate: generateIsoDateStringForTradeInForm(
            formValues?.year,
            formValues?.month,
          ),
          previousOwners: formValues?.previousOwners || "",
          mileage: formValues?.mileage || "",
          condition: formValues?.condition || "",
          damage: formValues?.damage || "",
          damageOption: formValues?.damageOption || "",
          defects: formValues?.defects || false,
          additionalInformation: formValues?.additionalInformation || "",
          datECode: formValues?.datECode || "",
          container: formValues?.container || "",
          vin: formValues?.chasisNumber || "",
        },
        ignoreDatErrors: true,
        attachments: attachments,
      },
      consentPrivacyPolicy: formValues?.consentPrivacyPolicy || false,
      imprintUrl: formValues?.imprintUrl || "",
      privacyUrl: formValues?.privacyUrl || "",
      culture: culture,
      reference: "",
      vehicleId: vehicleDetails?.id,
      ...(campaign &&
        source && {
          googleAdTrackingInfo: {
            CampaignId: campaign,
            source: source,
          },
        }),
    };

    return validValues;
  };

  useEffect(() => {
    modalOverlayOnAccessories(isTradeInModalVisible);
  }, [isTradeInModalVisible]);

  const tradeInSubmitHandler = async (values, resetForm) => {
    try {
      let validValues = getFinalValidValuesForFormSubmission(values);
      dispatch(tradeInPostInfo(validValues))
        ?.unwrap()
        .then((tradeInPostRes) => {
          console.log(tradeInPostRes, "tradeInPostRes");
          if (tradeInPostRes) {
            toast.success(
              <SuccessMessageTextBox
                primaryText={`${t("/vehicleDetails.Thank You")} ${values?.firstName} ${values?.lastName}`}
                secondaryTextLines={[
                  t(
                    "/vehicleDetails.We have received your non-binding vehicle purchase request.",
                  ),
                  t(
                    "/vehicleDetails.In the next few minutes you will receive a non-binding vehicle valuation by email.",
                  ),
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
                primaryText={t("/vehicleDetails.Couldn't submit a trade in!")}
              />,
              {
                className: `wrong-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
                icon: <SVGSelector name="exclaimation-transfer-code-svg" />,
              },
            );
          }
          dispatch(showTradeInForm());
          setVehicleImageFiles([]);
          setRegistrationDocumentFiles([]);
          handleModalToggle();
          resetForm();
        });
    } catch (error) {
      console.error("Error in tradeInSubmitHandler:", error);
    }
  };

  const renderFieldsBasedOnModelId = (errors, setFieldValue) => {
    return (
      <>
        <TradeInRegistrationDateFields errors={errors} />
        <div className="flex w-full gap-6">
          <div className="w-full p-4">
            <label className="flex items-center mb-4" htmlFor="variant">
              {t("/.Variant")}&nbsp;
              <span className="text-red-700 pr-2">*</span>
            </label>
            <div className="flex-auto">
              <Field
                as="select"
                className={`${selectClass(edge)} ${
                  errors?.variant
                    ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                    : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
                }`}
                name="variant"
                id="variant"
                value={tradeInVariant}
                onChange={handleSelectChange(
                  "variant",
                  setTradeInVariant,
                  setFieldValue,
                )}
              >
                <option value="">{t("/.Please choose")}</option>
                {tradeInVariants.length > 0 &&
                  tradeInVariants.map((eachVariantItem, eachVariantIndex) => (
                    <option
                      key={eachVariantIndex}
                      value={eachVariantItem.name}
                      data-variant-id={eachVariantItem.id}
                    >
                      {" "}
                      {eachVariantItem.name}{" "}
                    </option>
                  ))}
              </Field>
            </div>
          </div>
        </div>
        {tradeInVehicles?.length > 1 && (
          <RadioButtonComponent
            setFieldValue={setFieldValue}
            tradeInVehiclesOptions={tradeInVehicles}
            onChangeChooseVehicleHandler={handleChooseVehicle}
          />
        )}
      </>
    );
  };

  const TradeInVehiclePurchaseMainContent = () => {
    return (
      <div className="mt-4 ml-5 text-[var(--davy-gray-color)] space-y-1 text-sm">
        <p>
          {t(
            "/vehicleDetails.Would you like to trade in your current vehicle?",
          )}
        </p>
        <p>
          {t(
            "/vehicleDetails.We would be happy to work with you to determine a fair purchase price. Please fill out the following form. You will then receive an email with a non-binding price proposal.",
          )}
        </p>
      </div>
    );
  };

  const ManufacturerAndModelList = ({ setFieldValue, errors }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClick = () => {
        if (activeContainer !== "second") {
          handleSecondContainerClick(setFieldValue);
        }
      };
      const container = containerRef.current;
      if (container) {
        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
      }
    }, [activeContainer, setFieldValue]);

    const duplicateModelNames = tradeInModels?.reduce((acc, item, _, arr) => {
      const count = arr?.filter((i) => i?.name === item?.name)?.length;
      if (count > 1 && !acc?.includes(item?.name)) {
        acc?.push(item?.name);
      }
      return acc;
    }, []);

    return (
      <>
        <div className="flex max-md:flex-col relative" ref={containerRef}>
          {activeContainer !== "second" && (
            <button
              type="button"
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSecondContainerClick(setFieldValue);
              }}
            />
          )}
          <div className="w-[35%] max-md:w-full">
            <img
              src="https://cdn.dein.auto/pxc-os/content/assets/images/online-sales/car.png"
              className="w-full"
              alt="Car-Without-Number-Plate-Image"
            />
          </div>
          <div className="w-[65%] max-md:w-full">
            <div className="pl-10 max-md:pl-0">
              <div className="mb-4">
                <label
                  className="flex items-center mb-4"
                  htmlFor="manufacturer"
                >
                  {t("/vehicles.Manufacturer")}&nbsp;
                  <span className="text-red-700 pr-2">*</span>
                </label>
                <div className="flex-auto">
                  <Field
                    as="select"
                    className={
                      isShowChasisOrManufacWrap
                        ? `${selectClass(edge)} cursor-not-allowed`
                        : `${selectClass(edge)} ${
                            errors?.manufacturer
                              ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                              : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
                          }`
                    }
                    name="manufacturer"
                    id="manufacturer"
                    value={tradeInManufacturer}
                    onChange={
                      isShowChasisOrManufacWrap
                        ? () => {}
                        : handleSelectChange(
                            "manufacturer",
                            setTradeInManufacturer,
                            setFieldValue,
                          )
                    }
                    disabled={activeContainer !== "second"}
                  >
                    <option>{t("/.Please choose")}</option>
                    {tradeInManufacturersData?.length > 0
                      ? tradeInManufacturersData?.map(
                          (
                            tradeInManufacturerItem,
                            tradeInManufacturerIndex,
                          ) => {
                            return (
                              <option
                                key={tradeInManufacturerIndex}
                                value={tradeInManufacturerItem.name}
                                data-manufacturer-id={
                                  tradeInManufacturerItem.id
                                }
                              >
                                {tradeInManufacturerItem?.name}
                              </option>
                            );
                          },
                        )
                      : null}
                  </Field>
                </div>
              </div>
              <div>
                <label className="flex items-center mb-4" htmlFor="model">
                  {t("/vehicles.Models")}&nbsp;
                  <span className="text-red-700 pr-2">*</span>
                </label>
                <div className="flex-auto">
                  <Field
                    as="select"
                    className={
                      isShowChasisOrManufacWrap
                        ? `${selectClass(edge)} cursor-not-allowed`
                        : `${selectClass(edge)} ${
                            errors?.manufacturer
                              ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                              : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
                          }`
                    }
                    name="model"
                    id="model"
                    value={tradeInModel}
                    onChange={handleSelectChange(
                      "model",
                      setTradeInModel,
                      setFieldValue,
                    )}
                    disabled={activeContainer !== "second"}
                  >
                    <option>{t("/.Please choose")}</option>
                    {tradeInModels?.map((modelItem, modelIndex) => (
                      <option
                        value={modelItem.name}
                        key={modelIndex}
                        data-model-id={modelItem.id}
                      >
                        {duplicateModelNames?.includes(modelItem?.name)
                          ? `${modelItem?.name} - ab ${modelItem?.constructionTimeFromYear}`
                          : modelItem?.name}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  if (!isTradeInModalVisible) return null;
  return (
    <>
      {loading && <Preloader />}
      {vehicleDetails ? (
        <div className="px-8">
          <VehicleDetailCommonWrap
            vehicleDetails={vehicleDetails}
            isTradeInForm={true}
          />
        </div>
      ) : null}
      <div className="px-8">
        <Formik
          innerRef={formikRef}
          initialValues={tradeInInitialValues}
          validationSchema={tradeInValidationSchema}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            tradeInSubmitHandler(values, resetForm);
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <TradeInVehiclePurchaseMainContent />
              <div
                className={`${getEdgeClass(edge)} bg-[var(--whitesmoke-color)] mt-4 p-4 ${activeContainer !== "first" ? "disabled-dropdown" : ""}`}
                onClick={() => handleFirstContainerClick(setFieldValue)}
              >
                <ChasisNumberField
                  isDisableChasisField={!isShowChasisOrManufacWrap}
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  toggleChasisNumberHandler={toggleChasisNumberHandler}
                />
              </div>

              <StyledHeadingBox
                header={t("/vehicleDetails.or")}
                className={"mt-0"}
              />
              <div
                className={`${getEdgeClass(edge)} bg-[var(--whitesmoke-color)] p-4 ${activeContainer !== "second" ? "disabled-dropdown" : ""}`}
                onClick={() => handleSecondContainerClick(setFieldValue)}
              >
                <h5 className="font-medium text-xl">
                  {t("/vehicleDetails.Manufacturer and model selection")}
                </h5>
                <ManufacturerAndModelList
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
              </div>

              {tradeInModelId &&
                renderFieldsBasedOnModelId(errors, setFieldValue)}

              {isShowChasisOrManufacWrap && !errors.chasisNumber && (
                <>
                  <div
                    className={`${getEdgeClass(edge)} bg-[var(--whitesmoke-color)] p-4 mt-6`}
                  >
                    <h5 className="font-medium text-xl">
                      {t("/vehicleDetails.Vehicle History")}
                    </h5>
                    <TradeInRegistrationDateFields
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                    />
                    <TradeInVehicleSubForm
                      isShowSubHeading={false}
                      setFieldValue={setFieldValue}
                      vehicleImageFiles={vehicleImageFiles}
                      setVehicleImageFiles={setVehicleImageFiles}
                      registrationDocumentFiles={registrationDocumentFiles}
                      setRegistrationDocumentFiles={
                        setRegistrationDocumentFiles
                      }
                      values={values}
                      errors={errors}
                      touched={touched}
                      personalDetailsRef={personalDetailsRef}
                      vehiclePurchaseInfoRef={vehiclePurchaseInfoRef}
                      documentUploadRef={documentUploadRef}
                    />
                  </div>
                </>
              )}
              {isShowTradeInSubForm && (
                <TradeInVehicleSubForm
                  isShowSubHeading={true}
                  setFieldValue={setFieldValue}
                  values={values}
                  vehicleImageFiles={vehicleImageFiles}
                  setVehicleImageFiles={setVehicleImageFiles}
                  registrationDocumentFiles={registrationDocumentFiles}
                  setRegistrationDocumentFiles={setRegistrationDocumentFiles}
                  errors={errors}
                  touched={touched}
                  personalDetailsRef={personalDetailsRef}
                  vehiclePurchaseInfoRef={vehiclePurchaseInfoRef}
                  documentUploadRef={documentUploadRef}
                />
              )}
              <ConsentPrivacyPolicyCheckboxField
                setFieldValue={setFieldValue}
                values={values}
              />
              <SubmitButton
                title={t("/vehicleDetails.Submit")}
                type="submit"
                containerClass="flex-1"
                buttonClass="w-full"
                isDisabled={
                  !values?.firstName ||
                  !values?.lastName ||
                  !values?.telephone ||
                  !values?.emailAddress ||
                  !values?.mileage ||
                  !values.condition ||
                  !values?.previousOwners ||
                  !values?.year ||
                  !values?.month ||
                  (!values.privatPerson && !values?.company) ||
                  !values?.consentPrivacyPolicy
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
                      vehiclePurchaseInfoRef,
                      documentUploadRef,
                    }}
                    isTradeInModalSummaryMainHeading={true}
                  />
                  <ConsentPrivacyPolicyCheckboxField
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                  <div className="flex gap-2">
                    <SubmitButton
                      title={t("/vehicles.Back")}
                      onClick={() => dispatch(showTradeInForm())}
                      containerClass="flex-1"
                      buttonClass="w-full"
                    />
                    <SubmitButton
                      title={t("/vehicleDetails.Submit")}
                      isDisabled={!values?.consentPrivacyPolicy}
                      containerClass="flex-1"
                      buttonClass="w-full"
                      type="submit"
                    />
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default TradeInModalForm;
