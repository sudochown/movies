import axios, { AxiosResponse } from 'axios';
import { TOKEN_STORAGE_KEY, UserType } from '../../types';

export type AuthResponse = { user?: UserType; token?: string; status?: number; message?: string };

/**
 * Authenticate user and save jwt token to session storage.
 *
 * @param email
 * @param password
 * @param passwordRepeat
 */
export async function authenticate(email: string, password: string, passwordRepeat?: string): Promise<AxiosResponse<AuthResponse>> {
    const url = passwordRepeat ? '/v1/user/signup' : '/v1/user/signin';
    const response = await axios.post(url, { email, password, passwordRepeat });

    if (response?.data?.token && response?.data?.user?.email) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, response?.data.token);
    }

    return response;
}

/**
 * Remove jwt token from session storage on logout.
 */
export function logout(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}
