import {DateInput, Edit, SimpleForm, TextInput} from "react-admin";
import MarkdownInput from "../utils/customFields/MarkdownInput";

export const ArticleEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="title" label="Title"/>
                <TextInput source="description" label="Article description"/>
                <DateInput source="created" label="Creation date" defaultValue={new Date()}/>
                <MarkdownInput options={{
                    height: "600px"
                }}  label="body" source="body"/>
            </SimpleForm>
        </Edit>
    );
};