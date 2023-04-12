import {
  Datagrid, DateField, ImageField, List, TextField, ArrayField, ChipField, SingleFieldList,
} from 'react-admin';

export function ArticleList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="slug" label="slug" />
        <TextField source="title" label="title" />
        <DateField source="created" sortable label="creation date" />
        <DateField source="modified" sortable label="last time modified" />
        <ArrayField source="tags">
          <SingleFieldList>
            <ChipField source="title" label="tag name" />
          </SingleFieldList>
        </ArrayField>
        <ImageField source="image" label="image" />
      </Datagrid>
    </List>
  );
}
