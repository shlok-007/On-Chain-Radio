import ladyMusic from "../assets/ladyMusic.png";
import { useState, useEffect } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccountContext } from "../utils/context";
import { Account } from "../utils/types";
import getUserAccount from "../utils/getUserAccount";

interface HeroProps {
  onLoginSuccess: (account:Account) => void,
}

const Hero: React.FC<HeroProps> = ({onLoginSuccess}) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const { account } = useWallet();
  const login = useAccountContext() !== null;
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  useEffect(() => {
    // console.log(wallet);
    getUserAccount(account ? account.address : "").then((userAccount) => {
      if (userAccount === 0) {
        navigate('/signup');
      }
    });
  }, [account?.address]);

  return (
    <div>
      <section className="text-gray-200 body-font bg-gray-950">
        <div className="container mx-auto flex px-5 md:py-24 md:flex-row flex-col-reverse items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent font-bold">
              Decentralizing Sound, Monetizing Art.&nbsp;
              <br className="hidden lg:inline-block" />
              Your Music, Your Blockchain, Your Rules.
            </h1>
            <p className="mb-8 leading-relaxed hidden lg:block">
              Immerse yourself in the future of music with our decentralized
              on-chain radio platform. Connect your wallet for instant artist
              monetization, experience real-time revenue sharing, and explore a
              world where the beats are powered by blockchain innovation. Your
              music journey begins here.
            </p>
            <div className="flex justify-center">
              {
                !login &&
                <button
                  type="button"
                  className="text-xl text-white py-2 px-6 mx-1 text-center bg-indigo-500 rounded-md"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </button>
              }
              <div className="hidden">
                <WalletSelector isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
              </div>
              <HashLink smooth to="#exploresongs" className="ml-4 inline-flex text-gray-900 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Explore
              </HashLink>
              <Link to="/learn-more" className="ml-4 inline-flex items-center text-gray-100 focus:outline-none text-lg">
                Learn More &#8594;
              </Link>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={ladyMusic}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export { Hero };
