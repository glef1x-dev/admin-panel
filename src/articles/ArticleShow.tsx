import {DateField, ImageField, Show, SimpleShowLayout, TextField} from 'react-admin';

export const ArticleShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="slug" label="slug"/>
                <TextField source="title" label="title"/>
                <TextField source="tags" label="tags"/>
                <DateField source="created" sortable={true} label="creation date"/>
                <DateField source="modified" sortable={true} label="last time modified"/>
                <ImageField source="image" label="image"/>
            </SimpleShowLayout>
        </Show>
    );
};