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
      // window.location.href = `${config.baseName}/${clientURL}`
      window.location.href = `${config.baseName}/${clientURL}/logout`
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



//Update token/session time
export const keepSessionLive = async () => {
  const path = window?.location?.pathname ?? '';
  const clientURL = path.split('/')[1];
  const refreshToken = sessionStorage.getItem(`@consumerRefreshToken_${clientURL}`);

  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase}/user-service/${config.apiVersion}/access/token`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          refreshToken: `${refreshToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        const { accessToken, refreshToken } = responseBody.data;
        const path = window?.location?.pathname ?? '';
        const clientURL = path.split('/')[1];
        sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
        sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};


export const getMobileNumer = async (enrollID) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/${config.apiVersion}/enrollment-link-verification/${enrollID}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if(response.status === 400){
      responseBody.message = "You may have entered an incorrect URL. Check the URL you have entered is correct."
    }
    return responseBody;
  } catch (err) {
    console.log(err);
  }
};

export const textMecode = async (enrollID) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/${config.apiVersion}/enrollment-link-verification/${enrollID}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        sendMeOtp: true,
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (err) {
    console.log(err);
  }
};

export const getConsumerInfo = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
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
    return responseBody;
  } catch (error) {
    console.log("==>", error);
  }
};

export const getUserProfile = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/v2/user-profile/1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    console.log("==>", error);
  }
};
export const addConsumerInfo = async (params) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/${config.apiVersion}/addConsumerBankAchInfo`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        routingNumber: (params && params?.routingNumber) || null,
        accountNumber: (params && params?.accountNumber) || null,
        accountType: (params && params?.accountType) || null,
        bankName: (params && params?.bankName) || null,
        
        preferenceType: "primary",
      }),
    });

    const responseBody = await response.data;
    return responseBody;
  } catch (err) {
    console.log(err);
  }
};


export const userPaymentHistory = async (params) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v2/lithia-getPayeePayments`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        paymentTypeIDs: "",
        FromDate: null,
        ToDate: null,
        rowCount: 5,
        pageNumber: 1,
        MinAmount: null,
        MaxAmount: null,
        payeeID: params.payeeID,
        statusIDs: "",
        businessType: params.businessType,
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (err) {
    console.log("==>", err);
  }
};


export const updateConsumerInfo =async (params, bankId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/${config.apiVersion}/updateConsumerBankAchInfo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        accountNumber: (params && params?.accountNumber) || null,
        routingNumber: (params && params?.routingNumber) || null,
        accountType: (params && params?.accountType) || null,
        bankAccountId: bankId || null,
        bankName: (params && params?.bankName) || null,
        preferenceType: "primary" 
      }),
    });
    const responseBody = await response.data;
    return responseBody
  } catch (error) {
    return false;
  }
};

// export const termsOfServices = async ()=> {
//   const path = window?.location?.pathname ?? '';
//     const clientURL = path.split('/')[1];
//   try {
//     const accessToken = await getAccessToken();
//     const response = await axios({
//       url: `${config.apiBase}/client-config-service/v2/branding/privacy/policy?appType=2&slugUrl=${clientURL}`,
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//         pragma: "no-cache",
//       },
//     });
//     const responseBody = await response.data;
//     return responseBody;
//   } catch (error) {
//     console.log("==>", error);
//   }
// }


