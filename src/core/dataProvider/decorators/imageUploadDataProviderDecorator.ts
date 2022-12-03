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
import { GetOneParams } from 'ra-core/dist/cjs/types';

export default class ImageUploadDataProviderDecorator<ResourceType extends string>
    implements DataProvider<ResourceType>
{
    constructor(protected dataProvider: DataProvider) {
        this.dataProvider = dataProvider;
    }

    async create(resource: ResourceType, params: CreateParams) {
        if (resource !== 'Articles') {
            // fallback to the default implementation
            return this.dataProvider.create(resource, params);
        }
        return convertFileToBase64(params.data.image).then((base64Image) => {
            return this.dataProvider.create(resource, {
                ...params,
                data: {
                    ...params.data,
                    image: base64Image,
                },
            });
        });
    }

    async getList(resource: ResourceType, params: GetListParams) {
        return this.dataProvider.getList(resource, params);
    }

    async getOne(resource: ResourceType, params: GetOneParams) {
        return this.dataProvider.getOne(resource, params);
    }

    async getMany(resource: ResourceType, params: GetManyParams) {
        return this.dataProvider.getMany(resource, params);
    }

    async getManyReference(resource: ResourceType, params: GetManyReferenceParams) {
        return this.dataProvider.getManyReference(resource, params);
    }

    async update(resource: ResourceType, params: UpdateParams) {
        return this.dataProvider.update(resource, params);
    }

    updateMany(resource: ResourceType, params: UpdateManyParams) {
        return this.dataProvider.updateMany(resource, params);
    }

    async delete(resource: ResourceType, params: DeleteParams) {
        return this.dataProvider.delete(resource, params);
    }

    async deleteMany(resource: ResourceType, params: DeleteManyParams) {
        return this.dataProvider.deleteMany(resource, params);
    }
}

type FileType = {
    rawFile: File;
    src: string;
    title: string;
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file: FileType) =>
    new Promise((resolve, reject) => {
        console.log(file, typeof file);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });
