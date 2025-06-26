import { apiKey } from "../constants/common-constants";
import ApiService from "./ApiService";

export default class TransferCodeService {
  static generateTransferCode = async (data, scope) =>
    ApiService.post(`/transfercode?apikey=${apiKey}&scope=${scope}`, data);

  static getDataFromTransferCode = async (transferCode, scope) =>
    ApiService.get(
      `/transfercode/${transferCode}?apikey=${apiKey}&scope=${scope}`,
    );
}
