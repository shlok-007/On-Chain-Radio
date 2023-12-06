import React, { useState } from "react";
import { Polls } from "../components/Polls";
import Timer from "../components/Timer";
import { Parameter } from "../components/Parameter";
import PollModal from "../components/PollModal";

const Community: React.FC = () => {
    const [votes, setVotes] = useState({for:3, against:2});
    const [poll, setPoll] = useState([{
        question:"Are you liking the App",
        time: 0,
        votes: {
            for: 1,
            against: 0
        }
    }]);
    return (
        <div className="text-center">
            {/* Parameters */}
            <div className="grid md:grid-cols-4 sm:grid-cols-2 lg:w-3/4 m-auto">
                <Parameter title="Parameter" value="value" />
                <Parameter title="Parameter" value="value" />
                <Parameter title="Parameter" value="value" />
                <Parameter title="Parameter" value="value" />
            </div>
            <PollModal poll={poll} setPoll={setPoll} />
            {/* <Polls question="What is your faviorite Song" options={["Tu hai Kahan", "Rap God", "Sham", "Faded"]} time={10} votes={10} optionVotes={[2, 2, 3, 3]} /> */}
            {
                <div>
                {poll.map((pollItem, index) => (
                  <div key={index}>
                    <Polls question={pollItem.question} time={pollItem.time} votes={votes} setVotes={setVotes} />
                  </div>
                ))}
              </div>
            }
        </div>
    )
}

export {Community}