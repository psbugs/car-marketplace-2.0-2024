import { apiKey, culture } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class CriteriaService {
  static criteriaPromotions = async () =>
    ApiService.get(`/criteria/promotions?apikey=${apiKey}&culture=${culture}`);

  static criteriaAll = async () =>
    ApiService.get(
      `/criteria/all?apikey=${apiKey}&culture=${culture}&manufacturersType=ALL&pageLayout=RegularList`,
    );

  static criteriaManufacturers = async () =>
    ApiService.get(
      `/criteria/manufacturers?apikey=${apiKey}&culture=${culture}`,
    );

  static criteriaModelGroups = async (criteriaModelGrpParams) => {
    let { appendedUrl } = criteriaModelGrpParams;
    let baseApiUrl = appendedUrl
      ? `/criteria/modelgroups?apikey=${apiKey}&culture=${culture}${appendedUrl}`
      : `/criteria/modelgroups?apikey=${apiKey}&culture=${culture}`;
    return ApiService.get(baseApiUrl);
  };

  static criteriaSeries = async (seriesParams) => {
    return ApiService.get(
      `/criteria/series?apikey=${apiKey}&culture=${culture}&manufacturers=${seriesParams.manufactureId}`,
    );
  };

  static criteriaVariants = async (variantParams) => {
    return ApiService.get(
      `/criteria/variants?apikey=${apiKey}&${variantParams}`,
    );
  };

  static criteriaPaints = async () =>
    ApiService.get(`/criteria/paints?apikey=${apiKey}&culture=${culture}`);

  static criteriaOptions = async () =>
    ApiService.get(`/criteria/options?apikey=${apiKey}&culture=${culture}`);

  static criteriaModels = async (criteriaModelParams) => {
    let { appendedUrl } = criteriaModelParams;
    let baseApiUrl = `/criteria/models?apikey=${apiKey}&culture=${culture}&${appendedUrl ? appendedUrl : criteriaModelParams}`;
    return ApiService.get(baseApiUrl);
  };
}
