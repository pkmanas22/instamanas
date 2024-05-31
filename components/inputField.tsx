import React from 'react'

export function InputField({ id, label, type, value, placeholder, onChange, isDisable }: {
    id: string,
    label: string,
    type: string,
    value: any,
    placeholder: string,
    onChange: (value: string) => void,
    isDisable?: boolean
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block my-2 text-sm font-medium">
                {label}
            </label>

            <input
                onChange={(e) => onChange(e.target.value)}
                type={type}
                id={id}
                disabled={isDisable}
                value={value}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder} />
        </div>
    )
};