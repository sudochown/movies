import { PayloadAction } from '@reduxjs/toolkit';
import { call, ForkEffectDescriptor, put, SimpleEffect, takeLatest } from 'redux-saga/effects';

import {
    setUser,
    signIn,
    setLoading,
    setError,
    signUp,
    AuthPayload,
    logOut,
} from './reducer';
import { authenticate, logout } from './query';

// Workers
function* authWorker(action: PayloadAction<Required<AuthPayload>>) {
    const { email, password, passwordRepeat } = action.payload || {};
    yield put(setLoading(true));

    try {
        const { data: { status, message, user } }: Awaited<ReturnType<typeof authenticate>> = yield call(
            authenticate,
            email,
            password,
            passwordRepeat
        );

        if (status !== 200) {
            yield put(setError(message || null));
        }
  
        yield put(setUser(user || null));
    } catch (e: unknown) {
        yield put(setError((e as { toString: () => string })?.toString()));
    }

    yield put(setLoading(false));
}

/**
 * Remove token from
 */
function* logOutWorker() {
    yield call(logout);
}

// Watchers
export function* usersWatcher(): Generator<
  SimpleEffect<'FORK', ForkEffectDescriptor<never>>,
  void,
  unknown
  > {
    yield takeLatest(logOut.type, logOutWorker);
    yield takeLatest(signIn.type, authWorker);
    yield takeLatest(signUp.type, authWorker);
}
