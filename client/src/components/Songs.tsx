import React from "react";
import { Card } from "./Card";

const Songs: React.FC = () => {
    return (
        <div className="text-center text-white bg-indigo-500">
            <p className="text-4xl font-bold">Popular Genre</p>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 sm">
                <div className="h-150"><Card genre="Hip Hop" /></div>
                <div className="h-150"><Card genre="Jazz" /></div>
                <div className="h-150"><Card genre="Country" /></div>
                <div className="h-150 md:hidden lg:block"><Card genre="Rock" /></div>
            </div>
        </div>
    )
}

export {Songs};