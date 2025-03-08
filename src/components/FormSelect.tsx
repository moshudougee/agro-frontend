/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form';

interface FormSelectProps<T extends FieldValues> {
    id: keyof T;
    name: string;
    required?: boolean;
    items: Fertilizer[] | Seeds[];
    register: (name: keyof T, options: any) => any;
    errors: FieldErrors<T>;
}

const FormSelect = <T extends FieldValues,>({
    id,
    name,
    required,
    items,
    register,
    errors,
  }: FormSelectProps<T>) => {
    const errorMessage = errors[id]?.message as React.ReactNode;
    return (
      <div className="flex flex-col gap-1">
        <div className='form-item'>
            <div className='flex w-full md:w-1/5'>
                <span className=''>{name}</span>
            </div>
            <div className="flex w-full md:w-4/5">
                <select
                id={id}
                {...register(id, {
                    required: required && `${name} is required`,
                })}
                className="form-select"
                >
                <option value=''>Select From List</option>
                {items.map((item) => (
                    <option key={item.id} value={item.id}>
                    {item.name}
                    </option>
                ))}
                </select>
            </div>
        </div>
        {errorMessage && <div className="flex text-red-700 w-full justify-center">{errorMessage}</div>}
      </div>
    )
}

export default FormSelect