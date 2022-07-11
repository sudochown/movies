import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { movieState } from './movies';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './root-saga';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { authState } from './auth';
import { crudState } from './crud';

const rootReducer = combineReducers({
  [movieState.SLICE_MOVIES_NAME]: movieState.reducer.reducer,
  [authState.SLICE_USERS_NAME]: authState.reducer.reducer,
  [crudState.SLICE_CRUD_NAME]: crudState.reducer.reducer,
});

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const persistConfig = { key: 'root', storage };

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      ...middleware
    ),
});

sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
