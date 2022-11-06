import * as React from "react";
import {Admin, EditGuesser, Resource,} from "react-admin";

import JWTAuthProvider from "./core/auth/authProvider";
import dataProvider from "./core/dataProvider/dataProvider";
import {ArticleList} from "./articles/ArticleList";
import {ArticleShow} from "./articles/ArticleShow";
import {ArticleCreate} from "./articles/ArticleCreate";

const App = () => (
    <Admin title="glef1x.xyz admin panel" dataProvider={dataProvider} authProvider={JWTAuthProvider} requireAuth>
        <Resource
            name="Articles"
            list={ArticleList}
            edit={EditGuesser}
            show={ArticleShow}
            create={ArticleCreate}
        />
    </Admin>
);

export default App;
