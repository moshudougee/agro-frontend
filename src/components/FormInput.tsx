/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {  ValidationRule, FieldErrors, FieldValues } from 'react-hook-form'

interface FormInputProps<T extends FieldValues> {
    id: keyof T;
    name: string;
    type?: string;
    step?: number
    disabled?: boolean;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
    maxLength?: number;
    register: (name: keyof T, options: any) => any;
    errors: FieldErrors<T>;
}

const FormInput = <T extends FieldValues,>({
    id,
    name,
    type = 'text',
    step,
    disabled = false,
    required,
    pattern,
    maxLength,
    register,
    errors,
 }: FormInputProps<T>) => {
    const errorMessage = errors[id]?.message as React.ReactNode;
  return (
    <div className="flex flex-col gap-1">
        <div className='form-item'>
            <div className='flex w-full md:w-1/5'>
                <span className=''>{name}</span>
            </div>
            <div className="flex w-full md:w-4/5">
                <input
                    type={type}
                    id={id as string}
                    step={step}
                    {...register(id, {
                    required: required && `${name} is required`,
                    pattern,
                    maxLength: maxLength && `${name} must be at most ${maxLength} characters long`,
                    ...(type === 'number' && { min: { value: 0.01, message: `${name} must be greater than zero` } }),
                    })}
                    className={type === 'checkbox' ? 
                        '' :
                        'form-input'
                    }
                    disabled={disabled}
                />
            </div>
        </div>
        {errorMessage && <div className="flex text-red-700 w-full justify-center">{errorMessage}</div>}
    </div>
  )
}

export default FormInput