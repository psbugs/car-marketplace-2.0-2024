import { apiKey, culture } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class TradeInService {
  static tradeInManufacturers = async () =>
    ApiService.get(
      `/tradein/vehicleidentification/manufacturers?apikey=${apiKey}&culture=${culture}`,
    );

  static tradeInManufacturersModels = async ({ tradeInManId }) =>
    ApiService.get(
      `/tradein/vehicleidentification/manufacturers/${tradeInManId}/models?apikey=${apiKey}&culture=${culture}`,
    );

  static tradeInVariants = async (tradeInObj) => {
    let { tradeInManId, tradeInModelId } = tradeInObj;
    return ApiService.get(
      `/tradein/vehicleidentification/manufacturers/${tradeInManId}/models/${tradeInModelId}/variants?apikey=${apiKey}&culture=${culture}`,
    );
  };

  static tradeInVehicles = async (tradeInObj) => {
    let { tradeInManId, tradeInModelId, tradeInVariantId } = tradeInObj;
    return ApiService.get(
      `/tradein/vehicleidentification/manufacturers/${tradeInManId}/models/${tradeInModelId}/variants/${tradeInVariantId}/vehicles?apikey=${apiKey}&culture=${culture}`,
    );
  };

  static tradeInPostData = async (tradeInPostParams) => {
    return ApiService.post(
      `/email/sendcart/?apikey=${apiKey}`,
      tradeInPostParams,
    );
  };
}
