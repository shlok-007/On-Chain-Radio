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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const styles = {
  dashboardTab: {
    background: 'linear-gradient(to bottom, #030712, #061336)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  tabText: {
    color: 'white'
  },
  midDiv: {
    background: 'linear-gradient(to bottom, #061336, #042b94)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  }
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
  address: string;
  publicKey: string | string[];
  startingPage: any
}

export default function Dashboard({address,publicKey,startingPage}: DashboardProps) {
  const [value, setValue] = React.useState(startingPage);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "#061336" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
            style={styles.dashboardTab}
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
