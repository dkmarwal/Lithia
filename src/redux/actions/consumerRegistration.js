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
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      window.location.href = `${config.baseName}/${clientURL}`
    }
    return error.response;
  }
);



export const updateSnackbar = (data) => async (dispatch) => {
  dispatch({
    type: 'UPDATE_SNACKBAR_DATA',
    payload: data,
  });
  return data;
};

