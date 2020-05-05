import axios from "axios";
import History from "../history.js";
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_FEATURE } from "./types";

const ROOT_URL = "http://localhost:8000";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export const signinUser = ({ email, password }) => {
  return (dispatch) => {
    // submit email/password to the server
    axiosInstance
      .post(`api/token/`, {
        username: email,
        password: password,
      })
      .then((response) => {
        // if request is good...
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - save the jwt token
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("access_token", response.data.access);

        // - redirect to the route '/feature'
        History.push("/feature");
      })
      .catch(() => {
        // if request is bad...
        // - show an error to the user
        dispatch(authError("Bad Login Info"));
      });
  };
};

export const signupUser = ({ email, password }) => {
  return (dispatch) => {
    // submit email/password to the server
    axios
      .post(`${ROOT_URL}/signup`, { email, password })
      .then((response) => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem("token", response.data.token);
        History.push("/feature");
      })
      .catch((err) => {
        dispatch(authError(err.response.data.error));
      });
  };
};

export const authError = (error) => {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
};

export const signoutUser = () => {
  localStorage.removeItem("access_token");
  return { type: UNAUTH_USER };
};

export const fetchFeature = () => {
  return async (dispatch) => {
    try {
      let response = await axiosInstance.get("leads/");
      const message = response.data;
      dispatch({
        type: FETCH_FEATURE,
        payload: message,
      });
    } catch (error) {
      console.log("Error: ", JSON.stringify(error, null, 4));
      throw error;
    }
  };
};
