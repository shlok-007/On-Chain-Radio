import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export default function TipModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState("$100.00");

  const handleAmountChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(e.target.value);
  };

  const handleTipClick = (tipAmount: React.SetStateAction<string>) => {
    setAmount(tipAmount);
  };

  const handleSubmit = () => {
    // Add your logic to handle the form submission
    console.log(`Sending $${amount}`);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <FontAwesomeIcon icon={faWallet} className="text-center" size="xl" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="rounded-lg bg-black">
          {/* -------------------------------<!-- component -->------------------------------ */}
          <div className="font-manrope flex w-full items-center justify-center">
            <div className="mx-auto box-border w-[365px] border bg-black p-4">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Sending Money</span>
                <div
                  className="cursor-pointer border rounded-[4px]"
                  onClick={handleClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#64748B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6">
                <div className="font-semibold text-white">
                  How much would you like to send?
                </div>
                <div>
                  <input
                    className="mt-1 w-full bg-black text-gray-200 rounded-[4px] border-[1px] border-gray-500 p-2"
                    value={amount}
                    type="text"
                    placeholder="100.00"
                    onChange={handleAmountChange}
                  />
                </div>
                <div className="flex justify-between">
                  {/* ... Other code for predefined amounts ... */}
                </div>
              </div>

              {/*----------------------- ... Other form fields ... -----------------------*/}

              <div className="flex justify-between">
                <div className="flex justify-around">
                  {["10", "50", "100", "200"].map((tip) => (
                    <div
                      key={tip}
                      className="mt-[14px] cursor-pointer truncate rounded-[4px] border-[1px] border-gray-500 p-3 text-gray-200 m-3"
                      onClick={() => handleTipClick(tip)}
                    >
                      ${tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* --------------------------FROM------------------------ */}
              <div className="mt-6">
                <div className="font-semibold text-white">From</div>
                <div className="mt-2">
                  <div className="flex w-full items-center justify-between bg-black border- border-[1px] white p-3 rounded-[4px]">
                    <div className="flex items-center gap-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#299D37]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold text-white">Checking</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                      <div className="text-[#64748B]">card ending in 6678</div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* --------------------------TO------------------------- */}
              <div className="mt-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    Receiving
                  </span>
                  <div className="flex cursor-pointer items-center gap-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="font-semibold text-green-700">
                      Add recipient
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-x-[10px] bg-black border-[1px] p-2 mt-2 rounded-[4px]">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1507019403270-cca502add9f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    alt=""
                  />
                  <div>
                    <div className="font-semibold text-white">Kathy Miller</div>
                    <div className="text-[#64748B]">@KittyKatmills</div>
                  </div>
                </div>
              </div>

              {/* --------------------------SEND Button------------------------- */}
              <div className="mt-6">
                <div
                  className="w-full cursor-pointer rounded-[4px] bg-indigo-500 px-3 py-[6px] text-center font-semibold text-white"
                  onClick={handleSubmit}
                >
                  Send ${amount}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
