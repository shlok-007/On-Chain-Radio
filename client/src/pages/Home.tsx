import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Songs } from "../components/Songs";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <section id="exploresongs">
                <Songs />
            </section>
            <Footer />
        </div>
    )
}

export {Home};