import {
    all,
    AllEffect,
    ForkEffectDescriptor,
    SimpleEffect,
} from 'redux-saga/effects';

import { movieSaga } from './movies';
import { usersWatcher } from './auth/saga';

export default function* rootSaga(): Generator<
  AllEffect<
    Generator<SimpleEffect<'FORK', ForkEffectDescriptor<never>>, void, unknown>
  >,
  void,
  unknown
  > {
    yield all([movieSaga.moviesWatcher(), usersWatcher()]);
}
