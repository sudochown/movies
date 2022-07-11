import { PayloadAction } from '@reduxjs/toolkit';
import { call, ForkEffectDescriptor, put, SimpleEffect, takeLatest } from 'redux-saga/effects';
import {
  setItems,
  setLoading,
  setError,
  loadItems,
  FetchPayload,
  triggerMovieAction,
  TriggerMovieActionPayload,
} from './reducer';
import { fetchList, runQuery } from './query';

// Workers
function* loadItemsWorker(action: PayloadAction<FetchPayload>) {
  yield put(setLoading(true));
  yield put(setError(null));

  const { pathname, query } = action.payload || {};
  const url = `${pathname}?${query?.toString() || ''}`;

  try {
    const { data }: Awaited<ReturnType<typeof fetchList>> = yield call(fetchList, url);
    yield put(setItems({ ...data }));
  } catch (e: unknown) {
    yield put(setError((e as { toString: () => string })?.toString()));
  }

  yield put(setLoading(false));
}

function* updateMovieWorker(action: PayloadAction<TriggerMovieActionPayload>) {
  yield put(setLoading(true));
  yield put(setError(null));
    
  const { payload, action: queryAction, reloadListParams } = action.payload || {};

  if (queryAction && payload) {
    try {
      const { data }: Awaited<ReturnType<typeof runQuery>> = yield call(runQuery, queryAction, payload);

      if (data && reloadListParams) {
        yield put(loadItems(reloadListParams));
      }
    } catch (e:unknown) {
      yield put(setError((e as { toString: () => string})?.toString()));
    }
    yield put(setLoading(false));
  }
}

// Watchers
export function* crudWatcher(): Generator<SimpleEffect<'FORK', ForkEffectDescriptor<never>>, void> {
  yield takeLatest(loadItems.type, loadItemsWorker);
  yield takeLatest(triggerMovieAction.type, updateMovieWorker);
}
