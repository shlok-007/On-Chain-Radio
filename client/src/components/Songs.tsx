import React from "react";
import FreeCard from "./FreeCard";
import PremiumCard from "./PremiumCard";
import { useAccountContext } from "../utils/context";

interface SongsProps {
}

const Songs: React.FC<SongsProps> = ({  }) => {
  let login = useAccountContext() !== null;

  return (
    <div>

      {/*--------------------- <!-- FREE SECTION >-------------------------- */}
      {
        !login && <main className="grid place-items-center min-h-screen bg-gradient-to-b from-gray-950 via-[#56757d] to-gray-950 p-5">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 mb-5">
              Listen Now
            </h1>
            <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* <!-- FREE CARD  --> */}
              <FreeCard genre="Jazz" />
              <FreeCard genre="Pop" />
              <FreeCard genre="Country" />
              <FreeCard genre="Classical" />
              {/* <!-- END OF FREE CARD  --> */}
            </section>
          </div>
        </main>
      }

      {login && <div> <main className="grid place-items-center min-h-screen bg-gradient-to-b from-gray-950 to-[#56757d] p-5">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 mb-5">
            Free Stations
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* <!-- FREE CARD  --> */}
            <FreeCard genre="Jazz" />
            <FreeCard genre="Pop" />
            <FreeCard genre="Country" />
            <FreeCard genre="Classical" />
            {/* <!-- END OF FREE CARD  --> */}
          </section>
        </div>
      </main>

        {/*--------------------- <!-- PREMIUM SECTION >----------------------- */}
        <main className="grid place-items-center min-h-screen bg-gradient-to-t from-gray-950 to-[#56757d] p-5">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 mb-5">
              Premium Stations
            </h1>
            <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* <!-- FREE CARD  --> */}
              <PremiumCard genre="Jazz" />
              <PremiumCard genre="Pop" />
              <PremiumCard genre="Country" />
              <PremiumCard genre="Classical" />
              {/* <!-- END OF FREE CARD  --> */}
            </section>
          </div>
        </main> </div>}
    </div>
  );
};

export { Songs };
