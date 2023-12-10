import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { Poll } from "../utils/types";
import { Provider, Network } from "aptos";
import { Link, useNavigate } from "react-router-dom"; 

interface FormData {
  proposed_value: number,
  justification: string,
  poll_type: number
}

interface PollModalProps {
  setPolls: React.Dispatch<React.SetStateAction<(Poll | null)[]>>
  polls: (Poll | null)[]
}

const PollModal:React.FC<PollModalProps> = ({ setPolls, polls }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const provider = new Provider(Network.TESTNET);
    const [formData, setFormData] = useState<FormData>({
      proposed_value: 0,
      justification: '',
      poll_type: 0
    });
    
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      key: keyof FormData
    ) => {
      setFormData({
        ...formData,
        [key]: key === 'justification' ? e.target.value : parseInt(e.target.value, 10),
      });
    };
    //create poll submit
    const handleCreatePoll = async (e: React.FormEvent<HTMLFormElement>) => {
      if (!polls[formData.poll_type]) {
        console.log('This poll is already created');
        return;
      }
      e.preventDefault();
      const moduleAddress=process.env.REACT_APP_MODULE_ADDR_TEST;
      try {
        const payload = {
          type: "entry_function_payload",
          function: `${moduleAddress}::community::create_poll`,
          arguments: [ formData.proposed_value,formData.justification, formData.poll_type ],
          type_arguments: [],
        };
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      console.log(response);
      if(response.vm_status === "Executed successfully")
      {
        //show the poll below after closing the modal
        const newPoll: Poll = {
          proposed_cut: formData.proposed_value,
          justification: formData.justification,
          votes_for: 0,
          votes_against: 0,
          end_time: formData.poll_type,
          voters: [],
        };
        // Update state in the parent component (Community)
        setPolls((prevPolls) => {
          const newPollArray = [...prevPolls]
          newPollArray[formData.poll_type] = newPoll
          return newPollArray;
        });
        handleClose();
      }
      } catch (error) {
        console.error(error);
        // const newPoll: Poll = {
        //   proposed_cut: formData.proposed_value,
        //   justification: formData.justification,
        //   votes_for: 0,
        //   votes_against: 0,
        //   end_time: formData.poll_type,
        //   voters: [],
        // };
        // // Update state in the parent component (Community)
        // // setPolls((prevPolls) => [...prevPolls, newPoll]);
        // setPolls((prevPolls) => {
        //   const newPollArray = [...prevPolls]
        //   newPollArray[formData.poll_type] = newPoll
        //   return newPollArray;
        // });
        handleClose();
      }
    };

    // useEffect(() => {
    //   // Check if there are existing polls
    //   if (setPolls.length > 0) {
    //     // If there are existing polls, show them
    //     handleOpen();
    //   }
    // }, [setPolls]);

    const handleSelect = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setFormData(() => {
        const value = e.target.value;
        
       return ({
        ...formData,
        poll_type: parseInt(value)
       })
      })
    }
    
    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   // send form data
    //   // const data = {
    //   //     question: formData.title,
    //   //     time: formData.hours * 3600 + formData.minutes * 60,
    //   //     votes: {
    //   //         for:0,
    //   //         against: 0
    //   //     }
    //   // }
    //   // setPoll((pre) => {
    //   //     return (
    //   //         [...pre, data]
    //   //     )
    //   // })
    //   setPolls((prev: (Poll | null)[]) => {
    //     const newPoll: (Poll | null) = {
    //       proposed_cut: formData.proposed_value,
    //       justification: formData.justification,
    //       votes_for: 0,
    //       votes_against: 0,
    //       end_time: formData.poll_type,
    //       voters: []
    //     }
    //     return(
    //       [...prev, newPoll]
    //     )
    //   })
    //   handleClose();
    //   console.log('Form submitted:', formData);
    // };

  return (
    <div>
     <button onClick={handleOpen} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">Add Poll</button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex items-center justify-center h-screen">
            
        <form onSubmit={handleCreatePoll} className="max-w-md mx-auto w-2/3 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <div className="text-center">
            <p className="text-xl font-bold">Create Poll</p>
        </div>
        <label htmlFor="hours" className="block text-sm font-medium text-gray-600">
          Poll For
        </label>
        {/* <input
          type="number"
          id="hours"
          value={formData.poll_type}
          onChange={(e) => handleInputChange(e, 'poll_type')}
          required
          className="mt-1 p-2.5 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        /> */}
        <select id="countries" onChange={handleSelect} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <option selected>Select any on option</option>
          {polls[0] === null ? <></> : <option value={1}>Option 1</option>}
          {polls[1] === null ? <></> : <option value={2}>Option 2</option>}
          {polls[2] === null ? <></> : <option value={3}>Option 3</option>}
          {polls[3] === null ? <></> : <option value={4}>Option 4</option>}
        </select>
        
      </div>
      <div className="mb-4">
        <label htmlFor="justification" className="block text-sm font-medium text-gray-600">
          Why ?
        </label>
        <input
          type="text"
          id="justification"
          value={formData.justification}
          onChange={(e) => handleInputChange(e, 'justification')}
          required
          className="mt-1 p-2.5 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="proposed_value" className="block text-sm font-medium text-gray-600">
          Proposed Value
        </label>
        <input
          type="number"
          id="minutes"
          value={formData.proposed_value}
          onChange={(e) => handleInputChange(e, 'proposed_value')}
          required
          className="mt-1 p-2.5 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
        </div>
      </Modal>
    </div>
  );
}
export default PollModal