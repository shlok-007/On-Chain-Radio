import React from "react";
import FreeCard from "./FreeCard";
import PremiumCard from "./PremiumCard";

const Songs: React.FC = () => {
  return (
    <div>

        {/*--------------------- <!-- FREE SECTION >-------------------------- */}

      <main className="grid place-items-center min-h-screen bg-gradient-to-b from-black to-indigo-900 p-5">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 mb-5">
            Free Stations
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* <!-- FREE CARD  --> */}
            <FreeCard />
            <FreeCard />
            <FreeCard />
            <FreeCard />
            {/* <!-- END OF FREE CARD  --> */}
          </section>
        </div>
      </main>

        {/*--------------------- <!-- PREMIUM SECTION >----------------------- */}
      <main className="grid place-items-center min-h-screen bg-gradient-to-t from-black to-indigo-900 p-5">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 mb-5">
            Premium Stations
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* <!-- FREE CARD  --> */}
            <PremiumCard />
            <PremiumCard />
            <PremiumCard />
            <PremiumCard />
            {/* <!-- END OF FREE CARD  --> */}
          </section>
        </div>
      </main>
    </div>
  );
};

export { Songs };
