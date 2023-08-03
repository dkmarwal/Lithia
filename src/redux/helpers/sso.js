
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.request.use(
  request => {
   
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  if (error.response.status === 401) {
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
        sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
        sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
        sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
      window.location.href = `${config.baseName}/unauthorized`
  }
  return error.response;
});

export const fetchSSODetails = async (accessToken) => {
  try {
    // const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/sso`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (response.status === 401) {
      window.location.href = `${config.baseName}/unauthorized`;
      return false;
    }

    return responseBody;
  } catch (error) {
    return {
      message: (error.response && error.response.data.message) || '',
      data: {},
      error: true,
    };
  }
};

export const consumerDetails = async (clientSlugURL="") => {
  try {
    const accessToken = await getAccessToken(clientSlugURL);
    const response = await axios({
      url: `${config.apiBase}/consumer-service/${config.apiVersion}/consumer/detail`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      }
    });
    const responseBody = await response.data;

    if (response.status === 401) {
      window.location.href = `${config.baseName}/unauthorized`;
      return false;
    }
    return responseBody;
  } catch (error) {
    return {
      message: (error.response && error.response.data.message) || '',
      data: {},
      error: true,
    };
  }
}