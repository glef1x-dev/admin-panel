//** Data provider wrapper over django rest API */

import { stringify } from 'query-string';
import {
    CreateParams,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    GetListParams,
    GetManyParams,
    GetManyReferenceParams,
    UpdateManyParams,
    UpdateParams,
} from 'ra-core';
import { AxiosInstance, AxiosResponse } from 'axios';
import { GetOneParams } from 'ra-core/dist/cjs/types';
import { PaginationPayload, SortPayload } from 'ra-core/src/types';
import createAxiosClient from '../../axiosClient';
import { difference } from '../../../utils/shared-utils';

type IdType = number | string;

const getPaginationQuery = (pagination: PaginationPayload) => {
    return {
        page: pagination.page,
        page_size: pagination.perPage,
    };
};

const getFilterQuery = (filter: { q: string; [key: string]: unknown }) => {
    const { q: search, ...otherSearchParams } = filter;
    return {
        ...otherSearchParams,
        search,
    };
};

export const getOrderingQuery = (sort: SortPayload) => {
    const { field, order } = sort;
    return {
        ordering: `${order === 'ASC' ? '' : '-'}${field}`,
    };
};

type Options = {
    [key: string]: {
        endpoint: string;
        idFieldName: string;
    };
};

export default class DjangoRestFrameworkDataProvider<ResourceType extends string>
    implements DataProvider<ResourceType>
{
    private readonly optionsMapping: Options;
    protected readonly axiosClient: AxiosInstance;

    constructor(optionsMapping: Options | null = null) {
        this.optionsMapping = normalizeOptionsMapping(optionsMapping);
        this.axiosClient = createAxiosClient();
    }

    getOptions(resourceName: ResourceType) {
        return this.optionsMapping[resourceName];
    }

    async getList(resource: ResourceType, params: GetListParams) {
        const query = {
            ...getFilterQuery(params.filter),
            ...getPaginationQuery(params.pagination),
            ...getOrderingQuery(params.sort),
        };
        const url = `${this.getOptions(resource).endpoint}/?${stringify(query)}`;

        return this.axiosClient.get(url).then((response) => ({
            data: response.data.results.map(
                (obj) => ({ ...obj, id: obj[this.getOptions(resource).idFieldName] })
            ),
            total: response.data.count,
        }));
    }

    async getOne(resource: ResourceType, params: GetOneParams) {
        const response = await this.getOneById(resource, params.id);
        return { data: { ...response.data, id: response.data.slug } };
    }

    private async getOneById(resourceName: ResourceType, id: IdType): Promise<AxiosResponse> {
        return this.axiosClient.get(`${this.getOptions(resourceName).endpoint}/${id}/`);
    }

    async getMany(resource: ResourceType, params: GetManyParams) {
        return Promise.all(params.ids.map((id: IdType) => this.getOneById(resource, id))).then(
            (response: AxiosResponse[]) => ({
                data: response.map((response) => ({
                    ...response.data,
                    id: response.data[this.getOptions(resource).idFieldName],
                })),
            }),
        );
    }

    async getManyReference(resource: ResourceType, params: GetManyReferenceParams) {
        const query = {
            ...getFilterQuery(params.filter),
            ...getPaginationQuery(params.pagination),
            ...getOrderingQuery(params.sort),
            [params.target]: params.id,
        };
        const url = `${this.getOptions(resource).endpoint}/?${stringify(query)}`;

        const response = await this.axiosClient.get(url);
        return {
            data: response.data.results.map((obj) => ({ ...obj, id: obj[this.getOptions(resource).idFieldName] })),
            total: response.data.count,
        };
    }

    async update(resource: ResourceType, params: UpdateParams) {
        console.log(difference(params.previousData, params.data));
        const response = await this.axiosClient.patch(
            `${this.getOptions(resource).endpoint}/${params.id}/`,
            JSON.stringify(difference(params.previousData, params.data)),
        );
        return { data: response.data, id: response.data[this.getOptions(resource).idFieldName] };
    }

    updateMany(resource: ResourceType, params: UpdateManyParams) {
        return Promise.all(
            params.ids.map((id) =>
                this.axiosClient.patch(`${this.getOptions(resource).endpoint}/${id}/`, JSON.stringify(params.data)),
            ),
        ).then((responses) => ({ data: responses.map((response) => response.data.id) }));
    }

    async create(resource: ResourceType, params: CreateParams) {
        const response = await this.axiosClient.post(
            this.getOptions(resource).endpoint + '/',
            JSON.stringify(params.data),
        );
        return {
            data: { ...params.data, id: response.data[this.getOptions(resource).idFieldName] },
        };
    }

    async delete(resource: ResourceType, params: DeleteParams) {
        return this.axiosClient.delete(`${this.getOptions(resource).endpoint}/${params.id}/`).then(() => ({
            data: params.previousData,
            id: params.previousData[this.getOptions(resource).idFieldName],
        }));
    }

    async deleteMany(resource: ResourceType, params: DeleteManyParams) {
        return Promise.all(
            params.ids.map((id) => this.axiosClient.delete(`${this.getOptions(resource).endpoint}/${id}/`)),
        ).then(() => ({ data: [] }));
    }
}

function normalizeOptionsMapping(options: Options | null): Options {
    if (options) {
        return options;
    }
    return new Proxy(
        {},
        {
            get: function (target, name) {
                if (name in target) {
                    //@ts-expect-error type doesn't really matter
                    return target[name];
                }

                return {
                    endpoint: name,
                    idFieldName: 'id',
                };
            },
        },
    );
}
