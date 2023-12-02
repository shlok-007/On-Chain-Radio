import React, {useState} from "react";
import { Navbar } from "../components/Navbar";
import { UploadForm } from "../components/UploadForm";
import { RevenueForm } from "../components/RevenueForm";
import  Footer  from "../components/Footer";

const Uplaod: React.FC = () => {
    const [revenue, setRevenue] = useState([<RevenueForm />]);
    const addPerson: React.MouseEventHandler<HTMLButtonElement>  = () => {
        setRevenue((pre) => {
            return (
            [...pre, <RevenueForm />]
        )
    })
    }
    const removePerson: React.MouseEventHandler<HTMLButtonElement> = () => {
        setRevenue((prev) => prev.slice(0, -1));
    }
    return (
        <div className="bg-backgroundImage bg-cover">
            <div className="text-center text-white ">
                <Navbar />
                <form className="w-3/4 mx-auto my-10 px-10 py-5">
                    <p className="w-full text-4xl font-bold m-auto">Upload Your Song</p>
                    <UploadForm />
                    <p className="w-full text-4xl font-bold m-auto">Revenue Sharing</p>
                    {revenue}
                    <div className="grid grid-cols-2 gap-10">
                    <div className="text-right"><button type="button" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={addPerson}>Add</button></div>
                    <div className="text-left"><button type="button" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" disabled={revenue.length === 1} onClick={removePerson}>Remove</button></div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
        
    )
}

export {Uplaod};