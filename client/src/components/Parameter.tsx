import React from "react";

interface ParameterProps {
    title: string
    value: string
}

const Parameter: React.FC<ParameterProps> = ({ title, value }) => {
    return (
        <div className="block max-w-sm p-6 bg-indigo-700 text-center rounded-lg shadow hover:bg-indigo-900 m-3">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-100">{value}</h5>
            <p className="font-normal text-gray-200">{title}</p>
        </div>
    )
}

export {Parameter}