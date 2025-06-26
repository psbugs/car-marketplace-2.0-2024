import { apiKey, culture } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class Vehicles {
  static getVehicleDetails = async (vehicleId) =>
    ApiService.get(
      `/vehicles/${vehicleId}?apikey=${apiKey}&culture=${culture}`,
    );

  static getVehicleSimilar = async (vehicleId) =>
    ApiService.get(
      `/vehicles/${vehicleId}/similar?apikey=${apiKey}&culture=${culture}&take=10`,
    );

  static getPrevNextVehicle = async (defaultParams) =>
    ApiService.get(
      `/vehicles/ids?apikey=${apiKey}&index=${defaultParams?.index}&orderby=${defaultParams?.orderby}&orderdir=${defaultParams?.orderdir}&pageLayout=${defaultParams?.pageLayout}&skip=${defaultParams?.skip}&take=3`,
    );

  static downloadPdf = async (vehicleId) =>
    ApiService.get(
      `/vehicles/${vehicleId}/expose?accept=application%2Fpdf&apikey=${apiKey}`,
      { responseType: "blob" },
    );
  static getAllVehiclesCountsUsingSpecificFilters = async (apiUrl) =>
    ApiService.get(`/vehicles/?apikey=${apiKey}&culture=${culture}${apiUrl}`);

  static postSendMessage = ({
    additionalAnnotation,
    company,
    consentPrivacyPolicy,
    emailAddress,
    firstName,
    imprintUrl,
    privacyUrl,
    privatPerson,
    requestConsultation,
    requestIndividualInstalment,
    streetNumber,
    lastName,
    telephone,
    town,
    vehicleId,
    zipCode,
    googleAdTrackingInfo,
  }) => {
    let mappedData = {
      additionalAnnotation,
      company,
      consentPrivacyPolicy,
      culture,
      emailAddress,
      firstname: firstName,
      imprintUrl,
      privacyUrl,
      privatPerson,
      requestConsultation,
      requestIndividualInstalment,
      streetNumber,
      surname: lastName,
      telephone,
      town,
      vehicleId,
      zipCode,
      googleAdTrackingInfo,
    };
    return ApiService.post(`/email/sendrequest?apikey=${apiKey}`, mappedData);
  };

  static getVehicleOffers = async (params) => {
    let { vehicleId, appendedUrl } = params;
    return ApiService.get(
      `/vehicles/${vehicleId}/offer?${appendedUrl}&apikey=${apiKey}`,
    );
  };

  static getVehicleOfferCalculations = async (params) => {
    let { vehicleId } = params;
    return ApiService.get(
      `/vehicles/${vehicleId}/offer/parameters?apikey=${apiKey}`,
    );
  };
}
