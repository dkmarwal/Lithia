const initialState = {
  consumer: {
    updatedSnackbarData: {
      message: '',
      severity: 'success',
      openSnackbar: false,
    },
  },
};

export default function consumer(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPDATE_SNACKBAR_DATA': {
      return {
        ...state,
        consumer: {
          ...state.consumer,
          updatedSnackbarData: action.payload,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
}
