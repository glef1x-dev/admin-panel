import React from "react";
import MDEditor from '@uiw/react-md-editor';
import {useInput} from "ra-core";

export default function MarkdownInput(props) {
    const {onChange, onBlur} = props;
    const {
        field,
    } = useInput({
        // Pass the event handlers to the hook but not the component as the field property already has them.
        // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
        onChange,
        onBlur,
        ...props,
    });
    return (
        <div className="container" style={{
            width: "800px",
        }}>
            <MDEditor
                value={field.value}
                onChange={field.onChange}
                preview="edit"
                components={{
                    toolbar: (command, disabled, executeCommand) => {
                        if (command.keyCommand === 'code') {
                            return (
                                <button
                                    aria-label="Insert code"
                                    disabled={disabled}
                                    onClick={(evn) => {
                                        evn.stopPropagation();
                                        executeCommand(command, command.groupName)
                                    }}
                                >
                                    Code
                                </button>
                            )
                        }
                    }
                }}
            />
        </div>
    );
}