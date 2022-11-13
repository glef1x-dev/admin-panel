import {useInput, useRecordContext} from "ra-core";
import {Editor, EditorProps} from "@toast-ui/react-editor"
import '@toast-ui/editor/dist/toastui-editor.css'
import {InputProps} from "ra-core/src/form/useInput";
import codeSyntaxHighlight
    from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

type MarkdownInputTypes = {
    options?: Omit<EditorProps, "onChange" | "onBlur">
} & InputProps

export default function MarkdownInput(props: MarkdownInputTypes) {
    const {onChange, onBlur} = props;
    const record = useRecordContext();
    const initialValue = record?.[props.source.toLowerCase()] ?? ""

    const {
        field
    } = useInput({
        defaultValue: initialValue,
        // Pass the event handlers to the hook but not the component as the field property already has them.
        // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
        onChange,
        onBlur,
        ...props
    });

    return (
        <Editor
            {...field}
            {...props.options}
            initialValue={initialValue}
            plugins={[
                codeSyntaxHighlight
            ]}
        />
    );
}