import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Avatar from "../components/Avatar";
import { useWallet, AptosWalletProviderProps } from "@aptos-labs/wallet-adapter-react";

interface AuthProps {
  address: string,
  publicKey: string | string[]
}

const Auth: React.FC<AuthProps> = ({address, publicKey}: AuthProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const { wallet, isLoading } = useWallet();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Form submitted");
      console.log(username);
      console.log(email);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  // useEffect(() => {
    
  // }, [isLoading]);

  useEffect(() => {
    if (wallet) {
      navigate("/");
    }
  }, [wallet]);


  const handleConnectWallet = async () => {
    try {
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
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
                          We are The PeerPlay Team
                        </h4>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <p className="mb-4">Please login to your account</p>
                        {/* <!--Username input--> */}
                        <div className="relative mb-4">
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
                            onClick={() => navigate("/")}
                            href="#"
                            className="mb-0 mr-2"
                          >
                            Already have an account?
                          </a>
                          <button
                            type="button"
                            className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={handleConnectWallet}
                          >
                            Connect Wallet
                          </button>
                        </div>

                        {/* <!--Submit button--> */}
                        <div className="mb-12 pb-1 pt-1 text-center">
                          <button
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-blue-500"
                            type="submit"
                          >
                            Install Wallet
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
