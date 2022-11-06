import * as React from 'react';
import {Create, DateInput, ImageInput, SimpleForm, TextInput} from 'react-admin';
import MarkdownInput from "../utils/customFields/MarkdownInput";

export const ArticleCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" label="Title"/>
                <DateInput source="created" label="Creation date" defaultValue={new Date()}/>
                <ImageInput source="image" label="Image"/>
                <TextInput source="slug" label="Slug"/>
                <MarkdownInput label="body" source="Body"/>
            </SimpleForm>
        </Create>
    )
}