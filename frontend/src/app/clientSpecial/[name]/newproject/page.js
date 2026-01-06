"use client";

import { useState } from "react";
import { currentUserState } from "../../../../atoms/userAtom";
import { useRecoilState } from "recoil";
import { HiOutlineLogout } from "react-icons/hi";
import { RiSearch2Line } from "react-icons/ri";
import { MdPerson } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Link from "next/link";
import NewProjectForm from "@/components/NewProjectComponents/NewProjectForm";

export default function Home() {
  const [openProfileOptions, setOpenProfileOptions] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  return (
    <>
      <div
        className="w-full px-5 flex items-center md:justify-start 
			justify-between py-3 bg-[#292929] z-30"
      >
        <div className="px-2 border-r-[1px] border-gray-600">
          <img
            src="https://aero2astro.com/home/assets/logos/logo_white.png"
            alt=""
            className="w-[100px]"
          />
        </div>
        <div className="px-5 py-1 w-full"></div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
					flex items-center gap-2"
          >
            {currentUser?.name}
          </button>

          <MdPerson
            onClick={() => setOpenProfileOptions(!openProfileOptions)}
            className="h-8 w-8 text-gray-300 cursor-pointer"
          />
        </div>
      </div>
      <div
        className={`fixed ${
          openProfileOptions ? "right-3" : "-right-[100%]"
        } top-[70px] flex rounded-lg overflow-hidden 
			flex-col bg-gray-100 border-[1px] border-gray-300 transition-all duration-200 ease-in-out `}
      >
        <div className="px-3 py-2 border-b-[1px] hover:bg-gray-200 transition-all duration-200 ease-in-out border-gray-500">
          <h1 className="text-sm font-semibold text-gray-900">
            Hi! {currentUser?.name}
          </h1>
        </div>
        <div className="px-3 py-2 group border-gray-500 hover:bg-gray-200 transition-all cursor-pointer duration-200 ease-in-out">
          <h1 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 flex items-center gap-1">
            <HiOutlineLogout className="h-4 w-4" />
            Log out
          </h1>
        </div>
      </div>
      <NewProjectForm clientCreating="true" />
    </>
  );
}
