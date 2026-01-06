"use client";

import { useState, useEffect, useRef } from "react";
import ClientHeader from "../../../components/ClientDashboardComponents/ClientHeader";
import ImportantNotify from "../../../components/ClientDashboardComponents/ImportantNotify";
import ClientAddByClient from "../../../components/ClientDashboardComponents/ClientAddByClient";
import ClientCard from "../../../components/ClientDashboardComponents/ClientCard";
import { getClientFromOrganisation } from "../../../utils/ApiRoutes";
import axios from "axios";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../../atoms/userAtom";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });

export default function Home() {
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const getClientFromOrganisationFunc = async (organizationId) => {
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
      setAllTeamMembers(data.clients);
      let manager = data?.clients?.filter((client) => {
        if (client?.organizationRole?.includes("manager")) return true;
        return false;
      });
      let admin = data?.clients?.filter((client) => {
        if (client?.organizationRole?.includes("admin")) return true;
        return false;
      });
      let superAdmin = data?.clients?.filter((client) => {
        if (client?.organizationRole?.includes("superadmin")) return true;
        return false;
      });
      setManagers(manager);
      setAdmins(admin);
      setSuperAdmins(superAdmin);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getClientFromOrganisationFunc(currentUser?.organizationId);
    }
  }, [currentUser]);

  console.log(managers);
  return (
    <div className="w-full bg-gray-50 overflow-y-auto">
      <ToastContainer />
      <ClientHeader />
      <ClientAddByClient
        addClientOpen={openAddMembers}
        setAddClientOpen={setOpenAddMembers}
        clientIndustry={currentUser?.clientIndustry}
        organizationName={currentUser?.organizationName}
        organizationType={currentUser?.organizationType}
        organizationId={currentUser?.organizationId}
        loadClients={getClientFromOrganisationFunc}
        toast={toast}
        toastOptions={toastOptions}
      />
      <div className="md:px-5 px-2 py-5">
        <div className="flex items-center mt-2 gap-5 justify-between w-full">
          <h1 className="text-lg font-semibold text-black">Your Team</h1>
          <button
            onClick={() => {
              setOpenAddMembers(true);
            }}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 
					hover:bg-blue-500 cursor-pointer transition-all duration-200 ease-in-out
					flex items-center gap-2"
          >
            <AiOutlinePlusCircle className="h-5 w-5" />
            Add Members
          </button>
        </div>
        <div className="w-full h-[1px] my-3 bg-gray-300" />
        {managers?.length > 0 && (
          <div className="my-3">
            <h1 className="text-md font-semibold text-black">Managers</h1>
            <div className="grid mt-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
              {managers?.map((client, j) => (
                <ClientCard client={client} j={j} key={j} />
              ))}
            </div>
          </div>
        )}
        {admins?.length > 0 && (
          <div className="my-3">
            <h1 className="text-md font-semibold text-black">Admins</h1>
            <div className="grid mt-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
              {admins?.map((client, j) => (
                <ClientCard client={client} j={j} key={j} />
              ))}
            </div>
          </div>
        )}
        {superAdmins?.length > 0 && (
          <div className="my-3">
            <h1 className="text-md font-semibold text-black">Super Admins</h1>
            <div className="grid mt-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
              {superAdmins?.map((client, j) => (
                <ClientCard client={client} j={j} key={j} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
