import { apiKey, culture } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class TestDriveService {
  static getTimeSlots = async (vehicleId) =>
    ApiService.get(`/resources/ownersettings/${vehicleId}?apikey=${apiKey}`);

  static uploadFileAttachments = async (name, file) => {
    return ApiService.upload(
      `/email/attachments?filename=${name}&apikey=${apiKey}`,
      file,
    );
  };

  static requestTestDrive = ({
    company,
    consentPrivacyPolicy,
    emailAddress,
    firstName,
    imprintUrl,
    privacyUrl,
    privatPerson,
    lastName,
    telephone,
    town,
    zipCode,
    streetNumber,
    vehicleId,
    testDrive,
    googleAdTrackingInfo,
  }) => {
    let mappedData = {
      company,
      consentPrivacyPolicy,
      emailAddress,
      firstname: firstName,
      imprintUrl,
      privacyUrl,
      privatPerson,
      culture: culture,
      surname: lastName,
      telephone,
      town,
      zipCode,
      streetNumber,
      vehicleId,
      testDrive,
      googleAdTrackingInfo,
    };
    return ApiService.post(`/email/sendcart?apikey=${apiKey}`, mappedData);
  };
}
