"use client";

import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onclick: () => void;
    isDisabled?: boolean;
}

export const Button = ({ children, onclick, isDisabled }: ButtonProps) => {
    return (
        <button
            onClick={onclick}
            type="button"
            disabled={isDisabled}
            className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );
};