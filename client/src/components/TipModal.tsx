import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { Song } from "../utils/types";
import { Provider, Network } from "aptos";
import { useAccountContext } from "../utils/context";
import getUserAccount from "../utils/getUserAccount";
import { Account } from "../utils/types";

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

export default function TipModal({currentSong}: {currentSong: Song}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState("1");
  const [artistAccount, setArtistAccount] = useState<Account | null>(null);
  const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST || "";
  const provider = new Provider(Network.TESTNET);
  const [totalTips, setTotalTips] = useState(currentSong.total_tips);

  const handleAmountChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(e.target.value);
  };

  const handleTipClick = (tipAmount: React.SetStateAction<string>) => {
    setAmount(tipAmount);
  };

  const handleSubmit = async () => {
    if(amount === "0"){
      alert("Amount cannot be 0");
      return;
    }
    console.log(`Sending ${amount} APT`);
    await tipSong(Number(amount)*100000000);
  };

  const tipSong = async (tip_amount : number) => {
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::songStore::tip_song`,
      type_arguments: [],
      arguments: [
        `${currentSong.song_store_ID}`,
        currentSong.genre,
        currentSong.premium,
        `${tip_amount}`
      ],
    };
    console.log("Final tip amt ",currentSong.total_tips/100000000 + tip_amount/100000000);
    // console.log(currentSong.total_tips);
    // console.log(tip_amount/100000000, tip_amount);

    // console.log(payload);
    try{
      const response = await window.aptos.signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      console.log("Song tipped");
      setTotalTips(currentSong.total_tips/100000000 + tip_amount/100000000);
      alert("Song tipped successfully");
    } catch(e){
      console.log("Error tipping song", e);}
  }

  useEffect(() => {
    if(artistAccount === null){
      getUserAccount(currentSong.artist_wallet_address).then((account) => {
        console.log("Artist Acc",account);
        if(typeof(account)!=='number')
          setArtistAccount(account);
      });
    }
  }, [currentSong]);

  return (
    <div>
      <div className="grid-cols-2">
        <div>
          <p>{totalTips ===0 ? currentSong.total_tips/100000000 : totalTips} APT</p>
          <p>Total Tips</p>
        </div>
      <Button onClick={handleOpen}>
        <FontAwesomeIcon icon={faWallet} className="text-center" size="2xl" />
      </Button>
      </div>
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
                <span className="text-[#64748B]">Tip the Artist</span>
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
                    placeholder="2"
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
                  {["2", "5", "10"].map((tip) => (
                    <div
                      key={tip}
                      className="mt-[14px] cursor-pointer truncate rounded-[4px] border-[1px] border-gray-500 p-3 text-gray-200 m-3"
                      onClick={() => handleTipClick(tip)}
                    >
                      {tip+" APT"}
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
                      <span className="font-semibold text-white">You</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                      <div className="text-[#64748B]">
                        {/* starting 2 digits and last 4 diigts of address */}
                        {/* {currentSong.artist_wallet_address.slice(0,8)+"..."+currentSong.artist_wallet_address.slice(-15)} */}
                        {useAccountContext()?.wallet_address.slice(0,8)+"..."+useAccountContext()?.wallet_address.slice(-15)}
                      </div>
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
                    {/* <svg
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
                    </svg> */}
                    {/* <div className="font-semibold text-green-700">
                      Add recipient
                    </div> */}
                  </div>
                </div>

                <div className="flex items-center gap-x-[10px] bg-black border-[1px] p-2 mt-2 rounded-[4px]">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={artistAccount?.bio.profile_img_hash === "" ? "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png" : "https://ipfs.io/ipfs/"+artistAccount?.bio.profile_img_hash}
                    alt=""
                  />
                  <div>
                    <div className="font-semibold text-white">{currentSong.artist_wallet_address.slice(0,8)+"..."+currentSong.artist_wallet_address.slice(-15)}</div>
                    <div className="text-[#64748B]">{artistAccount?.name}</div>
                  </div>
                </div>
              </div>

              {/* --------------------------SEND Button------------------------- */}
              <div className="mt-6">
                <div
                  className="w-full cursor-pointer rounded-[4px] bg-indigo-500 px-3 py-[6px] text-center font-semibold text-white"
                  onClick={handleSubmit}
                >
                  Send {amount+" APT"}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
