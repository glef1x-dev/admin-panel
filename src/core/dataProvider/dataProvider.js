import {fetchUtils} from "ra-core";
import Cookies from "universal-cookie";
import drfProvider from "./drf/index";

const cookies = new Cookies();

function createOptionsFromJWTToken() {
    const token = cookies.get("access");
    if (!token) {
        return {};
    }
    return {
        user: {
            authenticated: true,
            token: "Bearer " + token,
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
