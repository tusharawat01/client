"use client";

import { useState, useEffect } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { TbDrone } from "react-icons/tb";
import {
  getClientFromOrganisation,
  updateOrganizationNameAndDescription,
} from "../../utils/ApiRoutes";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import { RiTeamFill } from "react-icons/ri";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });

export default function GeneralInfoTab({
  currentClient,
  setCurrentTab,
  setCurrentClient,
}) {
  const [numberOfClients, setNumberOfClients] = useState("");
  const [editDetails, setEditDetails] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");

  useEffect(() => {
    if (currentClient) {
      loadClients();
    }
    setOrganizationName(currentClient?.organizationName);
    setOrganizationDescription(currentClient?.organizationDescription);
  }, []);

  const loadClients = async () => {
    const organizationId = currentClient?.organizationId;
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getClientFromOrganisation,
      {
        organizationId,
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data?.status) {
      setNumberOfClients(data?.clients?.length);
    }
  };

  const updateOrganizationDetails = async () => {
    const { data } = await axios.post(updateOrganizationNameAndDescription, {
      organizationName,
      organizationDescription,
      key: "bEG0KYcAOwUrPmMjupEyTe3NmfcZAQLde/8RK2XF9SDdn/jZ4gQZuIVDvY8SPOvs",
      id: currentClient._id,
    });
    if (data.status) {
      setCurrentClient(data?.user);
    } else {
      console.log(data?.status);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="grid md:grid-cols-3 grid-cols-2 gap-5 px-5 py-3">
        <div
          onClick={() => setCurrentTab("Clients")}
          className="rounded-lg px-4 py-3 gap-3 bg-indigo-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out"
        >
          <div className="flex items-center justify-center">
            <div
              className="m-auto rounded-full bg-gradient-to-b p-2 from-indigo-500 
						via-indigo-400 to-indigo-200"
            >
              <BsPeopleFill className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] leading-none font-semibold text-black">
              Clients
            </h1>
            <p className="text-sm leading-sm font- text-indigo-700 ">
              {numberOfClients} clients
            </p>
          </div>
        </div>
        <div className="rounded-lg px-4 py-3 gap-3 bg-yellow-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-center">
            <div
              className="m-auto rounded-full bg-gradient-to-b p-2 from-yellow-500 
						via-yellow-400 to-yellow-200"
            >
              <TbDrone className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] leading-none font-semibold text-black">
              Projects
            </h1>
            <p className="text-sm leading-sm font- text-yellow-700 ">
              0 projects
            </p>
          </div>
        </div>
        <div className="rounded-lg px-4 py-3 gap-3 bg-green-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-center">
            <div
              className="m-auto rounded-full bg-gradient-to-b p-2 from-green-500 
						via-green-400 to-green-200"
            >
              <RiTeamFill className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] leading-none font-semibold text-black">
              Team members
            </h1>
            <p className="text-sm leading-sm font- text-green-700 ">
              2 members
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full mt-5 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-[20px] w-[2.7px] rounded-md bg-blue-600" />
            <input
              className={`text-xl font-semibold text-black ${
                editDetails ? "" : "bg-transparent outline-none"
              } `}
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              id="nameInput"
              disabled={editDetails ? false : true}
            />
          </div>
          {editDetails ? (
            <button
              onClick={() => {
                setEditDetails(false);
                updateOrganizationDetails();
              }}
              className="px-5 py-2 rounded-lg border-[1px] bg-blue-600 text-white border-gray-200"
            >
              Save
            </button>
          ) : (
            <div
              onClick={() => {
                setEditDetails(true);
                document.getElementById("nameInput").focus();
              }}
              className="p-1 cursor-pointer rounded-md bg-indigo-100/40 hover:bg-indigo-100/80 
						transition-all duration-200 ease-in-out"
            >
              <AiFillEdit className="h-6 w-6 text-indigo-700" />
            </div>
          )}
        </div>
        <div className="h-[2px] bg-gray-700/80 rounded-md my-2 w-[98%]" />
        <p className="text-gray-400 mt-2 text-xs">About</p>
        <textarea
          className={`text-gray-800 mt-1 resize-none h-[300px] ${
            editDetails
              ? " border-[1px] border-gray-800"
              : "bg-transparent outline-none h-full"
          }  text-md`}
          value={organizationDescription}
          onChange={(e) => setOrganizationDescription(e.target.value)}
          disabled={editDetails ? false : true}
        />
      </div>
    </div>
  );
}
