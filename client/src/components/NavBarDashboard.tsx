import React, { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/Logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const navLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: Person2Icon,
  },
  {
    name: "Activity",
    path: "/settings",
    icon: HistoryIcon,
  },
  {
    name: "Transactions",
    path: "/logout",
    icon: ShowChartIcon,
  },
  {
    name: "Logout",
    path: "/logout",
    icon: LogoutIcon,
  },
];

const variants = {
  expanded: {
    width: "20%",
  },
  nonExpanded: {
    width: "5%",
  },
};

const NavBarDashboard = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  const [isExpanded, setIsExpanded] = useState(true);

  const handleclick = (index: number) => {
    setActiveNavIndex(index);
  };

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={"flex flex-col py-12 border border-r-1 w-1/5 h-screen relative" + (isExpanded ? " px-10" : " px-4")}
    >
      <div className="logo-div flex space-x-3">
        <img src={Logo} alt="Logo" className="h-10" />
        <span className={isExpanded ? "flex items-center text-xl" : "hidden"}>PeerPlay</span>
      </div>

      <div className="h-7 w-7 rounded-full bg-indigo-500 absolute -right-[12.5px] top-12 flex items-center justify-center">
        <ArrowForwardIcon className="text-white" onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      <div className="mt-10 flex flex-col space-y-8">
        {navLinks.map((item, index) => (
          <motion.div
            key={index}
            className={
              "flex space-x-3 cursor-pointer p-2" +
              (activeNavIndex === index
                ? " rounded bg-indigo-500 text-white"
                : "")
            }
            onClick={(event) => {
              event.preventDefault();
              handleclick(index);
            }}
          >
            <item.icon  className={isExpanded ? "" : "mx-auto"}/>
            <span className={isExpanded ? "block" : "hidden"}>{item?.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NavBarDashboard;
