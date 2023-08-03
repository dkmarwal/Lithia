import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
      window.location.href = `${config.baseName}/${clientURL}`;
    }
    return error.response;
  }
);

/*
Get Loggin user information
*/
export const userInfo = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    const clientId = sessionStorage.getItem(`@consumerUserId_${clientURL}`);

    if (accessToken && clientId) {
      const response = await axios({
        url: `${config.apiBase}/consumer-service/${config.apiVersion}/getConsumerInfo?consumerId=${clientId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;

      if (responseBody.error === false) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: responseBody.data,
        });
         return true;
      }

      dispatch({
        type: "LOGIN_FAILED",
        payload: {
          message: responseBody.message || "",
          data: null,
        },
      });
      return false;
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message: (error.response && error.response.data.message) || "",
        data: null,
      },
    });
    return false;
  }
};

export const logout = (isSSO) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/logout`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    if (responseBody.error === false) {
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);

      if (isSSO) {
        sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
      }
      dispatch({
        type: "LOGOUT_SUCCESS",
        payload: {},
      });
    } else {
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);

      if (isSSO) {
        sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
      }
      dispatch({
        type: "LOGOUT_SUCCESS",
        payload: {},
      });
    }
  } catch (error) {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
    sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
   

    if (isSSO) {
      sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
    }
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
  }
};

//Update token/session time
export const keepSessionLive = () => async (dispatch) => {
  const path = window?.location?.pathname ?? "";
  const clientURL = path.split("/")[1];
  const refreshToken = sessionStorage.getItem(
    `@consumerRefreshToken_${clientURL}`
  );

  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase}/user-service/${config.apiVersion}/access/token`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refreshToken: `${refreshToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        const { accessToken, refreshToken, exp } = responseBody.data;

        sessionStorage.setItem(
          `@consumerAccessToken_${clientURL}`,
          accessToken
        );
        sessionStorage.setItem(
          `@consumerRefreshToken_${clientURL}`,
          refreshToken
        );
        dispatch({
          type: "UPDATE_TOKEN_TIME_SUCCESS",
          payload: { exp: exp },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};



export const userOTPverify = (userOtp, enrollID) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/consumer-service/v2/enrollment-link-verification/${enrollID}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({ userOtp: userOtp || null }),
    });
    const responseBody = await response.data;
    if (responseBody && !responseBody.error && responseBody.data?.otpVerified === 1 ) {
      const { accessToken, refreshToken, consumerId } = responseBody.data;
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
      sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
      sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
      sessionStorage.setItem(`@consumerUserId_${clientURL}`, consumerId);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "LOGIN_FAILED",
      payload: responseBody || "Oops! Something went wrong.",
    });
    return false;

  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload: (error.response && error.response.data.message) || "",
    });
    return false;
  }
};



