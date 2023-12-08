import React from "react";
import { Hero } from "../components/Hero";
import { Songs } from "../components/Songs";
import Footer from "../components/Footer";
import { useAccountContext } from "../utils/context";
import { Account } from "../utils/types";

interface HomeProps {
    onLoginSuccess: (account:Account) => void,
}

const Home: React.FC<HomeProps> = ({onLoginSuccess}) => {
    const login = useAccountContext() !== null ;
    return (
        <div>
            <Hero onLoginSuccess={onLoginSuccess}/>
            <section id="exploresongs">
                <Songs/>
            </section>
        </div>
    )
}

export {Home};