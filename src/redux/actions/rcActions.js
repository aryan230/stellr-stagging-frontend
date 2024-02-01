import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADRESS,
} from "../constants/cartConstants";
import { RC_ADD_ITEM, RC_REMOVE_ITEM } from "../constants/rcConstants";

export const addToRC = (data) => async (dispatch, getState) => {
  dispatch({
    type: RC_ADD_ITEM,
    payload: data,
  });

  localStorage.setItem("rcDetails", JSON.stringify(getState().rc.rcDetails));
};

export const removeFromRC = (id) => (dispatch, getState) => {
  dispatch({
    type: RC_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("rcDetails", JSON.stringify(getState().rc.rcDetails));
};
