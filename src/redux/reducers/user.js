const initialState = {
  user: {
    isLoggedIn: false,
    error: null,
    message: null,
    info: {},
  },
};

export default function user(state = initialState, action = {}) {
 
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
         info: {
            ...state.user.info,
            ...action.payload,
          },
          error: null,
          isLoggedIn: true,
        },
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload && action.payload.message,
          data: action.payload && action.payload.data,
          info: {},
          isLoggedIn: false,
        },
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          info: {},
          error: action.payload,
        },
      };
    case "LOGOUT_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
}
