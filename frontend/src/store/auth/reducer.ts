import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types';

export const SLICE_USERS_NAME = 'users';

export interface UsersStateType {
  currentUser: UserType | null;
  error: string | null;
  loading: boolean;
}

export type AuthPayload = Required<Pick<UserType, 'email' | 'password'>> & { passwordRepeat?: string };

const initialState: UsersStateType = {
    currentUser: null,
    error: null,
    loading: false,
};

export const reducer = createSlice({
    name: SLICE_USERS_NAME,
    initialState,
    reducers: {
        reset: () => initialState,
        logOut: (state) => {
            state.currentUser = null;
        },
        setUser: (state, action: PayloadAction<UserType | null>) => {
            state.currentUser = action.payload || null;
        },
        signIn: (state, action: PayloadAction<AuthPayload>) => {
            if (action.payload.email && action.payload.password) {
                state.loading = true;
            }
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        signUp: (state, action: PayloadAction<AuthPayload>) => {
            if (action.payload.email && action.payload.password && action.payload.passwordRepeat) {
                state.loading = true;
            }
        },
    },
});

export const { reset, logOut, setUser, signIn, setLoading, setError, signUp } = reducer.actions;

export default reducer.reducer;
