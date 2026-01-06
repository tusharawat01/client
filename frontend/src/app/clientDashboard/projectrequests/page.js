"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../../atoms/userAtom";
import {
  getProjectAccessRequestById,
  deleteProjectRequest,
  updateProjectRequests,
} from "../../../utils/ApiRoutes";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
import { LiaIndustrySolid } from "react-icons/lia";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { TbMapPin2 } from "react-icons/tb";
import { GiDuration } from "react-icons/gi";
import { MdOutlineGroupWork, MdOutlineDateRange } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

const ClientHeader = dynamic(
  () => import("../../../components/ClientDashboardComponents/ClientHeader"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [requests, setRequests] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [availableStatus, setAvailableStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchProjectRequests = async (id) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getProjectAccessRequestById,
      { id: id },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data?.status) {
      setRequests(data?.request?.reverse());
      let sts = data?.request?.map((req) => req?.status);
      let uniqSts = [...new Set(sts)];
      setAvailableStatus(uniqSts);
      if (uniqSts?.length > 0) {
        setSelectedStatus(uniqSts[0]);
      }
    }
  };

  useEffect(() => {
    if (currentUser?.projectRequestsId) {
      fetchProjectRequests(currentUser?.projectRequestsId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (searchValue) {
      const filtered = requests?.filter((req) => {
        if (
          req?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
          req?.projectArea
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase()) ||
          req?.projectLocation
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase())
        )
          return true;
        return false;
      });
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests([]);
    }
  }, [searchValue]);

  const deleteThisRequest = async (id) => {
    let newArr = [...currentUser?.projectRequestsId];
    const idx = await newArr.findIndex((element) => {
      if (element === id) {
        return true;
      }
      return false;
    });
    // console.log(newArr,id,idx);
    if (idx > -1) {
      setDeleteLoading(true);
      newArr.splice(idx, 1);
      const auth = cookies.get("auth");
      const { data } = await axios.post(
        updateProjectRequests,
        {
          projectRequestsId: newArr,
          id: currentUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          withCredentials: true,
        }
      );
      if (data?.status) {
        setCurrentUser(data?.user);
        const data2 = await axios.post(deleteProjectRequest, {
          id: id,
        });
        if (data2.data.status) {
          setDeleteLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-full bg-gray-50 overflow-y-auto">
      <ClientHeader />
      {deleteLoading && (
        <div
          className="fixed top-0 left-0 h-full w-full flex items-center 
				justify-center p-5 flex-col gap-4 bg-black/60 z-50"
        >
          <span className="loader6" />
          <h1 className="my-2 text-white text-xl font-semibold">
            Deleting the request
          </h1>
        </div>
      )}
      <div className="md:px-10 px-4 py-3 mt-3">
        {/* <div className="flex items-center gap-4 justify-between">
          <h1 className="text-black text-lg">Your Project Requests</h1>
          {requests?.length > 0 ? (
            <div className="flex items-center px-2 py-1 rounded-lg border-[1px] gap-2 border-gray-400">
              <IoMdSearch className="h-4 w-4 text-gray-800" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                className="bg-transparent text-black outline-none w-[200px]"
                placeholder="Project Name / Location"
              />
            </div>
          ) : (
            currentUser?.projectRequestsId?.length < 1 && (
              <Link
                href={`/clientSpecial/${currentUser?.name?.replace(
                  " ",
                  ""
                )}/newproject`}
              >
                <button className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2">
                  <AiOutlinePlusCircle className="h-4 w-4" />
                  Create Project
                </button>
              </Link>
            )
          )}
        </div> */}

        <div className="flex items-center gap-4 justify-between">
          <h1 className="text-black text-lg">Your Project Requests</h1>

          <div className="flex items-center gap-3">
            {requests?.length > 0 && (
              <div className="flex items-center px-2 py-1 rounded-lg border-[1px] gap-2 border-gray-400">
                <IoMdSearch className="h-4 w-4 text-gray-800" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-transparent text-black outline-none w-[200px]"
                  placeholder="Project Name / Location"
                />
              </div>
            )}

            {currentUser?.projectRequestsId?.length < 5 && (
              <Link
                href={`/clientSpecial/${currentUser?.name?.replace(
                  " ",
                  ""
                )}/newproject`}
              >
                <button className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2">
                  <AiOutlinePlusCircle className="h-4 w-4" />
                  Create Project
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="w-[100%] bg-gray-300 h-[1px] my-2" />
        {availableStatus?.length > 0 && (
          <div className="flex items-center gap-2 mb-3 mt-2 flex-wrap w-full">
            {availableStatus?.map((sts, k) => (
              <div
                onClick={() => {
                  if (sts === selectedStatus) {
                    setSelectedStatus("");
                  } else {
                    setSelectedStatus(sts);
                  }
                }}
                key={k}
                className={`px-4 rounded-lg transition-all duration-200 ease-in-out text-sm 
								py-2 cursor-pointer border-[1px] border-gray-400 ${
                  selectedStatus === sts
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "text-black"
                }`}
              >
                {sts}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {filteredRequests?.length > 0 || searchValue
            ? filteredRequests?.map((request, k) => {
                if (!selectedStatus || request?.status === selectedStatus)
                  return (
                    <div
                      key={k}
                      className="border-[1px] hover:bg-gray-100 transition-all duration-200 ease-in-out 
								border-gray-700 hover:border-gray-500 flex flex-col rounded-lg"
                    >
                      <div className="flex items-center justify-between border-b-[1px] px-4 py-2 border-gray-700/70 gap-2">
                        <h1 className="text-md font-semibold text-gray-900">
                          {request?.name}
                        </h1>
                        <div
                          className="cursor-pointer transition-all duration-200 
										ease-in-out rounded-lg"
                        >
                          {/*Reserved for delete button*/}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 px-3 py-2">
                        <h1 className="flex items-center text-md text-black gap-1">
                          <MdOutlineGroupWork className="h-4 w-4" />
                          {request?.type}
                        </h1>

                        <h1 className="flex items-center text-md text-black gap-1">
                          <LiaIndustrySolid className="h-4 w-4" />
                          {request?.industry}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <MdOutlineDateRange className="h-4 w-4 text-gray-900" />
                          {request?.updatedAt?.split("T")?.[0]}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <GiDuration className="h-4 w-4" />
                          {request?.startDate} - {request?.deadline}
                        </h1>

                        <h1 className="flex items-center text-md text-black gap-1">
                          <IoLocationOutline className="h-4 w-4" />
                          {request?.projectLocation || request?.projectArea}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <TbMapPin2 className="h-4 w-4" />
                          {parseFloat(request?.coordinates?.latitude).toFixed(
                            5
                          )}
                          ,{" "}
                          {parseFloat(request?.coordinates?.longitude).toFixed(
                            5
                          )}
                        </h1>

                        <div className="flex md:flex-row flex-col gap-2 justify-around py-1">
                          <div className="flex flex-col gap-1 items-center">
                            <h1 className="text-sm text-gray-800">
                              Attachments
                            </h1>
                            <p className="text-md font-mono text-gray-700">
                              {request?.attachments?.length}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 items-center">
                            <h1 className="text-sm text-gray-800">KML / KMZ</h1>
                            <p className="text-md font-mono text-gray-700">
                              {request?.kmlkmzFiles?.length}
                            </p>
                          </div>
                        </div>

                        <h1 className="flex items-center text-sm text-gray-700 mt-1 gap-1">
                          {request?.scope}
                        </h1>

                        <div className="flex flex-col gap-2 mt-2 py-1">
                          <div className="w-full flex items-center justify-between">
                            <h1 className="leading-none text-sm font-mono text-gray-800">
                              Request Status
                            </h1>
                            <h1 className="leading-none text-sm font-mono text-gray-800">
                              {request?.status}
                            </h1>
                          </div>

                          <div className="w-full h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              style={{
                                width: `${
                                  request?.status?.toLowerCase() ===
                                  "under review"
                                    ? "20"
                                    : request?.status?.toLowerCase() ===
                                      "feasability study"
                                    ? "45"
                                    : request?.status?.toLowerCase() ===
                                      "client discussion"
                                    ? "75"
                                    : "90"
                                }%`,
                              }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
              })
            : requests?.map((request, k) => {
                if (!selectedStatus || request?.status === selectedStatus)
                  return (
                    <div
                      key={k}
                      className="border-[1px] hover:bg-gray-100 transition-all duration-200 ease-in-out 
								border-gray-700 hover:border-gray-500 flex flex-col rounded-lg"
                    >
                      <div className="flex items-center justify-between border-b-[1px] px-4 py-2 border-gray-700/70 gap-2">
                        <h1 className="text-md font-semibold text-gray-900">
                          {request?.name}
                        </h1>
                        <div
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want do delete the " +
                                  request?.name +
                                  " project request"
                              )
                            ) {
                              deleteThisRequest(request?._id);
                            }
                          }}
                          className="cursor-pointer hover:bg-red-600 bg-red-500 transition-all duration-200 
										ease-in-out p-1 rounded-lg"
                        >
                          {/*Reserved for delete button*/}
                          <AiOutlineDelete className="text-white h-4 w-4" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 px-3 py-2">
                        <h1 className="flex items-center text-md text-black gap-1">
                          <MdOutlineGroupWork className="h-4 w-4" />
                          {request?.type}
                        </h1>

                        <h1 className="flex items-center text-md text-black gap-1">
                          <LiaIndustrySolid className="h-4 w-4" />
                          {request?.industry}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <MdOutlineDateRange className="h-4 w-4 text-gray-900" />
                          {request?.updatedAt?.split("T")?.[0]}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <GiDuration className="h-4 w-4" />
                          {request?.startDate} - {request?.deadline}
                        </h1>

                        <h1 className="flex items-center text-md text-black gap-1">
                          <IoLocationOutline className="h-4 w-4" />
                          {request?.projectLocation || request?.projectArea}
                        </h1>

                        <h1 className="flex items-center text-sm text-black gap-1">
                          <TbMapPin2 className="h-4 w-4" />
                          {parseFloat(request?.coordinates?.latitude).toFixed(
                            5
                          )}
                          ,{" "}
                          {parseFloat(request?.coordinates?.longitude).toFixed(
                            5
                          )}
                        </h1>

                        <div className="flex md:flex-row flex-col gap-2 justify-around py-1">
                          <div className="flex flex-col gap-1 items-center">
                            <h1 className="text-sm text-gray-800">
                              Attachments
                            </h1>
                            <p className="text-md font-mono text-gray-700">
                              {request?.attachments?.length}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 items-center">
                            <h1 className="text-sm text-gray-800">KML / KMZ</h1>
                            <p className="text-md font-mono text-gray-700">
                              {request?.kmlkmzFiles?.length}
                            </p>
                          </div>
                        </div>

                        <h1 className="flex items-center text-sm text-gray-700 mt-1 gap-1">
                          {request?.scope}
                        </h1>

                        <div className="flex flex-col gap-2 mt-2 py-1">
                          <div className="w-full flex items-center justify-between">
                            <h1 className="leading-none text-sm font-mono text-gray-800">
                              Request Status
                            </h1>
                            <h1 className="leading-none text-sm font-mono text-gray-800">
                              {request?.status}
                            </h1>
                          </div>

                          <div className="w-full h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              style={{
                                width: `${
                                  request?.status?.toLowerCase() ===
                                  "under review"
                                    ? "20"
                                    : request?.status?.toLowerCase() ===
                                      "feasability study"
                                    ? "45"
                                    : request?.status?.toLowerCase() ===
                                      "client discussion"
                                    ? "75"
                                    : "90"
                                }%`,
                              }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
              })}
        </div>
        {currentUser?.projectRequestsId?.length < 1 && (
          <div className="w-full flex items-center justify-center h-[200px]">
            <h1 className="text-2xl font-semibold text-center text-gray-500">
              -- Nothing to see here --
            </h1>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
