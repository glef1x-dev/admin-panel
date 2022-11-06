import {Datagrid, DateField, ImageField, List, TextField} from 'react-admin';

export const ArticleList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="slug" label="slug"/>
                <TextField source="title" label="title"/>
                <TextField source="tags" label="tags"/>
                <DateField source="created" sortable={true} label="creation date"/>
                <DateField source="modified" sortable={true} label="last time modified"/>
                <ImageField source="image" label="image"/>
            </Datagrid>
        </List>
    )
}