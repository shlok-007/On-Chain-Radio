import React, {SetStateAction, useEffect, useState} from "react";
import Timer from "./Timer";
import { Alert, AlertTitle } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import BarGraph from "./BarGraph";

interface PollProps {
    question: string,
    votes: {
        for: number,
        against: number
    },
    setVotes: React.Dispatch<SetStateAction<{
        for: number,
        against: number
    }>>,
    time: number
}

const Polls: React.FC<PollProps> = ({ question, votes, setVotes, time }) => {
    const [show, setShow] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [state, setState] = useState("");

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(value);
      };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (state !== "") setShow(true);
        if (state !== "") {
            if (state === 'for') setVotes(() => {
                const obj = votes;
                obj.for++;
                return obj;
            });
            else setVotes(() => {
                const obj = votes;
                obj.against++;
                return obj;
            });
        }
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-2 mb-4 md:w-3/4 sm:w-full m-auto">
            <div>
                <p className="inline-block w-3/4 text-lg font-bold">{question}</p>
                <Timer initialTime={time} onTimerEnd={() => setTimeUp(true)} />
            </div>

            {/* options */}

            {show && <BarGraph votes={votes} />}

            <form className="w-3/4 m-auto my-4">
                <div className="flex items-center mb-4">
                    <input type="radio" name="for" value="for" checked={state === 'for'} className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" onChange={handleRadioChange} />
                    <label className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                        For
                    </label>
                </div>

                <div className="flex items-center mb-4">
                    <input type="radio" name="against" value="against" checked={state === 'against'} className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" onChange={handleRadioChange} />
                    <label className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Against
                    </label>
                </div>
                {/* {
                    !timeUp && show && 
                    <Alert severity="success" className="m-auto">
                        <AlertTitle>Success</AlertTitle>
                        Your response is recorded — <strong>Thank you!</strong>
                    </Alert>
                }

                {
                    timeUp && !show && 
                    <Alert severity="info" className="m-auto">
                        <AlertTitle>Information</AlertTitle>
                        We can't take response now — <strong>Time's Up!</strong>
                    </Alert>
                } */}
                <button type="submit" disabled={show} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export {Polls}