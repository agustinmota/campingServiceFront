import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

const endpoints = {
  cabins: "/cabin",
  campsites: "/campsite",
  guests: "/guest",
  bookings: "/booking"
};

const listKeys = {
  cabins: "cabins",
  campsites: null,
  guests: "guests",
  bookings: "bookings"
};

export const fetchResource = createAsyncThunk("resources/fetch", async (resource) => {
  const data = await apiRequest(endpoints[resource]);
  const key = listKeys[resource];
  return { resource, items: key ? data[key] || [] : data || [] };
});

export const createResource = createAsyncThunk("resources/create", async ({ resource, values }, { dispatch }) => {
  await apiRequest(`${endpoints[resource]}/create`, {
    method: "POST",
    body: JSON.stringify(values)
  });
  await dispatch(fetchResource(resource));
  return resource;
});

export const updateResource = createAsyncThunk("resources/update", async ({ resource, id, values }, { dispatch }) => {
  await apiRequest(`${endpoints[resource]}/edit/${id}`, {
    method: "PUT",
    body: JSON.stringify(values)
  });
  await dispatch(fetchResource(resource));
  return resource;
});

export const deleteResource = createAsyncThunk("resources/delete", async ({ resource, id }, { dispatch }) => {
  await apiRequest(`${endpoints[resource]}/delete/${id}`, {
    method: "DELETE"
  });
  await dispatch(fetchResource(resource));
  return resource;
});

export const updateBookingStatus = createAsyncThunk("resources/updateBookingStatus", async ({ id, status }, { dispatch }) => {
  await apiRequest(`/booking/status/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
  await dispatch(fetchResource("bookings"));
  return "bookings";
});

const resourceSlice = createSlice({
  name: "resources",
  initialState: {
    cabins: [],
    campsites: [],
    guests: [],
    bookings: [],
    status: {},
    errors: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResource.pending, (state, action) => {
        state.status[action.meta.arg] = "loading";
        state.errors[action.meta.arg] = null;
      })
      .addCase(fetchResource.fulfilled, (state, action) => {
        state.status[action.payload.resource] = "succeeded";
        state[action.payload.resource] = action.payload.items;
      })
      .addCase(fetchResource.rejected, (state, action) => {
        state.status[action.meta.arg] = "failed";
        state.errors[action.meta.arg] = action.error.message;
      })
      .addCase(createResource.rejected, (state, action) => {
        state.errors[action.meta.arg.resource] = action.error.message;
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.errors[action.meta.arg.resource] = action.error.message;
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.errors[action.meta.arg.resource] = action.error.message;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.errors.bookings = action.error.message;
      });
  }
});

export default resourceSlice.reducer;
