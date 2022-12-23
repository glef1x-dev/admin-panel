import { ArrayInput, DateInput, Edit, SimpleForm, SimpleFormIterator, TextInput, required } from 'react-admin';
import MarkdownInput from '../utils/customFields/MarkdownInput';

export const ArticleEdit = () => {
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
                    options={{
                        height: '600px',
                    }}
                    label="body"
                    source="body"
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    );
};
