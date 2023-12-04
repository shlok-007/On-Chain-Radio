import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Songs } from "../components/Songs";
import Footer from "../components/Footer";

interface HomeProps {
    login: boolean,
    setLogin: React.Dispatch<React.SetStateAction<boolean>>,
    subscribe: boolean,
    setSubscribe: React.Dispatch<React.SetStateAction<boolean>>
}

const Home: React.FC<HomeProps> = ({ login, setLogin, subscribe, setSubscribe }) => {
    console.log(login +" from home");
    return (
        <div>
             <Navbar login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />
            <Hero login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />
            <section id="exploresongs">
                <Songs login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />
            </section>
            <Footer />
        </div>
    )
}

export {Home};