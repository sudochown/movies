import axios, { AxiosResponse } from 'axios';
import { MovieType, TOKEN_STORAGE_KEY } from '../../types';
import { ItemsPayload } from './reducer';
import { MovieCRUDActions } from '../../types/types';
import { applyValueProcessors, getApiConfig, getMovieActionApiUrl } from '../../config';
import { GridRowModel } from '@mui/x-data-grid';

export function fetchList(url: string): Promise<AxiosResponse<ItemsPayload>> {
  const token: string = sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const apiPrefix = getApiConfig().prefix;
  return axios.get(`${apiPrefix}${url}`, { headers: { Authorization: 'Bearer ' + token } });
}

export function runQuery(type: MovieCRUDActions, payload?: GridRowModel): Promise<AxiosResponse<MovieType | boolean>> {
  const token: string = sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const { _id, ...movie } = payload || {};
  const data = {...movie};
  delete data['action'];
  delete data['updatedAt'];
  delete data['createdAt'];

  Object.keys(data || {}).forEach((f: string) => {
    if (data[f]) {
      data[f] = data[f] = applyValueProcessors(f, String(data[f])) || '';
    }
  });

  const headers = { Authorization: 'Bearer ' + token };
  const { method, url } = getMovieActionApiUrl(type, _id);
  return axios({ method, url, data, headers });
}
