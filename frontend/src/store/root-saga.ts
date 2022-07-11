import { all, AllEffect, ForkEffectDescriptor, SimpleEffect } from 'redux-saga/effects';

import { movieSaga } from './movies';
import { crudSaga } from './crud';
import { usersWatcher } from './auth/saga';

export default function* rootSaga(): Generator<AllEffect<Generator<SimpleEffect<'FORK', ForkEffectDescriptor<never>>, void>>, void> {
  yield all([movieSaga.moviesWatcher(), crudSaga.crudWatcher(), usersWatcher()]);
}
