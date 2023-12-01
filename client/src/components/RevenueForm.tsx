import React from "react";

const RevenueForm: React.FC = () => {
    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1">
            <div className="md:px-10 sm:px-5 py-5">
                <label className="block text-left m-2">Name of the Person:</label>
                <input className="block text-left text-black h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: XYZ"></input>
            </div>
            <div className="md:px-10 sm:px-5 py-5">
                <label className="block text-left m-2">Percentage share:</label>
                <input className="block text-left text-black h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="number" placeholder="Max Value 100"></input>
            </div>
        </div>
    )
}

export {RevenueForm};