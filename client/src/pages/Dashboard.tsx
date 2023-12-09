import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2Icon from "@mui/icons-material/Person2";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Tables from "../components/Tables";
import Insights from "../components/Insights";
import Profile from "../components/Profile";
import { useAccountContext } from "../utils/context";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const styles = {
  tabText: {
    color: '#ffffff'
  },
  gradientDiv: {
    background: 'linear-gradient(to bottom, #030712, #0d1733)', // Adjust colors as needed
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white', // Text color on the gradient background
  },
    midDiv: {
      background: 'linear-gradient(to bottom, #0d1733, #07226b)', // Adjust colors as needed
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white', // Text color on the gradient background
    },
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={styles.midDiv}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface DashboardProps {
  startingPage: any
}

export default function Dashboard({startingPage}: DashboardProps) {
  const [value, setValue] = React.useState(startingPage);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const address = useAccountContext()?.wallet_address || "";
  const publicKey = useAccountContext()?.public_key || "";

  return (
    <div>
      <Box sx={{ width: "100%" }} >
        <Box sx={{ borderBottom: 0 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
            style={styles.gradientDiv}
          >
            <Tab icon={<DashboardIcon />} style={styles.tabText} label="DashBoard" iconPosition="start" />
            <Tab label="Transactions" style={styles.tabText} icon={<ShowChartIcon />} iconPosition="start" />
            <Tab icon={<Person2Icon />} style={styles.tabText} label="Profile" iconPosition="start" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Insights />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Tables address={address} publicKey={publicKey} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Profile />
        </CustomTabPanel>
      </Box>
    </div>

  );
}
