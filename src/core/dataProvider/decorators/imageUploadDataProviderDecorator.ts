import {CreateParams, DataProvider,} from 'ra-core';
import DjangoRestFrameworkDataProvider from "../adapters/django-rest-framework-adapter";

export default class ImageUploadDataProviderDecorator<ResourceType extends string>
    extends DjangoRestFrameworkDataProvider implements DataProvider<ResourceType>
{
    constructor(protected dataProvider: DataProvider<ResourceType>) {
        super();
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
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });
