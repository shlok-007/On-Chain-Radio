import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

interface FormData {
    title: string;
    hours: number;
    minutes: number;
  }

  interface PollModalProps {
    poll: {
        question: string;
        time: number;
        votes: {
          for: number;
          against: number;
        };
      }[];
      setPoll: React.Dispatch<
        React.SetStateAction<
          {
            question: string;
            time: number;
            votes: {
              for: number;
              against: number;
            };
          }[]
        >
      >;
  }

const PollModal:React.FC<PollModalProps> = ({poll, setPoll}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        hours: 0,
        minutes: 0,
      });
    
      const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof FormData
      ) => {
        setFormData({
          ...formData,
          [key]: key === 'title' ? e.target.value : parseInt(e.target.value, 10),
        });
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // send form data
        const data = {
            question: formData.title,
            time: formData.hours * 3600 + formData.minutes * 60,
            votes: {
                for:0,
                against: 0
            }
        }
        setPoll((pre) => {
            return (
                [...pre, data]
            )
        })
        handleClose();
        console.log('Form submitted:', formData);
      };

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
            
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-2/3 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <div className="text-center">
            <p className="text-xl font-bold">Create Poll</p>
        </div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-600">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange(e, 'title')}
          required
          className="mt-1 p-2.5 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="hours" className="block text-sm font-medium text-gray-600">
          Hours:
        </label>
        <input
          type="number"
          id="hours"
          value={formData.hours}
          onChange={(e) => handleInputChange(e, 'hours')}
          required
          className="mt-1 p-2.5 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="minutes" className="block text-sm font-medium text-gray-600">
          Minutes:
        </label>
        <input
          type="number"
          id="minutes"
          value={formData.minutes}
          onChange={(e) => handleInputChange(e, 'minutes')}
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