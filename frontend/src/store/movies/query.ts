import axios, { AxiosResponse } from 'axios';
import { MovieAttribute, MovieType } from '../../types/types';
import { TOKEN_STORAGE_KEY } from '../../types';

export function fetchMovies(
    url: string,
): Promise<AxiosResponse<{ items: MovieType[]; total: number; }>> {
    const token: string = sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
    return axios
        .get(`/v1${url}`, { headers: { Authorization: 'Bearer ' + token } });
}

export function fetchAttributes(): Promise<AxiosResponse<{ attributes: MovieAttribute[]; options: { [key: string]: (string | number)[] }}>> {
    const token: string = sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
    return axios.get('/v1/movies/attributes', { headers: { Authorization: 'Bearer ' + token } });
}
