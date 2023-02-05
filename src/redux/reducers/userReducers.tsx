const initialState = {};

const UserReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ON_UPDATE_LOCATION':
      return {
        ...state,
        userInfo: payload,
      };
      break;

    default:
      return state;
      break;
  }
};

export {UserReducer};
