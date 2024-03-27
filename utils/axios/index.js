import axios from "axios";

const getAll_items = (url, method, payload, headers) => {
  result = axios({
    url: url,
    method: String(method).toUpperCase(),
    data: payload,
    headers: headers,
  });
  return result;
};
const getAll_itemsbyId = (url, method, payload) => {
  result = axios({
    url: url,
    method: String(method).toUpperCase(),
    data: payload,
    headers: headers,
  });
  return result;
};
export { getAll_items, getAll_itemsbyId };
