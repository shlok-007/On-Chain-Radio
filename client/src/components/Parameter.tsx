import React from "react";

interface ParameterProps {
    title: string
    value: string
}

const Parameter: React.FC<ParameterProps> = ({ title, value }) => {
    return (
        <div className="block max-w-sm p-6 bg-white text-center border border-gray-200 rounded-lg shadow hover:bg-gray-100 m-3">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{title}</p>
        </div>
    )
}

export {Parameter}