import axios from "axios";
import qs from "qs";

const element = document.getElementById("am-marketplace");
const apikey = element?.getAttribute("apikey");

const defaultConfig = {
  baseURL: element?.getAttribute("apiurl") || process.env.REACT_APP_API_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
};
const apiUrl = element?.getAttribute("apiurl") || defaultConfig?.baseURL;
console.log(apiUrl, "apiUrl");

export default class ApiService {
  static baseUrl = apiUrl;

  static getConfigs = (additionalConfig = {}) => {
    const config = {
      ...defaultConfig,
      ...additionalConfig,
      headers: {
        "Access-Api-Key": apikey,
      },
    };

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken !== null) {
      config.headers = { ...config.headers, Authorization: user.accessToken };
    }
    return config;
  };

  static get = async (url, params) =>
    axios.get(url, this.getConfigs({ ...params }));

  static post = async function post(url, data) {
    return axios.post(url, data, this.getConfigs());
  };

  static put = async (url, data) => axios.put(url, data, this.getConfigs());

  static patch = async (url, data) => axios.patch(url, data, this.getConfigs());

  static delete = async (url) => axios.delete(url, this.getConfigs());

  static download = async (url) => axios.get(url, this.getConfigs());

  static option = async (url) => axios.options(url, this.getConfigs());

  static upload = async (url, file) => {
    if (!(file instanceof File)) {
      throw new Error("The provided file is not a valid File object.");
    }
    const config = this.getConfigs();
    config.headers["Content-Type"] = "image/jpeg";
    return axios.post(url, file, config);
  };
}
