import {Create, DateInput, ImageField, ImageInput, SimpleForm, TextInput} from 'react-admin';
import MarkdownInput from "../utils/customFields/MarkdownInput";

export const ArticleCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" label="Title"/>
                <TextInput source="description" label="Article description"/>
                <DateInput source="created" label="Creation date" defaultValue={new Date()}/>
                <ImageInput
                    source="image"
                    label="Article image"
                    accept="image/*"
                    placeholder={<p>Drop your file here</p>}
                    multiple={false}
                >
                    <ImageField source="src" title="title"/>
                </ImageInput>
                <MarkdownInput options={{
                    height: "500px"
                }} label="body" source="body"/>
            </SimpleForm>
        </Create>
    )
}