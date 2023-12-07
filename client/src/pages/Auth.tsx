import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Avatar from "../components/Avatar";
import { useWallet, AptosWalletProviderProps } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from 'aptos';
import { PetraWallet } from "petra-plugin-wallet-adapter";

const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

interface AuthProps {
  address: string,
  publicKey: string | string[],
  login: boolean,
  setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

declare global {
  interface Window {
    PetraWallet: any;
    aptos: any;
  }
}


const Auth: React.FC<AuthProps> = ({ address, publicKey, login, setLogin }: AuthProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const { wallet, connected, isLoading } = useWallet();
  const Petra = new PetraWallet();

  const handleAccountCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet) {
      alert("Please connect your wallet");
      return;
    }
    try {
      const transaction = {
        type: "entry_function_payload",
        function: `${address}::user::create_account`,
        arguments: [username, email, false],
        type_arguments: [],
      };
      
      const result = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(result);
      setLogin(true);
      navigate('/')
      // if the transaction was successful then navigate to home page
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  const handleHaveAnAccount = async () => {
    // open a pop up
    // connect to wallet
    // check if the user has an account
    // if yes, navigate to home page
    // if no, navigate to signup page
  };

  return (
    <div className="bg-gradient-to-b bg-[#7CA4AE]">
      <section className="gradient-form w-full flex justify-center items-center">
        <div className="container h-full w-4/5 md:py-16">
          <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-200">
            <div className="w-full">
              <div className="block bg-gray-900">
                <div className="g-0 lg:flex lg:flex-wrap">
                  {/* <!-- Left column container--> */}
                  <div className="px-4 md:px-0 lg:w-6/12">
                    <div className="md:mx-6 md:p-12">
                      {/* <!--Logo--> */}
                      <div className="text-center">
                        <img className="mx-auto w-48" src={Logo} alt="logo" />
                        <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                          PeerPlay
                        </h4>
                      </div>
                      <form onSubmit={handleAccountCreation}>

                        {!connected && <a onClick={handleConnectWallet} className="hover:cursor-pointer">
                          First configure your wallet
                        </a>
                        }
                        {connected && <div className="text-indigo-500">Wallet Connected</div>
                        }


                        {/* <!--Username input--> */}
                        <div className="relative my-4">
                          <input
                            type="text"
                            className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            placeholder="Username"
                            required
                          />
                        </div>

                        {/* <!--Email--> */}
                        <div className="relative mb-4">
                          <input
                            type="email"
                            className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                          />
                        </div>

                        {/* <!--Register button--> */}
                        <div className="flex items-center justify-between pb-6">
                          <a
                            onClick={handleHaveAnAccount}
                            className="mb-0 mr-2 hover:cursor-pointer"
                          >
                            Already have an account? Log in
                          </a>
                        </div>

                        {/* <!--Submit button--> */}
                        <div className="mb-12 pb-1 pt-1 text-center">
                          <button
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-blue-500"
                            type="submit"
                          >
                            Submit
                          </button>
                          <div className="hidden">
                            <WalletSelector isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* <!-- Right column container with background and description--> */}
                  <div
                    className="flex items-center lg:w-6/12 bg-gray-800"
                  >
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-xl font-semibold">
                        Choose your avatar
                      </h4>
                      <p className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat.
                      </p>
                      <div className="pt-8 flex justify-center items-center">
                        <Avatar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
