import { PayloadAction } from '@reduxjs/toolkit';
import {
    call,
    ForkEffectDescriptor,
    put,
    SimpleEffect,
    takeLatest,
} from 'redux-saga/effects';
import {
    setMovies,
    setLoading,
    setError,
    loadMovies,
    FetchMoviesPayload,
    initToolbar,
    setToolbar,
} from './reducer';
import { MovieType } from '../../types';
import { fetchAttributes, fetchMovies } from './query';

// Workers
function* loadMoviesWorker(action: PayloadAction<FetchMoviesPayload>) {
    yield put(setLoading(true));
    yield put(setError(null));
  
    const {pathname, urlParams} = action.payload || {};
    const url = `${pathname}?${urlParams?.toString() || ''}`;
  
    try {
        const {data: {items, total}}: Awaited<ReturnType<typeof fetchMovies>> = yield call(fetchMovies, url);
        yield put(setMovies({items, total}));
    } catch (e: unknown) {
        yield put(setError((e as { toString: () => string })?.toString()));
    }
  
    yield put(setLoading(false));
}

function* initToolbarWorker() {
    yield put(setLoading(true));
  
    try {
        const response: Awaited<ReturnType<typeof fetchAttributes>> = yield call(fetchAttributes);
    
        yield put(
            setToolbar({
                availableFilters: response?.data?.attributes?.filter((a) => a.isFilterable).map((i) => ({
                    field: i.field as keyof MovieType,
                    value: (response?.data?.options[i.field] || []) as string[],
                })),
                availableSortFields: response?.data?.attributes?.filter((a) => a.isSortable).map((i) => ({
                    field: i.field as keyof MovieType,
                    isDefault: i.isDefaultSortField,
                })),
            })
        );
    } catch (e: unknown) {
        yield put(setError((e as { toString: () => string })?.toString()));
    }
  
    yield put(setLoading(false));
}

// Watchers
export function* moviesWatcher(): Generator<SimpleEffect<'FORK', ForkEffectDescriptor<never>>, void> {
    yield takeLatest(loadMovies.type, loadMoviesWorker);
    yield takeLatest(initToolbar.type, initToolbarWorker);
}
