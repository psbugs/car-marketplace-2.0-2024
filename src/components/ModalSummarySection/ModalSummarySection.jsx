import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass, timeFormatterForDropdownOptions } from "../../utils";
import SVGSelector from "../common-components/SVGSelector";
import GenerateDocumentImgPreview from "../GenerateDocumentImgPreview/GenerateDocumentImgPreview";

const ModalSummarySection = ({
  values,
  isTradeInModalSummaryMainHeading,
  scrollToSection,
  sectionRefs,
}) => {
  const { t } = useTranslation();
  const { edge } = useSelector((state) => state.uiConfig);
  const HeaderAndEditButton = ({ isFirstElement, onClickHandler, title }) => {
    return (
      <div className="flex justify-between">
        <div className={`${!isFirstElement && "mt-4"} font-semibold`}>
          {t(`/vehicleDetails.${title}`)}
        </div>
        <button onClick={onClickHandler}>
          <SVGSelector
            name="edit-svg"
            pathStroke={"var(--text-black-white)"}
            svgHeight={24}
            svgWidth={24}
          />
        </button>
      </div>
    );
  };
  const TickOrCrossSvg = ({ value }) =>
    value === "Yes" ? (
      <SVGSelector name="checkmark-svg" pathStroke={"#34B233"} />
    ) : (
      <SVGSelector
        name="cross-svg"
        pathStroke={"#FF0000"}
        svgHeight={16}
        svgWidth={16}
      />
    );

  const DetailsList = ({ items }) => (
    <ul className="divide-y divide-[var(--primary-color-single)] space-y-3 text-[15px]">
      {items?.map((item, index) => {
        const { label, value } = item;
        return value ? (
          <li key={index} className="flex justify-between flex-wrap gap-2 pt-3">
            <p>{label}</p>
            {label !== t("/vehicleDetails.The vehicle has no defects") ? (
              <p className="text-end">{value}</p>
            ) : (
              <TickOrCrossSvg value={value} />
            )}
          </li>
        ) : null;
      })}
    </ul>
  );

  const {
    firstName = false,
    lastName = false,
    streetName = false,
    houseNumber = false,
    zipCode = false,
    town = false,
    telephone = false,
    emailAddress = false,
    desiredDate = false,
    driverLicense = false,
    idCard = false,
    vehicleImages = false,
    registrationDocuments = false,
    model = false,
    manufacturer = false,
    variant = false,
    year = false,
    month = false,
    previousOwners = false,
    mileage = false,
    condition = false,
    defects = false,
    damageOption = false,
    additionalInformation = false,
    chasisNumber = false,
    damagedName = false,
    company = false,
    manufacturerName = false,
    modelName = false,
    variantName = false,
  } = values || {};

  const personalDetailsData = [
    {
      label: t("/vehicleDetails.Name"),
      value: firstName || lastName ? `${firstName} ${lastName}` : "-",
    },
    {
      label: t("/vehicleDetails.Address"),
      value:
        streetName || houseNumber || zipCode || town
          ? `${streetName} ${houseNumber} ${zipCode} ${town}`
          : "-",
    },
    {
      label: t("/vehicleDetails.Telephone Number"),
      value: telephone ? telephone : "-",
    },
    {
      label: t("/.Email Address"),
      value: emailAddress ? emailAddress : "-",
    },
  ];
  // if company supplied then append it to the personal data container
  if (company) {
    personalDetailsData.push({
      label: t("/vehicleDetails.Company"),
      value: company ? company : "-",
    });
  }
  const desiredDateData = [
    {
      label: t("/vehicleDetails.Date"),
      value: desiredDate ? desiredDate?.toLocaleDateString() : "-",
    },
    {
      label: t("/vehicleDetails.Time"),
      value: desiredDate
        ? `${timeFormatterForDropdownOptions(desiredDate)}`
        : "-",
    },
  ];

  const vehiclePurchaseDetails = [
    {
      label: t("/vehicles.First registration"),
      value: year && month ? `${month}/${year}` : "-",
    },
    {
      label: t("/vehicleDetails.Previous Owners"),
      value: previousOwners ? previousOwners : "-",
    },
    {
      label: t("/vehicles.Mileage"),
      value: mileage ? `${mileage} km` : "-",
    },
    {
      label: t("/vehicleDetails.Condition"),
      value: condition
        ? `${condition} ${condition === 1 ? t("/vehicleDetails.Star") : t("/vehicleDetails.Stars")}`
        : "-",
    },
    {
      label: t("/vehicleDetails.Does your vehicle have accident damage?"),
      value: damagedName ? damagedName : "-",
    },
    {
      label: t("/vehicleDetails.Your information about the accident damage"),
      value: damageOption ? damageOption : "-",
    },
    {
      label: t("/vehicleDetails.The vehicle has no defects"),
      value: defects ? `Yes` : "No",
    },
    {
      label: t(
        "/vehicleDetails.Description of the defect and/or further information about the vehicle",
      ),
      value: additionalInformation ? additionalInformation : "-",
    },
  ];

  // if valid manufacturer , model and variant exits in form values then append items
  if (manufacturer && model && variant) {
    let items = [
      {
        label: t("/.Manufacturer"),
        value: manufacturerName
          ? manufacturerName
          : manufacturer
            ? manufacturer
            : "-",
      },
      {
        label: t("/.Model"),
        value: modelName ? modelName : model ? model : "-",
      },
      {
        label: t("/.Variant"),
        value: variantName ? variantName : variant ? variant : "-",
      },
    ];
    vehiclePurchaseDetails?.push(...items);
  }

  // if valid chasisNumber found then append it to the items
  if (chasisNumber) {
    let chasisNoObj = {
      label: t("/vehicleDetails.FIN"),
      value: chasisNumber ? chasisNumber : "-",
    };
    vehiclePurchaseDetails?.push(chasisNoObj);
  }

  const renderMainHeadingForTradeInSummary = () => {
    return (
      <>
        <h4 className="text-xl font-medium">
          {t(`/vehicleDetails.Thank you`)} {firstName} {lastName}
        </h4>
        <p className="mb-4 mt-[7px] text-sm">
          {t(
            `/vehicleDetails.On this page you can check the data you have entered and change it if necessary before sending your request.`,
          )}
        </p>
      </>
    );
  };

  const handleScroll = (ref) => {
    scrollToSection(ref);
  };

  const ImagePreviewField = ({
    imgFieldName,
    imgFieldLabel,
    isTradeInForm,
  }) => {
    return imgFieldName?.length ? (
      <div
        className={
          imgFieldName?.length > 0 ? "" : "flex items-center justify-between"
        }
      >
        <div className="flex justify-between flex-wrap gap-2 pt-3">
          {t(`/vehicleDetails.${imgFieldLabel}`)}
        </div>
        {imgFieldName?.length > 0 ? (
          <div
            className={`${isTradeInForm ? "grid-cols-4" : "grid-cols-2"} grid gap-2 mt-2`}
          >
            <GenerateDocumentImgPreview files={imgFieldName} />
          </div>
        ) : (
          "-"
        )}
      </div>
    ) : null;
  };

  return (
    <div
      className={`p-4 bg-[var(--primary-color-20-single)] ${getEdgeClass(edge)}`}
    >
      {isTradeInModalSummaryMainHeading && renderMainHeadingForTradeInSummary()}
      <HeaderAndEditButton
        isFirstElement
        onClickHandler={() => handleScroll(sectionRefs?.personalDetailsRef)}
        title="Personal details"
      />
      <DetailsList items={personalDetailsData} />
      {sectionRefs?.desiredDateRef && (
        <>
          <HeaderAndEditButton
            onClickHandler={() => handleScroll(sectionRefs?.desiredDateRef)}
            title="Desired date"
          />
          <DetailsList items={desiredDateData} />
        </>
      )}
      {vehicleImages?.length ||
      registrationDocuments?.length ||
      driverLicense?.length ||
      idCard?.length ? (
        <HeaderAndEditButton
          onClickHandler={() => handleScroll(sectionRefs?.documentUploadRef)}
          title="Document upload"
        />
      ) : null}
      <ImagePreviewField
        imgFieldName={vehicleImages}
        imgFieldLabel="Vehicle images"
        isTradeInForm={true}
      />
      <ImagePreviewField
        imgFieldName={registrationDocuments}
        imgFieldLabel="Vehicle registration document"
        isTradeInForm={true}
      />
      <ImagePreviewField
        imgFieldName={driverLicense}
        imgFieldLabel="Driver's license"
      />
      <ImagePreviewField imgFieldName={idCard} imgFieldLabel="ID card" />

      {isTradeInModalSummaryMainHeading && (
        <>
          <HeaderAndEditButton
            onClickHandler={() =>
              handleScroll(sectionRefs?.vehiclePurchaseInfoRef)
            }
            title="Vehicle Details"
          />
          <DetailsList items={vehiclePurchaseDetails} />
        </>
      )}
    </div>
  );
};
export default ModalSummarySection;
