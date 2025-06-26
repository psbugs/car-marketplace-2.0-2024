import { apiKey } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class UiConfiguration {
  static uiConfigAll = async () =>
    ApiService.get(`/uiconfig/all?apikey=${apiKey}`);
}
