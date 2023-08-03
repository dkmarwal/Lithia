import axios from 'axios';
import config from '~/config';

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
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      const path = window?.location?.pathname ?? '';
      const clientURL = path.split('/')[1];
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      window.location.href = `${config.baseName}/${clientURL}`
    }
    return error.response;
  }
);
export const getAccessToken = async (clientSlugURL = null) => {
  const path = window?.location?.pathname ?? '';
  const clientURL = clientSlugURL ?? path.split('/')[1];
  
  const refreshToken = sessionStorage.getItem(`@consumerRefreshToken_${clientURL}`);
  const accessToken = sessionStorage.getItem(`@consumerAccessToken_${clientURL}`);
 

  if (accessToken) {
    return accessToken;
  }
  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase}/oauth/token?refreshToken=${refreshToken}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      const path = window?.location?.pathname ?? '';
      const clientURL = path.split('/')[1];
      sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, responseBody.accessToken);
      return responseBody.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
};



export const getPaymentDetails = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/${config.apiVersion}/consumer/payment-details`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;
      return responseBody;

    } catch (err) {
      console.log("ERR", err);
    }
  };

export const fetchAccountTypes = async() => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/consumer-service/${config.apiVersion}/account-types`,
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                pragma: "no-cache",
              },
        })
        const responseBody = await response.data;
        return responseBody;
        
    } catch (error) {
        console.log("ERR", error);   
    }
}

export const fetchBankName = async (routingNumber) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/${config.apiVersion}/bank-details/${routingNumber}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
    });
     const responseBody = await response.data;
     return responseBody
   
  } catch (err) {
    console.log(err);
  }
};