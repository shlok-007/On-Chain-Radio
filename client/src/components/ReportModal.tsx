import React from "react";
import { Song } from "../utils/types";
import { Provider, Network } from "aptos";

interface ReportModalProps {
    report: boolean,
    setReport: React.Dispatch<React.SetStateAction<boolean>>,
    song: Song
}

const ReportModal: React.FC<ReportModalProps> = ({report, setReport, song}) => {

    const provider = new Provider(Network.TESTNET);
    const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST;
    const reportSubmit= async () => {
        const payload = {
            type: "entry_function_payload",
            function: `${moduleAddress}::song::report_song`,
            arguments: [song.artist_wallet_address, song.artist_store_ID],
            type_arguments: [],
          };
        // sign and submit transaction to chain
        const response = await window.aptos.signAndSubmitTransaction(payload);
        // wait for transaction
        await provider.waitForTransaction(response.hash);
        alert("Song reported successfully");
        setReport(false);
    }


    return (
        <div className="text-center justify-center">
                    <div id="deleteModal" tabIndex={-1} aria-hidden="true" className="absolute z-50 justify-center items-center flex md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                {/* <!-- Modal content --> */}
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button type="button" onClick={() => setReport(false)}className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <svg className="m-auto my-5" xmlns="http://www.w3.org/2000/svg" height="64" width="64" viewBox="0 0 512 512"><path fill="#bdc2cc" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to report this song?</p>
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={() => setReport(false)} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                            No, cancel
                        </button>
                        <button type="submit" onClick={reportSubmit} className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export {ReportModal}