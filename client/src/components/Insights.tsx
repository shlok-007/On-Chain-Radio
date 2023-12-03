import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center md:py-10 md:px-16 overflow-y-auto w-full">
        <h2 className="text-2xl font-semibold">Dashboard</h2>

        <div className="flex md:space-x-8 py-6 flex-col md:flex-row gap-y-4">
          <div className="flex flex-col rounded-md border w-[350px] p-8 justify-center">
            <h2>Yatharth Verma</h2>
            <p className="text-gray-500 mt-3">Your Expenses: Rs10000</p>
          </div>
          <div className="flex flex-col rounded-md border w-[350px] p-8 justify-center">
            <h2>Yatharth Verma</h2>
            <p className="text-gray-500 mt-3">Your Savings: Rs100000</p>
          </div>
        </div>

        {/* ---------------------------CHART--------------------------- */}

        <div className="flex md:space-x-8 py-6 w-full justify-center items-center">
          <div className="flex flex-col rounded-md border w-[350px] md:w-[726px] p-8 justify-center">
            <p>Expenses Graph</p>
            <Chart />
          </div>
        </div>

        <div className="flex md:space-x-8 py-6 flex-col md:flex-row gap-y-4">
          <div className="flex flex-col rounded-md border w-[350px] p-8 justify-center">
            <h2>Yatharth Verma</h2>
            <p className="text-gray-500 mt-3">Your Expenses: Rs10000</p>
          </div>
          <div className="flex flex-col rounded-md border w-[350px] p-8 justify-center">
            <h2>Yatharth Verma</h2>
            <p className="text-gray-500 mt-3">Your Savings: Rs100000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
