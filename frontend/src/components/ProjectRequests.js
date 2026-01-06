"use client";
import Header from "./Header";
import { currentUserState, sideBarExtendState } from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import NewRequestComponent from "./ProjectRequestsComponents/NewRequestComponent";
import FeasabilityStudyComponent from "./ProjectRequestsComponents/FeasabilityStudyComponent";
import axios from "axios";
import { getProjectAccessRequest } from "../utils/ApiRoutes";
import ClientDiscussionComponent from "./ProjectRequestsComponents/ClientDiscussionComponent";
import FinalisedProjectComponent from "./ProjectRequestsComponents/FinalisedProjectComponent";

export default function ProjectRequests() {
  const [sideBarExtend, setSideBarExtend] = useRecoilState(sideBarExtendState);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [requests, setRequests] = useState([]);
  const [currentTab, setCurrentTab] = useState("Proposal received");

  const fetchAllRequests = async () => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(getProjectAccessRequest, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      withCredentials: true,
    });
    if (data.status) {
      setRequests(data.request);
    } else {
      console.log("Something went wrong!");
    }
  };
  useEffect(() => {
    fetchAllRequests();
  }, []);

  return (
    <main
      className={`h-full ${
        sideBarExtend ? "sm:w-[81%] xs:w-[86%] w-[100%]" : "w-[100%]"
      } transition-all duration-300 ease-in-out bg-gray-50 pb-5 overflow-y-auto`}
    >
      <Header />
      <div className="w-[97%] mx-auto bg-gray-300/70 h-[1px]" />
      <div className="w-full p-0 flex items-center border-b-[1px] border-gray-300 mb-3">
        <button
          onClick={() => {
            setCurrentTab("Proposal received");
          }}
          className="px-7 cursor-pointer text-black text-md hover:bg-gray-200/60 transition-all duration-200 ease-in-out"
        >
          <div className="relative py-2 pt-[10px]">
            Proposal received
            <div
              className={`${
                currentTab === "Proposal received" ? "w-[100%]" : "w-[0%]"
              } transition-all duration-200 
					ease-in-out absolute bottom-0 h-[2.5px] bg-blue-600`}
            />
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab("Feasability study");
          }}
          className="px-7 cursor-pointer text-black text-md hover:bg-gray-200/60 transition-all duration-200 ease-in-out"
        >
          <div className="relative py-2 pt-[10px]">
            Feasability Study
            <div
              className={`${
                currentTab === "Feasability study" ? "w-[100%]" : "w-[0%]"
              } transition-all duration-200 
					ease-in-out absolute bottom-0 h-[2.5px] bg-blue-600`}
            />
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab("Client discussion");
          }}
          className="px-7 cursor-pointer text-black text-md hover:bg-gray-200/60 transition-all duration-200 ease-in-out"
        >
          <div className="relative py-2 pt-[10px]">
            Client Discussion
            <div
              className={`${
                currentTab === "Client discussion" ? "w-[100%]" : "w-[0%]"
              } transition-all duration-200 
					ease-in-out absolute bottom-0 h-[2.5px] bg-blue-600`}
            />
          </div>
        </button>
        <button
          onClick={() => {
            setCurrentTab("Finalised projects");
          }}
          className="px-7 cursor-pointer text-black text-md hover:bg-gray-200/60 transition-all duration-200 ease-in-out"
        >
          <div className="relative py-2 pt-[10px]">
            Finalised Projects
            <div
              className={`${
                currentTab === "Finalised projects" ? "w-[100%]" : "w-[0%]"
              } transition-all duration-200 
					ease-in-out absolute bottom-0 h-[2.5px] bg-blue-600`}
            />
          </div>
        </button>
      </div>
      {currentTab === "Proposal received" ? (
        <NewRequestComponent requests={requests} />
      ) : currentTab === "Feasability study" ? (
        <FeasabilityStudyComponent requests={requests} />
      ) : currentTab === "Client discussion" ? (
        <ClientDiscussionComponent requests={requests} />
      ) : currentTab === "Finalised projects" ? (
        <FinalisedProjectComponent requests={requests} />
      ) : (
        ""
      )}
      <div className="w-[97%] mx-auto mt-3 bg-gray-300/70 h-[1px]" />
    </main>
  );
}
