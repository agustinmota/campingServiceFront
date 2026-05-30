import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";
import { clearSavedSession, getSavedSession, saveSession } from "../../shared/authToken";

const savedSession = getSavedSession();

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
    token: savedSession.token,
    user: savedSession.user,
    status: "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      clearSavedSession();
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
        saveSession({ token: state.token, user: state.user });
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
