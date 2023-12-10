import React, {SetStateAction, useEffect, useState} from "react";
import Timer from "./Timer";
import { Alert, AlertTitle } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import BarGraph from "./BarGraph";
import { Poll } from "../utils/types";
import { Provider, Network } from "aptos";


interface PollProps {
    question: string,
    votes_for: number
    votes_against: number,
    time: number,
    index: number,
    polls: (Poll | null)[],
    setPolls: React.Dispatch<React.SetStateAction<(Poll | null)[]>>
}

const Polls: React.FC<PollProps> = ({ question, votes_against, votes_for, time, setPolls, polls, index }) => {
    const [show, setShow] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const provider = new Provider(Network.TESTNET);
    const [state,setState]=useState("");
    //const [for,setFor]=useState(false);
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(value);
      };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (state !== "") setShow(true);
        if (state !== "") {
            if (state === 'for') {
                setPolls((prevPolls) => {
                    const updatedPolls = [...prevPolls];
                    const pollToUpdate = updatedPolls[index];

                    if (pollToUpdate !== null) {
                        // Update the votes_for property
                        pollToUpdate.votes_for += 1;
                    }

                    return updatedPolls;
                    });
            }
            else {
                setPolls((prevPolls) => {
                    const updatedPolls = [...prevPolls];
                    const pollToUpdate = updatedPolls[index];

                    if (pollToUpdate !== null) {
                        // Update the votes_for property
                        pollToUpdate.votes_against += 1;
                    }

                    return updatedPolls;
                    });
            }
        }
    }
    const handleS = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const moduleAddress=process.env.REACT_APP_MODULE_ADDR_TEST;
        try {
          const payload = {
            type: "entry_function_payload",
            function: `${moduleAddress}::community::end_poll`,
            //here we require poll type??
            arguments: [index+1],
            type_arguments: [],
          };
        // sign and submit transaction to chain
        const response =await window.aptos.signAndSubmitTransaction(payload);
        await provider.waitForTransaction(response.hash);
        console.log(response);
        setPolls((prevPolls) => {
            const newPollArray = [...prevPolls];
            newPollArray[index] = null;
            return newPollArray
          })
        } catch (error) {
          console.error(error);
        }
      };
      const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const moduleAddress=process.env.REACT_APP_MODULE_ADDR_TEST;
        try {
          const payload = {
            type: "entry_function_payload",
            function: `${moduleAddress}::community::vote`,
            //give a state using useState of boolean type for true if for and flase if against??
            arguments: [true,index+1],
            type_arguments: [],
          };
        // sign and submit transaction to chain
        const response =await window.aptos.signAndSubmitTransaction(payload);
        await provider.waitForTransaction(response.hash);
        console.log(response);
        } catch (error) {
          console.error(error);
        }
      };

      //write the tyhpe of question and option type??

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-2 mb-4 md:w-3/4 sm:w-full m-auto">
            <div>
                <p className="inline-block text-black w-3/4 text-lg font-bold">This is for the Option {index + 1}: {question}</p>
                {/* if you want to add the timer functionality uncomment the following code */}
                {/* <Timer initialTime={time ? time : 0} onTimerEnd={() => setTimeUp(true)} /> */}
            </div>

            {/* options */}
            <form onSubmit={handle}>
            {show && <BarGraph votes_against={votes_against} votes_for={votes_for} />}

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
                <button type="button"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={handleS}>End poll</button>
            </form>
        </div>
    )
}

export {Polls}