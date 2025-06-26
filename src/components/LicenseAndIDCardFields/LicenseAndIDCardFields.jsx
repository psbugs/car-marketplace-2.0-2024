import { useTranslation } from "react-i18next";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";
import FileUploadField from "../FileUploadField";

const LicenseAndIDCardFields = ({
  setFieldValue,
  values,
  driverLicenseFiles,
  setDriverLicenseFiles,
  idCardFiles,
  setIdCardFiles,
  documentUploadRef,
}) => {
  const { t } = useTranslation();
  return (
    <div ref={documentUploadRef}>
      <StyledHeadingBox header={t("/vehicleDetails.Document upload")} />
      <div className="text-sm text-[var(--davy-gray-color)]">
        {t("/vehicleDetails.DocumentVerificationMessage")}
        <br />
        <br />
        {t("/vehicleDetails.DocumentRevarificationMessage")}
      </div>
      <FileUploadField
        label="Driver's license"
        name="driverLicense"
        files={driverLicenseFiles}
        setFiles={setDriverLicenseFiles}
        values={values}
        noOfFilesAllowed={2}
        contentMessage="Place driving license photos here"
        setFieldValue={setFieldValue}
      />
      <FileUploadField
        label="ID card"
        name="idCard"
        files={idCardFiles}
        setFiles={setIdCardFiles}
        values={values}
        noOfFilesAllowed={2}
        contentMessage="Place ID card photos here"
        setFieldValue={setFieldValue}
      />
    </div>
  );
};
export default LicenseAndIDCardFields;
