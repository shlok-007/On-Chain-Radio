import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import HistoryIcon from "@mui/icons-material/History";

interface NavBarDashboardProps {
  indexProp: Number
}

const styles = {
  gradientDiv: {
    background: 'linear-gradient(to bottom, #FFB6C1, #87CEEB)', // Adjust colors as needed
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white', // Text color on the gradient background
  }
}

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

const NavBarDashboard: React.FC<NavBarDashboardProps> = ({ indexProp }) => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  const handleclick = (index: number) => {
    setActiveNavIndex(index);
  };

  return (
    <nav className="flex pt-20">
      <div className="mx-auto flex gap-4">
        {navLinks.map((link, index) => (
          <div
            key={index}
            className={
              "flex cursor-pointer p-2" +
              (activeNavIndex === index
                ? " rounded bg-indigo-500 text-white"
                : "")
            }
            onClick={(event) => {
              event.preventDefault();
              handleclick(index);
            }}
          >
            <div className={"text-xl"}>
              <link.icon />
            </div>
            <div className="ml-3 items-center justify-center hidden md:flex">
              {link.name}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavBarDashboard;
