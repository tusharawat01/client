"use client";

import { useRecoilState } from "recoil";
import { currentUserState, currentTabState } from "../../atoms/userAtom";
import { RiArrowDownSLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { updatePilotStatus } from "../../utils/ApiRoutes";
import axios from "axios";

export default function ClientHeader({ white }) {
  // body...
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [openStatusOpen, setOpenStatusOpen] = useState(false);
  const [currentTab, setCurrentTab] = useRecoilState(currentTabState);
  const [currentStatus, setCurrentStatus] = useState("Available");

  const statusOptions = ["Available", "Busy", "Away", "On-Site"];

  useEffect(() => {
    // console.log("User : ", currentUser);
    if (currentUser && currentUser?.status) {
      setCurrentStatus(currentUser?.status);
    }
  }, [currentUser]);

  const updateStatus = async (sts) => {
    setCurrentStatus(sts);
    const { data } = await axios.post(
      `${updatePilotStatus}/${currentUser?._id}`,
      {
        status: sts,
      }
    );
    console.log(data);
    if (data?.status) {
      setCurrentUser(data?.pilot);
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-between gap-3 shadow-md px-5 z-40 pt-3 pb-2 ${
        white && "bg-white"
      } `}
    >
      <div className="">
        <h1 className="text-lg font-semibold text-gray-800">{currentTab}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-md m-0 p-0 leading-none font-semibold text-black">
            {currentUser?.name}
          </span>
          <div className="flex items-center">
            <span
              onClick={() => setOpenStatusOpen(!openStatusOpen)}
              className="flex items-center text-xs gap-1 p-1 rounded-xl hover:bg-gray-200/70
					transition-all duration-200 ease-in-out cursor-pointer relative"
            >
              <div
                className={`absolute top-7 bg-white transition-all border-[1px] duration-200 ease-in-out
						border-gray-400 rounded-xl overflow-hidden ${
              openStatusOpen ? "block" : "hidden"
            } `}
              >
                {statusOptions.map((status, j) => (
                  <div
                    key={j}
                    onClick={() => {
                      updateStatus(status);
                      setOpenStatusOpen(false);
                    }}
                    className="px-2 py-1 hover:bg-gray-100 transition-all text-black duration-100 ease-in-out"
                  >
                    {status}
                  </div>
                ))}
              </div>
              <div
                className={`h-2 w-2 rounded-full ${
                  currentStatus === "Available"
                    ? "bg-green-500"
                    : currentStatus === "Busy"
                    ? "bg-red-500"
                    : currentStatus === "Away"
                    ? "bg-orange-400"
                    : "bg-sky-500"
                }`}
              />
              <span className="text-black">{currentStatus}</span>
              <RiArrowDownSLine
                className={`h-3 w-3 ml-1 text-gray-800 ${
                  openStatusOpen ? "rotate-180" : "rotate-0"
                } transition-all duration-200 ease-in-out`}
              />
            </span>
          </div>
        </div>
        <img src={currentUser?.image} className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
