import URL from "./../../../Data/data.json";
import CryptoJS from "crypto-js";
export const encryptData = async ({ id }) => {
  const password = "3VJx8BtRnD";
  const object = {
    id,
  };
  let b64 = CryptoJS.AES.encrypt(JSON.stringify(object), password).toString();
  return b64;
};
