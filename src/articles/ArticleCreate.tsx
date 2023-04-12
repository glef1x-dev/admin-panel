import {
    Create,
    DateInput,
    ImageField,
    ImageInput,
    SimpleForm,
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    required,
} from 'react-admin';
import MarkdownInput from '../utils/customFields/MarkdownInput';

export const ArticleCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" label="Title" validate={required()} />
                <TextInput source="description" label="Article description" />
                <DateInput source="created" label="Creation date" defaultValue={new Date()} validate={required()} />
                <ArrayInput source="tags">
                    <SimpleFormIterator inline>
                        <TextInput label="tag name" source="title" helperText={false} />
                    </SimpleFormIterator>
                </ArrayInput>
                <ImageInput
                    source="image"
                    label="Article image"
                    accept={["image/jpeg", "image/png", "image/webp"]}
                    placeholder={<p>Drop your file here</p>}
                    multiple={false}
                    validate={required()}
                >
                    <ImageField source="src" title="title" />
                </ImageInput>
                <MarkdownInput
                    options={{
                        height: '500px',
                    }}
                    label="body"
                    source="body"
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    );
};
