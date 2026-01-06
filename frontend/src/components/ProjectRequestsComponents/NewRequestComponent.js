"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HiLocationMarker, HiOutlineMail } from "react-icons/hi";
import { LiaIndustrySolid } from "react-icons/lia";
import {
  getUserById,
  updateProjectRequests,
  deleteProjectRequest,
} from "../../utils/ApiRoutes";
import { AiOutlineCalendar, AiOutlineDelete } from "react-icons/ai";
import { FiCornerDownRight } from "react-icons/fi";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { IoMdClose } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { MdPeople } from "react-icons/md";
import { TbPdf } from "react-icons/tb";
import { BsImages, BsFileEarmarkRuled } from "react-icons/bs";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { BiSolidVideos } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../atoms/userAtom";
import Link from "next/link";
import { IoGitNetworkOutline } from "react-icons/io5";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });
var map;

export default function NewRequestComponent({ requests }) {
  const [currentProject, setCurrentProject] = useState("");
  const [openDetailsTab, setOpenDetailsTab] = useState(false);
  const [openAttachmentsTab, setOpenAttachmentsTab] = useState(false);
  const [viewPdfFile, setViewPdfFile] = useState("");
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [viewImageFile, setViewImageFile] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [openVideoViewer, setOpenVideoViewer] = useState(false);
  const [viewVideoFile, setViewVideoFile] = useState("");
  const mapboxRef = useRef(null);
  const [openKmlKmzTab, setOpenKmlKmzTab] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [notFound, setNotFound] = useState(false);
  const [currentIndustries, setCurrentIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    if (requests?.length > 0) {
      const idx = requests.findIndex(
        (req) => req.status.toLowerCase() === "under review"
      );
      const filteredRequests = requests.filter((req) => {
        if (req.status.toLowerCase() === "under review") return true;
        return false;
      });
      const industriesTemp = filteredRequests?.map((ind) => ind.industry);
      let industriesUniq = [...new Set(industriesTemp)];
      setCurrentIndustries(industriesUniq);
      if (industriesUniq?.length > 0) {
        setSelectedIndustry(industriesUniq?.[0]);
      }
      if (idx < 0) {
        setNotFound(true);
      }
    }
  }, [requests]);

  // useEffect(() => {
  // 	map = new mapboxgl.Map({
  // 		container: mapboxRef.current,
  // 		style: 'mapbox://styles/mapbox/streets-v12',
  // 		center: [lng, lat],
  // 		zoom: zoom
  // 	});
  // 	// var runLayer = omnivore.kml('https://ik.imagekit.io/d3kzbpbila/Code/XAI-CDN_TkzQsl2nHn')
  //     // .on('ready', function() {
  //     //     map.fitBounds(runLayer.getBounds());
  //     // })
  //     // .addTo(map);
  // 	// omnivore.kml('https://ik.imagekit.io/d3kzbpbila/Code/XAI-CDN_TkzQsl2nHn')
  // 	// console.log(omnivore.kml('test.geojson'))
  // 	// map.on('load',()=>{
  // 	// 	map.addSource('KMLdata',{
  // 	// 		type:"kml",
  // 	// 		data:"https://ik.imagekit.io/d3kzbpbila/Code/XAI-CDN_TkzQsl2nHn"
  // 	// 	})

  // 	// })
  // },[]);

  const deleteThisRequest = async () => {
    setShowConfirmDelete(true);
  };

  const deleteThisRequestConfirm = async () => {
    let newArr = [...currentUser?.projectRequestsId];
    const idx = await newArr.findIndex((element) => {
      if (element._id === currentProject._id) {
        return true;
      }
      return false;
    });
    if (idx) {
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
          id: currentProject._id,
        });
        if (data2.data.status) {
          setDeleteLoading(false);
          setShowConfirmDelete(false);
          setCurrentProject("");
          setOpenDetailsTab(false);
          fetchUserAndUserRequests();
        }
      }
    }
  };

  return (
    <>
      {!notFound && (
        <div className="mt-1 px-8 flex items-center gap-3 flex-wrap ">
          {currentIndustries?.map((industry, k) => (
            <div
              key={k}
              onClick={() => {
                if (selectedIndustry !== industry) {
                  setSelectedIndustry(industry);
                } else {
                  setSelectedIndustry("");
                }
              }}
              className={`px-2 py-1 ${
                selectedIndustry === industry
                  ? "bg-blue-600  text-white"
                  : "text-black border-gray-300"
              }
						border-[1px] cursor-pointer rounded-lg transition-all duration-200 ease-in-out`}
            >
              <h1 className="text-md px-5">{industry}</h1>
            </div>
          ))}

          <div className="w-[99%] mx-auto my-2 mt-1 h-[1px] bg-gray-300" />
        </div>
      )}
      <div className="w-full flex items-center flex-wrap md:px-8 px-4 gap-3 overflow-x-auto scrollbar-none">
        {requests?.reverse()?.map((req, j) => (
          <>
            {req.status === "Under review" &&
              (!selectedIndustry || req?.industry === selectedIndustry) && (
                <div
                  className="bg-white mt-5 flex lg:min-w-[32%] md:min-w-[48%] relative
						sm:min-w-[70%] sm:mx-0 mx-auto min-w-[95%] flex-col px-3 py-2 rounded-xl 
						border-[1px] border-gray-400 hover:bg-gray-50/10 transition-all duration-100 ease-in-out"
                >
                  <div
                    className="absolute border-[1px] border-gray-400 rounded-xl text-black text-sm 
							text-gray-800 left-3 -top-4 z-40 bg-white px-2 py-1"
                  >
                    {req?.type}
                  </div>
                  <div className="w-full mt-2">
                    <h1 className="text-lg font-semibold text-sky-600 leading-sm">
                      {req?.name}
                    </h1>
                  </div>
                  <div className="h-[1px] bg-gray-300 w-[80%]" />
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        req?.status === "Under review"
                          ? "bg-yellow-500"
                          : "bg-sky-600"
                      }`}
                    />
                    {req.status}
                  </div>
                  {/*<h1 className="text-sm font-normal mt-2 flex items-center gap-1 text-gray-800"><IoGitNetworkOutline className="h-4 w-4 text-gray-500"/>{req?.industry}</h1>*/}
                  <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800">
                    <LiaIndustrySolid className="h-4 w-4 text-gray-500" />
                    {req?.clientDetails?.organizationName}
                  </h1>
                  <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800">
                    <HiLocationMarker className="h-4 w-4 text-gray-500" />
                    {req?.projectLocation}
                  </h1>
                  <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800">
                    <AiOutlineCalendar className="h-4 w-4 text-gray-500" />
                    {req?.startDate} - {req?.deadline}
                  </h1>
                  <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-blue-600">
                    <FiCornerDownRight className="h-4 w-4" />
                    <Link
                      href={`/projectRequests/${req?._id}`}
                      className="hover:underline cursor-pointer"
                    >
                      View details
                    </Link>
                  </h1>
                </div>
              )}
          </>
        ))}
        {notFound && (
          <img
            className="w-[200px] my-10 m-auto"
            src="https://www.replaylistings.com/assets/images/result-not-found-1.png"
          />
        )}
      </div>
    </>
  );
}
