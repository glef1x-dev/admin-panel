import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthProvider as AuthProviderInterface } from 'ra-core';
import createAxiosClient, { JWT_ACCESS_TOKEN_KEY } from '../axiosClient';
import { User, UserIdentityType } from './types';

type UserCredentials = {
    username: string;
    password: string;
}

class JWTAuthProvider implements AuthProviderInterface {
  protected readonly axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = createAxiosClient();
  }

  async login(credentials: UserCredentials): Promise<void> {
    let response: AxiosResponse;

    try {
      response = await this.axiosClient.post(
        '/auth/token/',
        JSON.stringify(credentials),
      );
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data.message);
      }
      console.error(e);
      throw new Error('Unknown error');
    }
    window.localStorage.setItem(JWT_ACCESS_TOKEN_KEY, response.data.access);
  }

  // when the dataProvider returns an error, check if this is an authentication error
  checkError(): Promise<void> {
    return Promise.resolve();
  }

  /**
     * When the user navigates, make sure that their credentials are still valid
     */
  async checkAuth(): Promise<void> {
    const accessToken = window.localStorage.getItem(JWT_ACCESS_TOKEN_KEY);

    if (!accessToken) {
      await this.refreshToken();
      return;
    }

    try {
      await this.verifyJWTToken(accessToken);
    } catch (e) {
      await this.refreshToken();
    }
  }

  /**
     * Remove local credentials and notify the auth server that the user logged out
     */
  async logout(): Promise<void> {
    window.localStorage.removeItem(JWT_ACCESS_TOKEN_KEY);
    await this.blackListRefreshToken();
    return Promise.resolve();
  }

  async getIdentity(): Promise<UserIdentityType> {
    const response = await this.axiosClient.get('/users/me/');
    const user = response.data as User;

    return Object.assign(user, {
      fullName: user.firstName + user.lastName,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getPermissions(): Promise<string> {
    return '';
  }

  async verifyJWTToken(token: string): Promise<AxiosResponse<unknown, unknown>> {
    return this.axiosClient.post(
      '/auth/token/verify/',
      JSON.stringify({
        token,
      }),
    );
  }

  async refreshToken(): Promise<string> {
    const response = await this.axiosClient.post('/auth/token/refresh/');
    window.localStorage.setItem(JWT_ACCESS_TOKEN_KEY, response.data.access);
    return response.data.access as string;
  }

  async blackListRefreshToken(): Promise<void> {
    try {
      await this.axiosClient.post('/auth/token/blacklist/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          // It doesn't really matter if we really blacklisted token
          // If we get 400 response it just says that token was blacklisted
          // so we don't care about this case
          return;
        }
      }
      throw err;
    }
  }
}

export default JWTAuthProvider;
