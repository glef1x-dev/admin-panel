import DjangoRestFrameworkDataProvider from './adapters/django-rest-framework-adapter';
import ImageUploadDataProviderDecorator from './decorators/imageUploadDataProviderDecorator';

const dataProvider = new ImageUploadDataProviderDecorator(
  new DjangoRestFrameworkDataProvider({
    Articles: {
      endpoint: 'blog/articles',
      idFieldName: 'slug',
    },
  }),
);

export default dataProvider;
