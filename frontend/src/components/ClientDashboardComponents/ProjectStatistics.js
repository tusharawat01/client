"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { currentUserState } from "../../atoms/userAtom";
import { useRecoilState } from "recoil";

import React from "react";
import {
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
} from "recharts";

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  { ssr: false }
);

const LineChart = dynamic(
  () => import("recharts").then((recharts) => recharts.LineChart),
  { ssr: false }
);

const applicationData = [
  { name: "Scouting", value: 200 },
  { name: "Survey", value: 100 },
  { name: "Monitoring", value: 150 },
  { name: "Inspection", value: 290 },
];
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0000ff",
  "#00ffff",
];

export default function ProjectStatistics({
  currentProjects,
  setCurrentProjects,
}) {
  // body...
  const [selectedField, setSelectedField] = useState("Industry");
  const [projects, setProjects] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [currentIndustries, setCurrentIndustries] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [currentApplications, setCurrentApplications] = useState([]);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  // console.log("Current User : ", currentUser);
  // useState([
  //   { name: "Railway", value: 400 },
  //   { name: "Roadway", value: 300 },
  //   { name: "Mining", value: 300 },
  //   { name: "Construction", value: 200 },
  //   { name: "Tower", value: 290 },
  //   { name: "Solar", value: 390 },
  // ])

  const categoryList = [
    {
      color: "blue",
      name: "Roadway",
    },
    {
      color: "green",
      name: "Railway",
    },
    {
      color: "yellow",
      name: "Construction",
    },
    {
      color: "indigo",
      name: "Bridges",
    },
    {
      color: "orange",
      name: "Empty lands",
    },
  ];

  const projectStateData = [
    {
      name: "January",
      ongoing: 35,
      completed: 40,
    },
    {
      name: "March",
      ongoing: 34,
      completed: 20,
    },
    {
      name: "May",
      ongoing: 32,
      completed: 55,
    },
    {
      name: "July",
      ongoing: 40,
      completed: 50,
    },
    {
      name: "September",
      ongoing: 70,
      completed: 25,
    },
    {
      name: "November",
      ongoing: 30,
      completed: 50,
    },
  ];

  const evaluateIndustries = (project) => {
    const industries = project?.map((pr) => pr.industry);
    const availableIndustries = [...new Set(industries)];
    setCurrentIndustries(availableIndustries);
    let tempArrData = [];
    for (let i = 0; i < availableIndustries.length; i++) {
      let ct = 0;
      for (let j = 0; j < industries.length; j++) {
        if (industries[j] === availableIndustries[i]) {
          ct += 1;
        }
      }
      let tempData = {
        name: availableIndustries[i],
        value: ct,
      };
      tempArrData = [...tempArrData, tempData];
    }
    setIndustryData(tempArrData);
  };

  const evaluateApplications = (project) => {
    const application = project?.map((pr) => pr.type);
    const availableApplications = [...new Set(application)];
    setCurrentApplications(availableApplications);
    let tempArrData = [];
    for (let i = 0; i < availableApplications.length; i++) {
      let ct = 0;
      for (let j = 0; j < application.length; j++) {
        if (application[j] === availableApplications[i]) {
          ct += 1;
        }
      }
      let tempData = {
        name: availableApplications[i],
        value: ct,
      };
      tempArrData = [...tempArrData, tempData];
    }
    setApplicationData(tempArrData);
  };

  useEffect(() => {
    if (currentProjects) {
      evaluateIndustries(currentProjects);
      evaluateApplications(currentProjects);
    }
  }, [currentProjects]);

  useEffect(() => {
    if (currentUser?.clientIndustry) {
      if (currentUser?.clientIndustry?.includes("Drone Service Provider")) {
        setSelectedField("Industry");
      } else {
        setSelectedField("Application");
      }
    }
  }, [currentUser]);

  return (
    <div className="w-full flex items md:px-8 px-4 grid gap-4 lg:grid-cols-2 mt-4 grid-cols-1">
      <div className="bg-white rounded-lg md:p-4 p-2 flex flex-col shadow-lg shadow-gray-200/40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-black">
            Project Statistics
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-sm bg-blue-600" />
              <span className="text-sm text-blue-600">Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-sm bg-yellow-500" />
              <span className="text-sm text-yellow-500">Completed</span>
            </div>
          </div>
        </div>
        <div className="w-full mt-2">
          <ResponsiveContainer width="100%" aspect="2">
            <LineChart
              width={500}
              height={200}
              data={projectStateData}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis dataKey="name" tick={{ fontSize: "12px" }} />
              <YAxis tick={{ fontSize: "12px" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ongoing"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#ffcc00"
                fill="#ffcc00"
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-lg md:p-4 p-2 flex flex-col shadow-lg shadow-gray-200/40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-black">Project Category</h1>
          <div className="flex items-center cursor-pointer hover:bg-gray-200/20 p-1">
            <select
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {currentUser?.clientIndustry?.includes(
                "Drone Service Provider"
              ) && (
                <option
                  value="Industry"
                  className="bg-white hover:bg-indigo-500 hover:text-white"
                >
                  Industry
                </option>
              )}
              <option
                value="Application"
                className="bg-white hover:bg-indigo-500 hover:text-white"
              >
                Application
              </option>
            </select>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {selectedField === "Industry" ? (
            <div className="flex flex-col justify-center w-full px-2 py-3 gap-2">
              {currentIndustries?.map((industry, k) => {
                if (industry.toLowerCase() === "Railway") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-blue-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">Railway</h1>
                      </div>
                    </div>
                  );
                } else if (industry.toLowerCase() === "roadway") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-green-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">Roadway</h1>
                      </div>
                    </div>
                  );
                } else if (industry.toLowerCase() === "mining") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-yellow-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">Mining</h1>
                      </div>
                    </div>
                  );
                } else if (industry.toLowerCase() === "construction") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-indigo-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">
                          Construction
                        </h1>
                      </div>
                    </div>
                  );
                } else if (industry.toLowerCase() === "tower") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-orange-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">
                          Wind turbines
                        </h1>
                      </div>
                    </div>
                  );
                } else if (industry.toLowerCase() === "solar") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-[#00ffff] `}
                        />
                        <h1 className="text-[13.4px]  text-black">Solar</h1>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <div className="flex flex-col justify-center w-full px-2 py-3 gap-2">
              {currentApplications?.map((application, k) => {
                if (application.toLowerCase() === "scouting") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-blue-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">Scouting</h1>
                      </div>
                    </div>
                  );
                } else if (application.toLowerCase() === "survey") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-green-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">Survey</h1>
                      </div>
                    </div>
                  );
                } else if (application?.toLowerCase() === "monitoring") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-yellow-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">
                          Monitoring
                        </h1>
                      </div>
                    </div>
                  );
                } else if (application?.toLowerCase() === "inspection") {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-orange-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">
                          Inspection
                        </h1>
                      </div>
                    </div>
                  );
                } else if (application.toLowerCase().includes("solar")) {
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-[10px] w-[10px] rounded-sm bg-green-500 `}
                        />
                        <h1 className="text-[13.4px]  text-black">
                          Solar In House
                        </h1>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

          <div className="">
            <PieChart width={200} height={200}>
              <Pie
                data={
                  selectedField === "Industry" ? industryData : applicationData
                }
                innerRadius={55}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={0.5}
                dataKey="value"
              >
                {selectedField === "Industry"
                  ? industryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))
                  : applicationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}
