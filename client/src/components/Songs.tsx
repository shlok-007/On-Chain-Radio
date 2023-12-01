import React from "react";
import { Card } from "./Card";

const Songs: React.FC = () => {
    return (
        <div className="text-center text-white bg-indigo-500">
            <p className="text-4xl font-bold">Popular Songs</p>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 sm">
                <div className="h-150"><Card /></div>
                <div className="h-150"><Card /></div>
                <div className="h-150"><Card /></div>
                <div className="h-150"><Card /></div>
            </div>
        </div>
    )
}

export {Songs};