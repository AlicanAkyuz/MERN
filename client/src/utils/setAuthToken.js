import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // apply token to every request as header
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // delete the auth header if token does not exist
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
