"use client";
import { useState, useEffect } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdPerson } from "react-icons/md";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../../atoms/userAtom";
import { HiOutlineLogout } from "react-icons/hi";
import { MdFormatListBulleted } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import ProjectRequestCard from "../../../components/ClientWindowComponents/ProjectRequestCard";
import {
  getProjectById,
  getProjectAccessRequestById,
} from "../../../utils/ApiRoutes";
import axios from "axios";
import ClientProjectCard from "../../../components/ClientWindowComponents/ClientProjectCard";
import MapComponent from "../../../components/ClientWindowComponents/MapComponent";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [openProfileOptions, setOpenProfileOptions] = useState(false);
  const [currentTab, setCurrentTab] = useState("list");
  const [allProjects, setAllProjects] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);

  const fetchProjectRequests = async (id) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getProjectAccessRequestById,
      {
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data?.status) {
      setProjectRequests(data?.request);
    }
  };

  const fetchProjects = async (projectsId) => {
    const { data } = await axios.post(
      `${getProjectById}?industry=Construction`,
      {
        id: projectsId,
      }
    );
    if (data?.status) {
      setAllProjects(data?.project);
    }
  };

  useEffect(() => {
    if (currentUser?.projectsId?.length > 0) {
      fetchProjectRequests(currentUser?.projectRequestsId);
      fetchProjects(currentUser?.projectsId);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProjects(currentUser?.projectsId);
    fetchProjectRequests(currentUser?.projectRequestsId);
  }, []);

  return (
    <main className="h-full w-full bg-[#1f1f1f] overflow-y-auto">
      {currentTab === "list" && (
        <div
          className="fixed top-0 w-full px-5 flex items-center md:justify-start 
				justify-between py-3 bg-[#292929] z-30"
        >
          <div className="px-2 border-r-[1px] border-gray-600">
            <img
              src="https://aero2astro.com/home/assets/logos/logo_white.png"
              alt=""
              className="w-[100px]"
            />
          </div>
          <div className="px-5 py-1 w-full">
            <div className="w-full border-[1px] rounded-full border-gray-500 flex items-center gap-2 px-3 focus-within:border-sky-600">
              <RiSearch2Line className="h-5 w-5 text-gray-200" />
              <input
                type="text"
                placeholder="Project name"
                className="w-full h-full py-2
							bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-400"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
						flex items-center gap-2"
            >
              <AiOutlinePlusCircle className="h-5 w-5" />
              New project
            </button>
            <MdPerson
              onClick={() => setOpenProfileOptions(!openProfileOptions)}
              className="h-8 w-8 text-gray-300 cursor-pointer"
            />
          </div>
        </div>
      )}

      {currentTab === "list" && (
        <div className="w-full mt-[70px] flex items-center gap-1 justify-end px-4 py-3">
          <div
            onClick={() => setCurrentTab("list")}
            className={`flex items-center text-sm gap-2 p-2 cursor-pointer rounded-md font-semibold transition-all duration-200 ease-in-out
					hover:bg-gray-800 ${
            currentTab === "list"
              ? "text-gray-200 bg-gray-800"
              : "bg-gray-900/70 text-gray-400/80"
          } `}
          >
            <MdFormatListBulleted className="h-5 w-5" />
            List
          </div>

          <div
            onClick={() => setCurrentTab("map")}
            className={`flex items-center text-sm gap-2 p-2 cursor-pointer rounded-md font-semibold transition-all duration-200 ease-in-out
					hover:bg-gray-800 ${
            currentTab === "map"
              ? "text-gray-200 bg-gray-800"
              : "bg-gray-900/70 text-gray-400/80"
          } `}
          >
            <LuMapPin className="h-5 w-5" />
            Map
          </div>
        </div>
      )}

      {currentTab === "list" ? (
        <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-xl font-semibold text-gray-200">
              Construction Projects
            </h1>
            <div className="w-full h-[1px] bg-gray-600 rounded-full" />
            <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
              {allProjects?.map((project, k) => (
                <ClientProjectCard
                  project={project}
                  key={k}
                  k={k}
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                />
              ))}
            </div>
            {projectRequests?.length > 0 && (
              <>
                <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                  Your Project Requests
                </h1>
                <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                  {projectRequests?.map((request, k) => (
                    <ProjectRequestCard request={request} key={k} k={k} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <MapComponent
          allProjects={allProjects}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      )}

      <div
        className={`fixed ${
          openProfileOptions ? "right-3" : "-right-[100%]"
        } top-[70px] flex rounded-lg overflow-hidden 
			flex-col bg-gray-900 transition-all duration-200 ease-in-out `}
      >
        <div className="px-3 py-2 border-b-[1px] hover:bg-gray-800 transition-all duration-200 ease-in-out border-gray-500">
          <h1 className="text-sm font-semibold text-gray-200">
            Hi! {currentUser?.name}
          </h1>
        </div>
        <div className="px-3 py-2 group border-gray-500 hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
          <h1 className="text-sm font-semibold text-gray-200 group-hover:text-red-400 flex items-center gap-1">
            <HiOutlineLogout className="h-4 w-4" />
            Log out
          </h1>
        </div>
      </div>
    </main>
  );
}
