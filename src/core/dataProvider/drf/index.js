//** Data provider wrapper over django rest API */

import {stringify} from "query-string";
import {fetchUtils} from "ra-core";

const getPaginationQuery = (pagination) => {
    return {
        page: pagination.page,
        page_size: pagination.perPage,
    };
};

const getFilterQuery = (filter) => {
    const {q: search, ...otherSearchParams} = filter;
    return {
        ...otherSearchParams,
        search,
    };
};

export const getOrderingQuery = (sort) => {
    const {field, order} = sort;
    return {
        ordering: `${order === "ASC" ? "" : "-"}${field}`,
    };
};

function normalizeOptionsMapping(options) {
    if (options) {
        return options
    }
    return new Proxy({}, {
        get: function (target, name) {
            if (name in target) {
                return target[name]
            }

            return {
                endpoint: name,
                idFieldName: "id"
            }
        }
    })
}


export default function drfProvider(
    apiUrl,
    httpClient = fetchUtils.fetchJson,
    optionsMapping = null
) {
    optionsMapping = normalizeOptionsMapping(optionsMapping);

    const getOptions = (resource) => optionsMapping[resource]


    const getOneJson = (resource, id) => {
        return httpClient(`${apiUrl}/${getOptions(resource).endpoint}/${id}/`)
            .then((response) => response.json)
    }

    return {
        getList: async (resource, params) => {
            const query = {
                ...getFilterQuery(params.filter),
                ...getPaginationQuery(params.pagination),
                ...getOrderingQuery(params.sort),
            };
            const url = `${apiUrl}/${getOptions(resource).endpoint}/?${stringify(query)}`;

            const {json} = await httpClient(url);
            return {
                data: json.results.map(obj => ({...obj, id: obj[getOptions(resource).idFieldName]})),
                total: json.count,
            };
        },

        getOne: async (resource, params) => {
            const data = await getOneJson(resource, params.id);
            return {data: {...data, id: data.slug}}
        },

        getMany: (resource, params) => {
            return Promise.all(params.ids.map((id) => getOneJson(resource, id))).then(
                (data) => ({
                    data: data.map(obj => ({...obj, id: obj[getOptions(resource).idFieldName]}))
                })
            );
        },

        getManyReference: async (resource, params) => {
            const query = {
                ...getFilterQuery(params.filter),
                ...getPaginationQuery(params.pagination),
                ...getOrderingQuery(params.sort),
                [params.target]: params.id,
            };
            const url = `${apiUrl}/${getOptions(resource).endpoint}/?${stringify(query)}`;

            const {json} = await httpClient(url);
            return {
                data: json.results.map(obj => ({...obj, id: obj[getOptions(resource).idFieldName]})),
                total: json.count,
            };
        },

        update: async (resource, params) => {
            const {json} = await httpClient(`${apiUrl}/${getOptions(resource).endpoint}/${params.id}/`, {
                method: "PATCH",
                body: JSON.stringify(params.data),
            });
            return {data: json, id: json[optionsMapping.idFieldName]};
        },

        updateMany: (resource, params) =>
            Promise.all(
                params.ids.map((id) =>
                    httpClient(`${apiUrl}/${getOptions(resource).endpoint}/${id}/`, {
                        method: "PATCH",
                        body: JSON.stringify(params.data),
                    })
                )
            ).then((responses) => ({data: responses.map(({json}) => json.id)})),

        create: async (resource, params) => {
            const {json} = await httpClient(`${apiUrl}/${optionsMapping.endpoint}/`, {
                method: "POST",
                body: JSON.stringify(params.data),
            });
            return {
                data: {...params.data, id: json[getOptions(resource).idFieldName]},
            };
        },

        delete: (resource, params) =>
            httpClient(`${apiUrl}/${optionsMapping.endpoint}/${params.id}/`, {
                method: "DELETE",
            }).then(() => ({data: params.previousData, id: params.previousData[getOptions(resource).idFieldName]})),

        deleteMany: (resource, params) =>
            Promise.all(
                params.ids.map((id) =>
                    httpClient(`${apiUrl}/${getOptions(resource).endpoint}/${id}/`, {
                        method: "DELETE",
                    })
                )
            ).then(() => ({data: []})),
    };
}
