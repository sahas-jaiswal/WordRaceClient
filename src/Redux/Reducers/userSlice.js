import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = `http://35.90.147.83:2000/api/`;
//const BASE_URL = `http://localhost:2000/api/`;

const initialState = {
  authorised: false,
  user: {},
  users: [],
  loading: false,
  error: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },

    getUserSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.data;
    },
    getUserError: (state, action) => {
      state.loading = false;
      state.error =
        action.payload && action.payload.detail
          ? `${action.payload.detail} 😵`
          : "Something went wrong";
    },
    signInStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },

    signInSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
      state.authorised = true;
    },
    signInError: (state, action) => {
      state.loading = false;
      console.log("reducer", action.payload);
      state.error = action.payload.error
        ? `${action.payload.error} 😵`
        : "Something went wrong";
    },
    signUpStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
    },
    signUpError: (state, action) => {
      state.loading = false;
      state.error =
        action.payload && action.payload.error
          ? `${action.payload.error} 😵`
          : "Something went wrong";
    },
    updateStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
    },
    updateError: (state, action) => {
      state.loading = false;
      state.error =
        action.payload && action.payload.error
          ? `${action.payload.error} 😵`
          : "Something went wrong";
    },
    logout: (state, action) => {
      state.authorised = false;
      state.user = {};
    },
  },
});
export const userAccessDispatchers = {
  getUsers: (options) => async (dispatch) => {
    try {
      dispatch(getUserStart());
      const response = await axios.get(`${BASE_URL}getUsers`);
      dispatch(getUserSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error("error.response\n", error.response);
      dispatch(getUserError((error.response && error.response.data) || null));
      if (options && options.error) options.error();
    }
  },
  signIn: (data, options) => async (dispatch) => {
    try {
      dispatch(signInStart(data));
      const response = await axios.post(`${BASE_URL}signin`, data);
      dispatch(signInSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error("error.response\n", error.response);
      dispatch(signInError((error.response && error.response.data) || null));
      if (options && options.error) options.error();
    }
  },
  signUp: (data, options) => async (dispatch) => {
    try {
      dispatch(signUpStart(data));
      const response = await axios.post(`${BASE_URL}signup`, data);
      dispatch(signUpSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error("error.response\n", error.response);
      dispatch(signUpError((error.response && error.response.data) || null));
      if (options && options.error) options.error();
    }
  },
  update: (data, options) => async (dispatch) => {
    try {
      console.log(data);
      dispatch(updateStart(data));
      const token = localStorage.getItem("token");
      console.log("token", token);
      const response = await axios.put(`${BASE_URL}update`, data, {
        headers: { Authorization: `${token}` },
      });
      console.log(response);
      dispatch(updateSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error("error.response\n", error.response);
      dispatch(updateError((error.response && error.response.data) || null));
      if (options && options.error) options.error();
    }
  },
  logout: (data, options) => async (dispatch) => {
    dispatch(logout());
  },
};
// Action creators are generated for each case reducer function
export const {
  getUserStart,
  getUserSuccess,
  getUserError,
  signInStart,
  signInSuccess,
  signInError,
  signUpStart,
  signUpSuccess,
  signUpError,
  updateStart,
  updateSuccess,
  updateError,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
