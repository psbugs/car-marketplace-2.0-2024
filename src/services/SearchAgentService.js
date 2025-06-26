import { apiKey } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class SearchAgentService {
  static saveSearchAgentInfo = async (searchAgentParams) =>
    ApiService.post(`/searchagent/?apikey=${apiKey}`, searchAgentParams);
}
