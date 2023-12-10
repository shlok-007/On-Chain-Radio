import React from "react";
import FreeCard from "./FreeCard";
import PremiumCard from "./PremiumCard";
import { useAccountContext } from "../utils/context";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import  { useState, useEffect } from "react";


interface SongsProps {
}



const Songs: React.FC<SongsProps> = ({  }) => {
  let login = useAccountContext() !== null;
  const provider = new Provider(Network.TESTNET);
  const { account} = useWallet();
  const[free,setFree]=useState([]);
  const[pre,setPre]=useState([]);

  const fetchList = async () => {
    const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST;
    try {
      const SongResource = await provider.getAccountResource(
        moduleAddress?? '',
        `${moduleAddress}::songStore::SongStore`
      );
      // console.log('SongResource:', SongResource);
      // if (SongResource && SongResource?.data) {
      //   setFree(SongResource.data?.free_songs?.songs);
      // }
      // if (SongResource && SongResource?.data?.premium_songs) {
      //   setPre(SongResource.premium_songs);
      // }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  

  //mapping of each song on basis of there suscrip that is paid or not paid

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
              {/* let _genre_list = vector[utf8(b"Rock"), utf8(b"Pop"), utf8(b"HipHop"), utf8(b"Classical"), utf8(b"Jazz")]; */}
        
              <FreeCard genre="Rock" />
              <FreeCard genre="Pop" />
              <FreeCard genre="HipHop" />
              <FreeCard genre="Classical" />
              <FreeCard genre="Jazz" />

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
            <FreeCard genre="Rock" />
            <FreeCard genre="Pop" />
            <FreeCard genre="HipHop" />
            <FreeCard genre="Classical" />
            <FreeCard genre="Jazz" />
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
              <PremiumCard genre="Rock" />
              <PremiumCard genre="Pop" />
              <PremiumCard genre="HipHop" />
              <PremiumCard genre="Classical" />
              <PremiumCard genre="Jazz" />
              
              {/* <!-- END OF FREE CARD  --> */}
            </section>
          </div>
        </main> </div>}
    </div>
  );
};

export { Songs };
