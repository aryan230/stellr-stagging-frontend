import {
  RC_ADD_ITEM,
  RC_REMOVE_ITEM,
  RC_RESET,
} from "../constants/rcConstants";

export const rcReducer = (state = { rcDetails: [] }, action) => {
  switch (action.type) {
    case RC_ADD_ITEM:
      const tab = action.payload;
      console.log(state.rcDetails, action.payload);
      const existTab = state.rcDetails.find((x) => x._id == tab._id);
      // return {
      //   tabDetails: [tab],
      // };
      if (existTab) {
        const existId = state.rcDetails.findIndex((x) => x._id == tab._id);
        state.rcDetails[existId].time = tab.time;
        return {
          ...state,
          rcDetails: [...state.rcDetails],
        };
      } else {
        if (state.rcDetails.length > 10) {
          let newTabDetails = state.rcDetails.pop();
          return {
            ...state,
            rcDetails: [newTabDetails, tab],
          };
        } else {
          return {
            ...state,
            rcDetails: [...state.rcDetails, tab],
          };
        }
      }
    case RC_REMOVE_ITEM:
      return {
        ...state,
        rcDetails: state.rcDetails.filter((x) => x.doc._id !== action.payload),
      };
    case RC_RESET:
      return { ...state, rcDetails: [] };
    default:
      return state;
  }
};
