import { Admin, Resource } from 'react-admin';

import JWTAuthProvider from './core/auth/authProvider';
import dataProvider from './core/dataProvider/dataProvider';
import { ArticleList } from './articles/ArticleList';
import { ArticleShow } from './articles/ArticleShow';
import { ArticleCreate } from './articles/ArticleCreate';
import { ArticleEdit } from './articles/ArticleEdit';

function App() {
  return (
    <Admin title="glef1x.xyz admin panel" dataProvider={dataProvider} authProvider={new JWTAuthProvider()} requireAuth>
      <Resource name="Articles" list={ArticleList} edit={ArticleEdit} show={ArticleShow} create={ArticleCreate} />
    </Admin>
  );
}

export default App;
