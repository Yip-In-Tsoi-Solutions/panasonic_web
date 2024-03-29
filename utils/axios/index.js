import axios from "axios";

const getAll_items = (url, headers) => {
  let result = axios({
    url: url,
    method: "GET",
    headers: headers,
  });
  return result;
};
const getAll_itemsbyId = (url, headers) => {
  let result = axios({
    url: url,
    method: "GET",
    headers: headers,
  });
  return result;
};
const post_item = (url, payload, headers) => {
  let result = axios({
    url: url,
    method: "POST",
    data: payload,
    headers: headers,
  });
  return result;
};
export { getAll_items, getAll_itemsbyId, post_item };
