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


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab icon={<DashboardIcon />} label="DashBoard" iconPosition="start" />
            <Tab label="Transactions" icon={<ShowChartIcon />} iconPosition="start" />
            <Tab icon={<Person2Icon />} label="Profile" iconPosition="start" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Insights />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Tables address={address} publicKey={publicKey} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Profile address={address} />
        </CustomTabPanel>
      </Box>
    </div>

  );
}
