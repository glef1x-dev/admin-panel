export default function imageUploadDataProvider(dataProvider) {
    return {
        ...dataProvider,
        create: async (resource, params) => {
            if (resource !== 'Articles') {
                // fallback to the default implementation
                return dataProvider.create(resource, params);
            }
            return convertFileToBase64(params.data.image).then(
                (base64Image) => {
                    return dataProvider.create(resource, {
                        ...params,
                        data: {
                            ...params.data,
                            image: base64Image
                        },
                    })
                }
            )
        },
    };
}


/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });

