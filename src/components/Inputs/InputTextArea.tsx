import React, { useState } from 'react';
import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Dynamically import the rich text editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface InputTextAreaProps {
  label: string;
  name: string;
  id?: string;
  enableRichEditor?: boolean; // New prop to control default rich editor state
  [key: string]: any;
}

const InputTextArea = ({ label, enableRichEditor = false, ...props }: InputTextAreaProps) => {
  if (!props.name) {
    throw new Error("The 'name' prop is required for the Input component.");
  }

  const [field, meta, helpers] = useField(props.name);
  const [isRichEditor, setIsRichEditor] = useState(enableRichEditor);

  // Initialize editor state based on field value
  const initializeEditorState = () => {
    if (field.value && typeof field.value === 'string') {
      const blocksFromHtml = htmlToDraft(field.value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  };

  const [editorState, setEditorState] = useState(initializeEditorState);

  // Handle rich editor content change
  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    helpers.setValue(content); // Update Formik field value
  };

  // Toggle between rich editor and plain textarea
  const toggleEditor = () => {
    if (isRichEditor) {
      // Switching to plain textarea, keep the content
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      helpers.setValue(content);
    } else {
      // Switching to rich editor, convert plain text to editor state
      const blocksFromHtml = htmlToDraft(field.value || '');
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
    setIsRichEditor(!isRichEditor);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Label
          className="mb-1.5 block text-sm font-medium"
          htmlFor={props.id || props.name}
        >
          {label}
        </Label>
        <button
          type="button"
          onClick={toggleEditor}
          className="text-sm text-blue-500 hover:underline"
        >
          {isRichEditor ? 'Switch to Plain Text' : 'Enable Rich Editor'}
        </button>
      </div>
      {isRichEditor ? (
        <div className={`border rounded-md ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'}`}>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            editorClassName="p-2 min-h-[150px]"
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
              inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
              list: { options: ['unordered', 'ordered'] },
            }}
            {...props}
          />
        </div>
      ) : (
        <Textarea
          id={props.id || props.name}
          {...field}
          {...props}
          className={`${
            meta.touched && meta.error ? 'rounded-md border border-red-500' : 'rounded-md border border-gray-300'
          } w-full p-2`}
        />
      )}
      {meta.touched && meta.error ? (
        <span className="error text-red-500 text-xs ml-3">{meta.error}</span>
      ) : null}
    </div>
  );
};

export default InputTextArea;