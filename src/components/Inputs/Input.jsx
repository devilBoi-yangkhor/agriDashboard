import React from 'react';
import { useField } from 'formik';
import { Input as TextInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Input = ({ label, ...props }) => {
    if (!props.name) {
        throw new Error("The 'name' prop is required for the Input component.");
    }

    const [field, meta] = useField(props);

    return (
        <>
            <Label
                className="mb-1.5 block text-sm font-medium"
                htmlFor={props.id || props.name}
            >
                {label}
            </Label>
            <TextInput
                id={props.id || props.name}
                {...field}
                {...props}
                className={`${meta.touched && meta.error ? 'border-red-500' : ''}`}
                size={40}
            />
            {meta.touched && meta.error ? (
                <span className="error text-red-500 text-xs ml-3">{meta.error}</span>
            ) : null}
        </>
    );
};

export default Input;
