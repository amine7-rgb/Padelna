import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api.js";

export const fetchSession = createAsyncThunk("auth/fetchSession", async () => api.fetchSession());
export const signupUser = createAsyncThunk("auth/signupUser", async (payload) => api.signup(payload));
export const loginUser = createAsyncThunk("auth/loginUser", async (payload) => api.login(payload));
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => api.logout());
export const updateUserProfile = createAsyncThunk("auth/updateUserProfile", async (payload) => api.updateProfile(payload));
export const changeUserPassword = createAsyncThunk("auth/changeUserPassword", async (payload) => api.changePassword(payload));
export const forgotUserPassword = createAsyncThunk("auth/forgotUserPassword", async (payload) => api.forgotPassword(payload));
export const resetUserPassword = createAsyncThunk("auth/resetUserPassword", async (payload) => api.resetPassword(payload));
export const verifyUserEmail = createAsyncThunk("auth/verifyUserEmail", async (payload) => api.verifyEmail(payload));
export const resendVerificationEmail = createAsyncThunk("auth/resendVerificationEmail", async () => api.resendVerification());
export const fetchAdminSummary = createAsyncThunk("auth/fetchAdminSummary", async () => api.fetchAdminSummary());
export const fetchAdminOrders = createAsyncThunk("auth/fetchAdminOrders", async (filters) => api.fetchAdminOrders(filters));
export const updateAdminOrderStatus = createAsyncThunk("auth/updateAdminOrderStatus", async ({ orderNumber, payload }) =>
  api.updateAdminOrderStatus(orderNumber, payload)
);

const initialState = {
  user: null,
  providers: { google: false, facebook: false },
  sessionStatus: "idle",
  sessionChecked: false,
  actionStatus: "idle",
  adminSummary: null,
  adminOrders: [],
  adminOrdersPagination: null,
  adminOrdersStatus: "idle"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.sessionStatus = "loading";
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.user = action.payload.user;
        state.providers = action.payload.providers || state.providers;
      })
      .addCase(fetchSession.rejected, (state) => {
        state.sessionStatus = "failed";
        state.sessionChecked = true;
        state.user = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.adminSummary = null;
        state.adminOrders = [];
        state.adminOrdersPagination = null;
        state.adminOrdersStatus = "idle";
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.actionStatus = "idle";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.actionStatus = "succeeded";
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.sessionStatus = "succeeded";
        state.sessionChecked = true;
        state.actionStatus = "succeeded";
      })
      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.adminSummary = action.payload.summary;
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminOrdersStatus = "loading";
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminOrdersStatus = "succeeded";
        state.adminOrders = action.payload.orders;
        state.adminOrdersPagination = action.payload.pagination;
      })
      .addCase(fetchAdminOrders.rejected, (state) => {
        state.adminOrdersStatus = "failed";
      })
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.adminOrders = state.adminOrders.map((order) => (order.orderNumber === action.payload.order.orderNumber ? action.payload.order : order));
        if (state.adminSummary?.recentOrders) {
          state.adminSummary.recentOrders = state.adminSummary.recentOrders.map((order) =>
            order.orderNumber === action.payload.order.orderNumber ? action.payload.order : order
          );
        }
      })
      .addCase(updateAdminOrderStatus.rejected, (state) => {
        state.actionStatus = "failed";
      });
  }
});

export default authSlice.reducer;
