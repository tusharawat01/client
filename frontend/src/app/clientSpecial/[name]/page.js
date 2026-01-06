"use client";
import { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdPerson, MdFormatListBulleted } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import { BiLeftArrowAlt } from "react-icons/bi";
import { RiSearch2Line } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../../atoms/userAtom";
import { HiOutlineLogout } from "react-icons/hi";
import { MdSettings } from "react-icons/md";
import {
  getTowerProject,
  getSolarProject,
  getProjectById,
  getProjectAccessRequestById,
} from "../../../utils/ApiRoutes";
import Link from "next/link";
import axios from "axios";
import MapComponent from "../../../components/ClientWindowComponents/MapComponent";
import ConstructionProjectCard from "../../../components/ClientWindowComponents/ConstructionProjectCard";
import TowerProjectCard from "../../../components/ClientWindowComponents/TowerProjectCard";
import SolarProjectCard from "../../../components/ClientWindowComponents/SolarProjectCard";
import CustomProjectCard from "../../../components/ClientWindowComponents/CustomProjectCard";
import WindmillProjectCard from "../../../components/ClientWindowComponents/WindmillProjectCard";
import MiningProjectCard from "../../../components/ClientWindowComponents/MiningProjectCard";
import RailwayProjectCard from "../../../components/ClientWindowComponents/RailwayProjectCard";
import ProjectSelectCard from "../../../components/ClientWindowComponents/ProjectSelectCard";
import ProjectRequestCard from "../../../components/ClientWindowComponents/ProjectRequestCard";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function Home() {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [openProfileOptions, setOpenProfileOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentTab, setCurrentTab] = useState("list");
  const [towerProjects, setTowerProjects] = useState([]);
  const [solarProjects, setSolarProjects] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);
  const [constructionProjects, setConstructionProjects] = useState([]);
  const [miningProjects, setMiningProjects] = useState([]);
  const [windmillProjects, setWindmillProjects] = useState([]);
  const [railwayProjects, setRailwayProjects] = useState([]);
  const [customProjects, setCustomProjects] = useState([]);
  const [mainTab, setMainTab] = useState("all");
  const [filteredProjectTabs, setFilteredProjectTabs] = useState([]);
  const [allProjectTabs, setAllProjectTabs] = useState([
    {
      name: "Solar",
      tag: "solar",
      image:
        "https://th.bing.com/th/id/OIP.arWeRZ3EebOBk_CrMsQRgAHaE0?rs=1&pid=ImgDetMain",
    },
    {
      name: "Windmill",
      tag: "windmill",
      image:
        "https://images.pexels.com/photos/18340044/pexels-photo-18340044/free-photo-of-wind-towers-against-sunset-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Towers",
      tag: "tower",
      image:
        "https://images.pexels.com/photos/414967/pexels-photo-414967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Railway",
      tag: "railway",
      image:
        "https://images.pexels.com/photos/414967/pexels-photo-414967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Construction",
      tag: "construction",
      image:
        "https://images.pexels.com/photos/439416/pexels-photo-439416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Mining",
      tag: "mining",
      image: "https://ik.imagekit.io/d3kzbpbila/thejashari_lequSWdWr6",
    },
    {
      name: "Custum Industry",
      tag: "customRequest",
      image:
        "https://images.pexels.com/photos/439416/pexels-photo-439416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ]);

  const fetchConstructionProjects = async () => {
    const { data } = await axios.post(
      `${getProjectById}?industry=Construction`,
      {
        id: currentUser?.projectsId,
      }
    );
    if (data.status) {
      console.log(data);
      setConstructionProjects(data.project);
    }
  };
  const fetchRailwayProjects = async () => {
    const { data } = await axios.post(`${getProjectById}?industry=Railway`, {
      id: currentUser?.projectsId,
    });
    if (data.status) {
      console.log(data);
      setRailwayProjects(data.project);
    }
  };
  const fetchCustomProjects = async () => {
    const { data } = await axios.post(`${getProjectById}?industry=custom`, {
      id: currentUser?.projectsId,
    });
    if (data.status) {
      console.log(data);
      setCustomProjects(data.project);
    }
  };

  const fetchMiningProjects = async () => {
    const { data } = await axios.post(`${getProjectById}?industry=Mining`, {
      id: currentUser?.projectsId,
    });
    if (data.status) {
      console.log(data);
      setMiningProjects(data.project);
    }
  };

  const fetchWindmillProjects = async () => {
    const { data } = await axios.post(`${getProjectById}?industry=Windmill`, {
      id: currentUser?.projectsId,
    });
    if (data.status) {
      console.log(data);
      setWindmillProjects(data.project);
    }
  };

  const fetchTowerProjects = async () => {
    const { data } = await axios.post(getTowerProject, {
      id: [
        ...currentUser?.towerProjectsId,
        // ...currentUser?.solarProjectsId,
        // ...currentUser?.projectsId,
      ],
    });
    console.log(data);
    if (data?.status) {
      setTowerProjects(data?.tower);
    }
  };

  const fetchSolarProjects = async () => {
    const { data } = await axios.post(getSolarProject, {
      id: [
        ...currentUser?.solarProjectsId,
        // ...currentUser?.towerProjectsId,
        // ...currentUser?.projectsId,
      ],
    });
    console.log(data);
    if (data?.status) {
      setSolarProjects(data?.solar);
    }
  };

  useEffect(() => {
    console.log(mainTab);
    if (mainTab === "tower") {
      fetchTowerProjects();
    } else if (mainTab === "solar") {
      fetchSolarProjects();
    } else if (mainTab === "construction") {
      fetchConstructionProjects();
    } else if (mainTab === "mining") {
      fetchMiningProjects();
    } else if (mainTab == "windmill") {
      fetchWindmillProjects();
    } else if (mainTab == "railway") {
      fetchRailwayProjects();
    } else if (mainTab == "custom") {
      fetchCustomProjects();
    }
  }, [mainTab]);

  // const fetchProjectRequests = async (id) => {
  //   const auth = cookies.get("auth");
  //   const { data } = await axios.post(
  //     getProjectAccessRequestById,
  //     {
  //       id,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${auth}`,
  //       },
  //       withCredentials: true,
  //     }
  //   );
  //   if (data?.status) {
  //     setProjectRequests(data?.request);
  //   }
  // };

  // useEffect(() => {
  //   if (currentUser?.projectRequestsId?.length > 0) {
  //     fetchProjectRequests(currentUser?.projectRequestsId);
  //   }
  // }, [currentUser]);

  // useEffect(() => {
  //   setMainTab(
  //     currentUser?.clientIndustry?.[0]?.toLowerCase() ===
  //       "drone service provider"
  //       ? "all"
  //       : currentUser?.clientIndustry?.[0]?.toLowerCase()
  //   );
  //   setMainTab("all");
  // }, []);

  useEffect(() => {
    const industry = currentUser?.clientIndustry?.[0]?.toLowerCase();

    if (industry === "drone service provider") {
      setMainTab("all");
    } else if (
      [
        "solar",
        "tower",
        "construction",
        "mining",
        "railway",
        "windmill",
        "custom",
      ].includes(industry)
    ) {
      setMainTab(industry);
    }
  }, [currentUser]);

  useEffect(() => {
    if (mainTab === "all") {
      if (searchValue) {
        let projectTabs = [...allProjectTabs];
        const filtered = projectTabs?.filter((tab) => {
          if (tab?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()))
            return true;
          return false;
        });
        setFilteredProjectTabs(filtered);
      } else {
        setFilteredProjectTabs([]);
      }
    }
  }, [searchValue]);

  return (
    <main className="h-full w-full overflow-y-scroll">
      {mainTab !== "all" && currentTab === "list" && (
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
      {mainTab === "all" ? (
        <div className="max-w-[1100px] px-5 mt-[120px] py-2 mx-auto mt-2 ">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <h1 className="text-xl font-semibold text-gray-200">
              Select Project
            </h1>
            <div className="w-full h-[1px] bg-gray-600 rounded-full" />
            <div className=" flex items-center gap-10 mt-8 flex-wrap justify-center px-2 py-2">
              {searchValue && filteredProjectTabs?.length > 0
                ? filteredProjectTabs?.map((project, k) => (
                    <ProjectSelectCard
                      project={project}
                      key={k}
                      k={k}
                      mainTab={mainTab}
                      setMainTab={setMainTab}
                      currentUser={currentUser}
                    />
                  ))
                : allProjectTabs?.map((project, k) => (
                    <ProjectSelectCard
                      project={project}
                      key={k}
                      k={k}
                      mainTab={mainTab}
                      setMainTab={setMainTab}
                      currentUser={currentUser}
                    />
                  ))}
            </div>
          </div>
        </div>
      ) : mainTab === "tower" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Tower Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {towerProjects?.reverse()?.map((project, k) => (
                  <TowerProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : mainTab === "windmill" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Windmill Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {windmillProjects?.reverse()?.map((project, k) => (
                  <WindmillProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : mainTab === "railway" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Railway Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {railwayProjects?.reverse()?.map((project, k) => (
                  <RailwayProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : mainTab === "mining" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Mining Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {miningProjects?.reverse()?.map((project, k) => (
                  <MiningProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : mainTab === "custom" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Custom Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {customProjects?.reverse()?.map((project, k) => (
                  <CustomProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : mainTab === "construction" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Construction Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {constructionProjects?.reverse()?.map((project, k) => (
                  <ConstructionProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <MapComponent
            allProjects={constructionProjects}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        )
      ) : mainTab === "solar" ? (
        currentTab === "list" ? (
          <div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <BiLeftArrowAlt
                  onClick={() => setMainTab("all")}
                  className="h-7 w-7 cursor-pointer hover:bg-gray-800 text-white transition-all duration-200 p-[2px] rounded-md ease-in-out"
                />
                Solar Projects
              </h1>
              <div className="w-full h-[1px] bg-gray-600 rounded-full" />
              <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                {solarProjects?.reverse()?.map((project, k) => (
                  <SolarProjectCard
                    project={project}
                    key={k}
                    k={k}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                ))}
              </div>
              {/* {projectRequests?.length > 0 && (
                <>
                  <h1 className="text-xl font-semibold text-gray-200 mt-5 flex items-center gap-2">
                    Your Project Requests
                  </h1>
                  <div className="w-full h-[1px] bg-gray-600 my-2 rounded-full" />
                  <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
                    {projectRequests?.reverse()?.map((request, k) => (
                      <ProjectRequestCard request={request} key={k} k={k} />
                    ))}
                  </div>
                </>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )
      ) : (
        ""
      )}
      {currentTab === "list" && (
        <div
          className="fixed top-0 w-full px-5 flex items-center md:justify-start 
				justify-between py-3 bg-[#322F2F] z-30"
        >
          <div className="px-2 border-r-[1px] border-gray-600">
            <img
              src="https://ik.imagekit.io/d3kzbpbila/thejashari_2bCgxTpZB"
              alt=""
              className="w-[160px]"
            />
          </div>
          <div className="px-5 py-1 w-full">
            <div className="w-full border-[1px] rounded-full border-gray-500 flex items-center gap-2 px-3 focus-within:border-sky-600">
              <RiSearch2Line className="h-5 w-5 text-gray-200" />
              <input
                type="text"
                placeholder={`${
                  mainTab !== "all"
                    ? "Project name or location"
                    : "Search Sector Name"
                }`}
                className="w-full h-full py-2
							bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-400"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mainTab === "tower" ? (
              <Link href={`${currentUser.name}/newproject`}>
                <button
                  className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
							flex items-center gap-2"
                >
                  <AiOutlinePlusCircle className="h-5 w-5" />
                  New Tower
                </button>
              </Link>
            ) : mainTab === "solar" ? (
              <Link href={`${currentUser.name}/newproject`}>
                <button
                  className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
							flex items-center gap-2"
                >
                  <AiOutlinePlusCircle className="h-5 w-5" />
                  New Plant
                </button>
              </Link>
            ) : mainTab === "all" ? (
              <Link href={`${currentUser.name}/newproject`}>
                <button
                  className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
							flex items-center gap-2"
                >
                  <AiOutlinePlusCircle className="h-5 w-5" />
                  New Project
                </button>
              </Link>
            ) : (
              ""
            )}
            <MdPerson
              onClick={() => setOpenProfileOptions(!openProfileOptions)}
              className="h-8 w-8 text-gray-300 cursor-pointer"
            />
          </div>
        </div>
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
        <div className="px-3 py-2 group border-gray-500 border-gray-500 border-b-[1px] hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
          <h1 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 flex items-center gap-1">
            <MdSettings className="h-4 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
            Settings
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
