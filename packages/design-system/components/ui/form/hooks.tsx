import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormCheckbox } from './form-checkbox';
import { FormInput } from './form-input';
import { FormSelect } from './form-select';
import { FormTextarea } from './form-text-area';

const { fieldContext, formContext, useFieldContext, useFormContext } = 
    createFormHookContexts();

const { useAppForm } = createFormHook({
    fieldComponents: {
        Input: FormInput,
        TextArea: FormTextarea,
        Select: FormSelect,
        Checkbox: FormCheckbox,
    },
    formComponents: {},
    fieldContext,
    formContext,
})

export { useAppForm, useFieldContext, useFormContext };

