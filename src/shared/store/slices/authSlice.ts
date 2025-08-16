import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userRole: 'ADMIN' | 'USER' | null;
}

const initialState: AuthState = {
  userRole: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<AuthState['userRole']>) {
      state.userRole = action.payload;
    },
    clearUserRole(state) {
      state.userRole = null;
    },
  },
});

export const { setUserRole, clearUserRole } = authSlice.actions;
export default authSlice.reducer;
