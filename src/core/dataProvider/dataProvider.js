import {fetchUtils} from "ra-core";
import Cookies from "universal-cookie";
import drfProvider from "./drf/index";
import {JWT_ACCESS_TOKEN_COOKIE_NAME} from "../auth/authProvider";

const cookies = new Cookies();

function createOptionsFromJWTToken() {
    const accessToken = cookies.get(JWT_ACCESS_TOKEN_COOKIE_NAME);
    if (!accessToken) {
        return {}
    }

    return {
        user: {
            authenticated: true,
            token: "Bearer " + accessToken,
        },
    };
}

const dataProvider = drfProvider(
    API_URL,
    (url, options = {}) => {
        return fetchUtils
            .fetchJson(url, Object.assign(options, createOptionsFromJWTToken()))
            .then((response) => {
                return response;
            });
    },
    {
        "Articles": {
            endpoint: "blog/articles",
            idFieldName: "slug"
        }
    }
);

export default dataProvider;
