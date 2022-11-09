import axios from "axios";
import { getAuthToken } from "../utils/local";
import { getToken } from "../utils/session";
import { siteUrl } from "../utils/utils";

axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

if (getToken()) {
  axios.defaults.headers.common["token"] = getToken();
}else if(getAuthToken()){
  axios.defaults.headers.common["token"] = getAuthToken()
} else {
  delete axios.defaults.headers.common["token"];
}
export default axios.create({
  baseURL: siteUrl,
  headers: {
    Accept: "applications/json",
    
  },
});
