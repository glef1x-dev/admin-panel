import { InputProps, RaRecord, useInput, useRecordContext } from 'ra-core';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import { useEffect, useRef } from 'react';

type MarkdownInputTypes = {
    options?: Omit<EditorProps, 'onChange' | 'onBlur'>;
} & InputProps;

export default function MarkdownInput(props: MarkdownInputTypes): JSX.Element | null {
  const {
    options: editorOptions, source, onChange, onBlur, ...other
  } = props;
  const record = useRecordContext() as RaRecord | undefined;
  let markdownText = '';
  if (record) {
    markdownText = record[source] as string;
  }
  const editorRef = useRef<Editor>(null);

  const { field } = useInput({
    defaultValue: markdownText,
    source,
    onChange,
    onBlur,
    ...other,
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(markdownText);
    } else {
      console.error('Editor instance is not available.');
    }
  }, [markdownText]);

  function handleChange() {
    if (editorRef.current) {
      const md = editorRef.current.getInstance().getMarkdown();
      field.onChange(md);
    } else {
      console.error('Editor instance is not available.');
    }
  }


  return (
    <Editor
      {...editorOptions}
      onChange={() => handleChange()}
      ref={editorRef}
      initialValue={markdownText}
      plugins={[codeSyntaxHighlight]}
      usageStatistics={false}
    />
  );
}
