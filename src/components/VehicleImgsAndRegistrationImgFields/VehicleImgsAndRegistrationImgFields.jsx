import { useTranslation } from "react-i18next";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";
import FileUploadField from "../FileUploadField";

const VehicleImgsAndRegistrationImgFields = ({
  setFieldValue,
  values,
  vehicleImageFiles,
  setVehicleImageFiles,
  registrationDocumentFiles,
  setRegistrationDocumentFiles,
  documentUploadRef,
}) => {
  const { t } = useTranslation();
  return (
    <div ref={documentUploadRef}>
      <StyledHeadingBox header={t("/vehicleDetails.Document upload")} />
      <div className="text-sm text-[var(--davy-gray-color)]">
        {t("/vehicleDetails.TradeInDocumentVerificationMessage")}
      </div>
      <FileUploadField
        label="Vehicle images"
        name="vehicleImages"
        files={vehicleImageFiles}
        setFiles={setVehicleImageFiles}
        values={values}
        noOfFilesAllowed={12}
        t={t}
        contentMessage="Place vehicle photos here"
        setFieldValue={setFieldValue}
        isTradeInForm={true}
      />
      <FileUploadField
        label="Vehicle registration document"
        name="registrationDocuments"
        files={registrationDocumentFiles}
        setFiles={setRegistrationDocumentFiles}
        values={values}
        noOfFilesAllowed={2}
        t={t}
        contentMessage="Place vehicle registration document photos here"
        setFieldValue={setFieldValue}
        isTradeInForm={true}
      />
    </div>
  );
};
export default VehicleImgsAndRegistrationImgFields;
