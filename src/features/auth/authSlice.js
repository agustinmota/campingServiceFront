import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

const savedToken = localStorage.getItem("camping_token");
const savedUser = localStorage.getItem("camping_user");

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const data = await apiRequest("/tokens/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
  return data;
});

export const register = createAsyncThunk("auth/register", async (values) => {
  const data = await apiRequest("/user/create", {
    method: "POST",
    body: JSON.stringify(values)
  });
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: savedToken,
    user: savedUser ? JSON.parse(savedUser) : null,
    status: "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("camping_token");
      localStorage.removeItem("camping_user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user || { id: action.payload.userId };
        localStorage.setItem("camping_token", state.token);
        localStorage.setItem("camping_user", JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthUser = (state) => state.auth.user;
export default authSlice.reducer;
