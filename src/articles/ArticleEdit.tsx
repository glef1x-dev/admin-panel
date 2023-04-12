import {
  ArrayInput, DateInput, Edit, required, SimpleForm, SimpleFormIterator, TextInput,
} from 'react-admin';
import MarkdownInput from '../utils/customFields/MarkdownInput';

export function ArticleEdit() {
  return (
    <Edit redirect="list">
      <SimpleForm>
        <TextInput source="title" label="Title" validate={required()} />
        <TextInput source="description" label="Article description" />
        <DateInput source="created" label="Creation date" defaultValue={new Date()} validate={required()} />
        <ArrayInput source="tags">
          <SimpleFormIterator inline>
            <TextInput label="tag name" source="title" helperText={false} />
          </SimpleFormIterator>
        </ArrayInput>
        <MarkdownInput
          height="600px"
          label="body"
          source="body"
        />
      </SimpleForm>
    </Edit>
  );
}
