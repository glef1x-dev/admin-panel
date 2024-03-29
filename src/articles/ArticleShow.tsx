import {
  ArrayField,
  ChipField,
  DateField,
  ImageField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from 'react-admin';

export function ArticleShow() {
  return (
    <Show>
      <SimpleShowLayout>
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
      </SimpleShowLayout>
    </Show>
  );
}
