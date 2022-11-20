import Cookies from "universal-cookie";
import axios, {AxiosResponse} from "axios";
import * as jose from "jose";
import {CookieSetOptions} from "universal-cookie/cjs/types";

// TODO save it in memory of app, not in cookie
export const JWT_ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const JWT_REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

const SECURE_COOKIE_PROPERTIES: CookieSetOptions = {
    path: "/",
    sameSite: 'strict' as const,
    secure: true,
};

function getExpirationDateFromJWTToken(token: string): Date {
    const expireAt = jose.decodeJwt(token).exp;
    if (expireAt === undefined) {
        console.warn("Expiration time on the jwt access token is not defined.")
        return new Date();
    }

    return new Date(expireAt * 1000);
}

const JWTAuthProvider = {
    // Fields
    cookies: new Cookies(),
    axiosInstance: axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }),
    // Methods
    async login({username, password}: { username: string, password: string }) {
        let response: AxiosResponse;

        try {
            response = await this.axiosInstance.post(
                "/auth/token/",
                JSON.stringify({
                    username,
                    password,
                })
            );
        } catch (e) {
            console.error(e)
            if (axios.isAxiosError(e)) {
                return Promise.reject({message: e.response?.data.message})
            }
            return Promise.reject({message: "Unknown error"})
        }

        this.cookies.set(JWT_ACCESS_TOKEN_COOKIE_NAME, response.data.access, {
            ...SECURE_COOKIE_PROPERTIES,
            expires: getExpirationDateFromJWTToken(response.data.access),
        });
        this.cookies.set(JWT_REFRESH_TOKEN_COOKIE_NAME, response.data.refresh, {
            ...SECURE_COOKIE_PROPERTIES,
            expires: getExpirationDateFromJWTToken(response.data.refresh),
        });
    },
    // when the dataProvider returns an error, check if this is an authentication error
    async checkError(error: unknown) {
        await this.checkAuth();
        return Promise.resolve();
    },
    /**
     * When the user navigates, make sure that their credentials are still valid
     */
    async checkAuth() {
        try {
            const accessToken = this.cookies.get(JWT_ACCESS_TOKEN_COOKIE_NAME);
            if (!accessToken) {
                throw new Error()
            }
            await this.verifyJWTToken(accessToken);
        } catch (error) {
            const refreshToken = this.cookies.get(JWT_REFRESH_TOKEN_COOKIE_NAME);
            if (!refreshToken) {
                return Promise.reject('Failed to authorize. Login required.');
            }

            const newAccessToken = await this.refreshToken(refreshToken);
            this.cookies.set(JWT_ACCESS_TOKEN_COOKIE_NAME, newAccessToken);
        }
    },
    /**
     * Remove local credentials and notify the auth server that the user logged out
     */
    async logout() {
        const refreshToken = this.cookies.get(JWT_REFRESH_TOKEN_COOKIE_NAME)
        this.cookies.remove(JWT_ACCESS_TOKEN_COOKIE_NAME);
        this.cookies.remove(JWT_REFRESH_TOKEN_COOKIE_NAME);
        await this.blackListRefreshToken(refreshToken);
        return Promise.resolve();
    },
    async getIdentity() {
        const response = await this.axiosInstance.get("/users/me/", {
            headers: {
                Authorization: `Bearer ${this.cookies.get(
                    JWT_ACCESS_TOKEN_COOKIE_NAME
                )}`,
            },
        });
        return response.data;
    },
    getPermissions: () => Promise.resolve(""),

    async verifyJWTToken(token: string) {
        return await this.axiosInstance.post(
            "/auth/token/verify/",
            JSON.stringify({
                token: token,
            })
        );
    },

    async refreshToken(refreshToken: string) {
        const response = await this.axiosInstance.post(
            "/auth/token/refresh/",
            JSON.stringify({
                refresh: refreshToken,
            })
        );
        return response.data.access;
    },
    async blackListRefreshToken(refreshToken: string) {
        try {
            await this.axiosInstance.post(
                "/auth/token/blacklist/",
                JSON.stringify({
                    refresh: refreshToken
                })
            )
        } catch (err) {
            // TODO: log this error, for now just supress
        }
    }
};

export default JWTAuthProvider;
