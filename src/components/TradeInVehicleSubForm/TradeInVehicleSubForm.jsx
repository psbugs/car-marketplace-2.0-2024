import React, { useState } from "react";
import OwnerAndOdometerFields from "../OwnerAndOdometerFields/OwnerAndOdometerFields";
import ConditionStarsField from "../ConditionStarsField";
import VehicleDamageAccidentField from "../VehicleDamageAccidentField";
import VehicleDefectWithDescriptionField from "../VehicleDefectWithDescriptionField/VehicleDefectWithDescriptionField";
import PersonalInformationForm from "../PersonalInformationForm/PersonalInformationForm";
import VehicleImgsAndRegistrationImgFields from "../VehicleImgsAndRegistrationImgFields";

const TradeInVehicleSubForm = ({
  isShowSubHeading,
  setFieldValue,
  values,
  errors,
  touched,
  personalDetailsRef,
  vehiclePurchaseInfoRef,
  documentUploadRef,
  vehicleImageFiles,
  setVehicleImageFiles,
  registrationDocumentFiles,
  setRegistrationDocumentFiles,
}) => {
  const [privatePerson, setPrivatePerson] = useState(true);
  return (
    <>
      <div className="mt-7" ref={vehiclePurchaseInfoRef}>
        <OwnerAndOdometerFields
          vehiclePurchaseInfoRef={vehiclePurchaseInfoRef}
          isShowSubHeading={isShowSubHeading}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="w-full p-4">
        <ConditionStarsField
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
        />
      </div>

      <VehicleDamageAccidentField
        setFieldValue={setFieldValue}
        values={values}
      />

      <VehicleDefectWithDescriptionField
        setFieldValue={setFieldValue}
        values={values}
      />

      <VehicleImgsAndRegistrationImgFields
        setFieldValue={setFieldValue}
        values={values}
        vehicleImageFiles={vehicleImageFiles}
        setVehicleImageFiles={setVehicleImageFiles}
        registrationDocumentFiles={registrationDocumentFiles}
        setRegistrationDocumentFiles={setRegistrationDocumentFiles}
        documentUploadRef={documentUploadRef}
      />

      <PersonalInformationForm
        personalDetailsRef={personalDetailsRef}
        setFieldValue={setFieldValue}
        values={values}
        touched={touched}
        errors={errors}
        privatePerson={privatePerson}
        setPrivatePerson={setPrivatePerson}
      />
    </>
  );
};

export default TradeInVehicleSubForm;
