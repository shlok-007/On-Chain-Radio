import ladyMusic from "../assets/ladyMusic.png";

const Hero = () => {
  return (
    <div>
      <section className="text-gray-200 body-font bg-black">
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
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Sign in
              </button>
              <button className="ml-4 inline-flex text-gray-900 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Explore
              </button>
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

export {Hero};
