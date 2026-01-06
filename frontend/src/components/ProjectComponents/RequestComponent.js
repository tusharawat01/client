"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HiLocationMarker, HiOutlineMail } from "react-icons/hi";
import { LiaIndustrySolid } from "react-icons/lia";
import {
  getProjectAccessRequest,
  getProjectAccessRequestById,
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
import KML from "ol/format/KML.js";
import Map from "ol/Map.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { add } from "ol/coordinate.js";
import * as olCoordinate from "ol/coordinate";
import MapCard from "./MapView/MapCard";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

const key = "yCsqOwmerwTFcuIuugTQ";
const attributions = " ";
let map;
let view = new View({
  center: [876970.8463461736, 5859807.853963373],
  projection: "EPSG:3857",
  controls: [],
  zoom: 10,
});

let vector = new VectorLayer({
  source: new VectorSource(),
});

export default function RequestComponent() {
  const [requests, setRequests] = useState([]);
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
  const [kmlLoaded, setKmlLoaded] = useState(false);
  const [currentKmlFile, setCurrentKmlFile] = useState("");
  const [kmlFiles, setKmlFiles] = useState([]);

  useEffect(() => {
    if (currentProject && currentProject?.kmlkmzFiles?.length > 0) {
      setKmlFiles(currentProject?.kmlkmzFiles);
    }
  }, [currentProject]);

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

  const fetchUserRequests = async (user) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getProjectAccessRequestById,
      {
        id: user?.projectRequestsId,
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data.status) {
      setRequests(data?.request);
    } else {
      console.log("Something went wrong!");
    }
  };

  const fetchUserAndUserRequests = async () => {
    if (currentUser) {
      const { data } = await axios.post(getUserById, {
        id: currentUser?._id,
      });
      if (data?.status) {
        setCurrentUser(data?.user);
        fetchUserRequests(data?.user);
      }
    }
  };

  useEffect(() => {
    fetchUserAndUserRequests();
  }, []);

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

  useEffect(() => {
    const raster = new TileLayer({
      source: new XYZ({
        url: "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ",
        maxZoom: 20,
      }),
    });

    map = new Map({
      layers: [raster, vector],
      target: document.getElementById(`map`),
      view: view,
      controls: [],
    });

    const displayFeatureInfo = function (pixel) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });

      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].values_.LOCATION);
        }
        // document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
        map.getTarget().style.cursor = "pointer";
      } else {
        // document.getElementById('info').innerHTML = '&nbsp;';
        map.getTarget().style.cursor = "";
      }
    };

    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    map.on("click", function (evt) {
      displayFeatureInfo(evt.pixel);
    });

    setTimeout(() => {
      changeTheView();
    }, 1000);
  }, [vector]);

  const changeTheView = async () => {
    const coord = [7.85, 47.983333];
    if (vector.getSource().getFeatures().length > 0) {
      view.animate(
        { zoom: 5, duration: 1000 },
        {
          duration: 3000,
          zoom: 0,
          center: vector
            .getSource()
            .getFeatures()[1]
            .getGeometry()
            .getCoordinates(),
        }
      );
    }
  };

  const addSourceToMap = async (kmlFile) => {
    // console.log(j)
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: kmlFile,
        format: new KML(),
      }),
    });

    await map.addLayer(vectorLayer);
    let kmlLoaded = false;
    vectorLayer.getSource().on("change", () => {
      const vectorSource = vectorLayer.getSource();
      if (vectorSource.getState() === "ready" && !kmlLoaded) {
        const extent = vectorSource.getExtent();
        // console.log(extent + ' ' + j)
        if (extent[0] === Infinity) {
          console.log(
            "Extent is invalid. KML data might not be loaded correctly."
          );
        } else {
          kmlLoaded = true;
          // console.log("im changing view" + j)
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            zoom: 0,
            duration: 1500,
          });
        }
      }
    });
  };

  useEffect(() => {
    if (kmlFiles.length > 0) {
      setCurrentKmlFile(kmlFiles[0]);
      setTimeout(() => {
        kmlFiles.forEach((kmlFile) => {
          addSourceToMap(kmlFile);
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (currentKmlFile) {
      addSourceToMap(currentKmlFile);
    }
  }, [currentKmlFile]);

  return (
    <div className="w-full flex items-center flex-wrap md:px-8 px-4 gap-3 overflow-x-auto scrollbar-none">
      <div
        className={`fixed flex items-center justify-center h-full w-full z-50 bg-white/30 
			${
        openDetailsTab ? "top-0 left-0" : "top-0 -left-[100%]"
      } transition-all duration-200 ease-in-out`}
      >
        {openPdfViewer && (
          <div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/30 top-0 left-0">
            <div
              className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
						border-[1px] border-gray-200/50 bg-white pt-3 pb-1 flex flex-col overflow-hidden"
            >
              <div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
                <div className="flex gap-5 w-full items-center">
                  <div
                    onClick={() => {
                      setOpenPdfViewer(false);
                      setViewPdfFile("");
                    }}
                    className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
                  >
                    <IoMdClose className="h-5 w-5 cursor-pointer text-black" />
                  </div>
                  <h1 className="text-xl select-none text-black font-semibold">
                    PDF viewer
                  </h1>
                </div>
              </div>
              <div className="h-full w-full overflow-hidden">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer fileUrl={viewPdfFile} />;
                </Worker>
              </div>
            </div>
          </div>
        )}
        {openImageViewer && (
          <div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/30 top-0 left-0">
            <div
              className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
						border-[1px] border-gray-200/50 bg-white pt-3 pb-1 flex flex-col"
            >
              <div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
                <div className="flex gap-5 w-full items-center">
                  <div
                    onClick={() => {
                      setOpenImageViewer(false);
                      setViewImageFile("");
                    }}
                    className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
                  >
                    <IoMdClose className="h-5 w-5 cursor-pointer text-black" />
                  </div>
                  <h1 className="text-xl select-none text-black font-semibold">
                    Image viewer
                  </h1>
                </div>
              </div>
              <div className="h-full overflow-hidden flex items-center p-2 w-full">
                <img
                  src={viewImageFile}
                  alt=""
                  className="w-full rounded-xl border-[1px] border-gray-800 max-h-full"
                />
              </div>
            </div>
          </div>
        )}
        {openVideoViewer && (
          <div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/30 top-0 left-0">
            <div
              className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
						border-[1px] border-gray-200/50 bg-white pt-3 pb-1 flex flex-col"
            >
              <div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
                <div className="flex gap-5 w-full items-center">
                  <div
                    onClick={() => {
                      setOpenVideoViewer(false);
                      setViewVideoFile("");
                    }}
                    className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
                  >
                    <IoMdClose className="h-5 w-5 cursor-pointer text-black" />
                  </div>
                  <h1 className="text-xl select-none text-black font-semibold">
                    Video viewer
                  </h1>
                </div>
              </div>
              <div className="h-full overflow-hidden flex items-center p-2 w-full">
                <video
                  src={viewVideoFile}
                  alt=""
                  controls
                  className="w-full rounded-xl border-[1px] border-gray-800 max-h-full"
                />
              </div>
            </div>
          </div>
        )}
        <div
          className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
				border-[1px] border-gray-200/50 bg-white overflow-hidden pt-2 pb-2 flex flex-col border-[1px] border-gray-400"
        >
          <div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
            <div className="flex gap-5 w-full items-center">
              <div
                onClick={() => {
                  setOpenDetailsTab(false);
                  setTimeout(() => {
                    setCurrentProject("");
                  }, 300);
                }}
                className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
              >
                <IoMdClose className="h-5 w-5 cursor-pointer text-black" />
              </div>
              <h1 className="text-xl select-none text-black font-semibold">
                {currentProject?.name}
              </h1>
            </div>
          </div>
          <div className="h-[1px] mt-2 bg-gray-300 w-full" />
          <div className="h-full w-full overflow-y-auto ">
            <div
              className="p-5 flex gap-5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
						shadow-lg"
            >
              <div className="flex flex-col items-center flex-1">
                <h1 className="text-2xl text-white">
                  {currentProject?.clientDetails?.organizationName}
                </h1>
                <div className="grid md:grid-cols-2 grid-cols-1 mt-6 w-full md:gap-0 gap-2">
                  <div className="flex flex-col items-center md:gap-5 gap-2 ">
                    <div className="flex items-center gap-1">
                      <BsFillPersonFill className="h-5 w-5 text-white" />
                      <p className="text-md text-white">
                        {currentProject?.clientDetails?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineMail className="h-5 w-5 text-white" />
                      <p className="text-md text-white">
                        {currentProject?.clientDetails?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:gap-5 gap-2 ">
                    <div className="flex items-center gap-1">
                      <LiaIndustrySolid className="h-5 w-5 text-white" />
                      <p className="text-md text-white">
                        {currentProject?.clientDetails?.clientIndustry?.map(
                          (ind, j) => (
                            <span key={j}>{ind} </span>
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdPeople className="h-5 w-5 text-white" />
                      <p className="text-md text-white">
                        {currentProject?.clientDetails?.organizationType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 flex flex-col">
              <h1 className="text-lg text-gray-800 mt-3">Project details</h1>
              <div className="h-[1px] w-[400px] mt-1 bg-gray-400" />
              <div className="flex gap-2 mt-2">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Location :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.projectLocation}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Project Type :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.type}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Start date :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.startDate}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Deadline :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.deadline}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Deliverables Required :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.deliverablesRequired?.map((deliver, j) => (
                    <span className="" key={j}>
                      {deliver}{" "}
                      {j + 1 === currentProject?.deliverablesRequired?.length
                        ? ""
                        : ","}{" "}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Industry :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.industry}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Scope :{" "}
                </span>
                <span className="text-md font-normal text-gray-800">
                  {currentProject?.scope}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-md font-bold text-gray-900 whitespace-nowrap">
                  Team members :{" "}
                </span>
                <div className="grid grid-cols-9 gap-2">
                  {currentProject?.teamMembers?.map((member, j) => (
                    <img
                      key={j}
                      src={member?.image}
                      className="w-full hover:scale-110 transition-all duration-200 
											cursor-pointer ease-in-out rounded-full aspect-square"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 items-end mt-2">
                <h1 className="text-md text-gray-900 font-bold">
                  KML/KMZ files ({currentProject?.kmlkmzFiles?.length})
                </h1>
                <a
                  href={`/openkmlinrequest/${currentProject?._id}`}
                  target="_blank"
                >
                  <h1 className="text-sky-500 hover:underline hover:cursor-pointer text-sm">
                    Open map
                  </h1>
                </a>
              </div>
              <div
                className="border-2 mt-2 border-sky-400 hover:border-sky-600 transition-all duration-200 
							ease-in-out border-dashed  aspect-video rounded-lg flex items-center 
							justify-center cursor-pointer overflow-hidden relative z-10"
              >
                <div className="h-full w-full">
                  <div
                    ref={mapboxRef}
                    id="map"
                    className="map-container w-full h-full relative z-50"
                  />
                </div>
              </div>
              <div className="mt-3 grid lg:grid-cols-6 md:grid-cols-5 grid-cols-4 gap-3 w-full">
                {kmlFiles.map((kmlFile, j) => (
                  <MapCard
                    key={j}
                    kml={kmlFile}
                    j={j}
                    currentKmlFile={currentKmlFile}
                    setCurrentKmlFile={setCurrentKmlFile}
                  />
                ))}
              </div>
              <div
                onClick={() => {
                  setOpenAttachmentsTab(!openAttachmentsTab);
                }}
                className="flex gap-1 items-center mt-2 cursor-pointer"
              >
                <FaChevronRight
                  className={`h-5 w-5 text-black ${
                    openAttachmentsTab ? "rotate-90" : "rotate-0"
                  } 
								transition-all duration-200 ease-in-out`}
                />
                <h1 className="text-lg text-gray-900">
                  Attachments ({currentProject?.attachments?.length})
                </h1>
              </div>
              <div
                className={`flex flex-col ${
                  openAttachmentsTab
                    ? "h-auto gap-2  mt-2 p-2 border-[1px]"
                    : "h-0"
                } overflow-hidden bg-gray-100 rounded-md transition-all ease-in-out duration-400 border-gray-400`}
              >
                {currentProject?.attachments?.map((name, j) => {
                  return (
                    <div
                      key={j}
                      className="w-full px-2 py-[6px] text-sm flex items-center justify-between gap-2 bg-white rounded-md border-[1px] border-gray-400"
                    >
                      <div className="flex items-center gap-1 break-all">
                        {" "}
                        <span className="">
                          {name.includes("pdf") ? (
                            <TbPdf className="h-5 w-5 text-gray-700" />
                          ) : name.includes(".png") ||
                            name.includes(".jpg") ||
                            name.includes(".jpeg") ||
                            name.includes(".gif") ||
                            name.includes(".bmp") ||
                            name.includes(".webp") ||
                            name.includes(".svg") ||
                            name.includes(".tiff") ? (
                            <BsImages className="h-5 w-5 text-gray-700 " />
                          ) : name.includes(".mp4") ||
                            name.includes(".avi") ||
                            name.includes(".mkv") ||
                            name.includes(".mov") ||
                            name.includes(".wmv") ||
                            name.includes(".flv") ||
                            name.includes(".webm") ||
                            name.includes(".m4v") ||
                            name.includes(".3gp") ? (
                            <BiSolidVideos className="h-5 w-5 text-gray-700" />
                          ) : name.includes(".shp") ? (
                            <BsFileEarmarkRuled className="h-5 w-5 text-gray-700" />
                          ) : name.includes(".dwg") ? (
                            <BsFileEarmarkRuled className="h-5 w-5 text-gray-700" />
                          ) : (
                            <BsFileEarmarkRuled className="h-5 w-5 text-gray-700" />
                          )}
                        </span>{" "}
                        {name
                          ?.split("/")
                          [name.split("/").length - 1].replace(/_/g, " ")}
                      </div>
                      <div className="gap-2 flex items-center">
                        <span
                          onClick={() => {
                            if (name.includes("pdf")) {
                              setViewPdfFile(currentProject?.attachments[j]);
                              setOpenPdfViewer(true);
                            } else if (
                              name.includes(".png") ||
                              name.includes(".jpg") ||
                              name.includes(".jpeg") ||
                              name.includes(".gif") ||
                              name.includes(".bmp") ||
                              name.includes(".webp") ||
                              name.includes(".svg") ||
                              name.includes(".tiff")
                            ) {
                              setOpenImageViewer(true);
                              setViewImageFile(currentProject?.attachments[j]);
                            } else if (
                              name.includes(".mp4") ||
                              name.includes(".avi") ||
                              name.includes(".mkv") ||
                              name.includes(".mov") ||
                              name.includes(".wmv") ||
                              name.includes(".flv") ||
                              name.includes(".webm") ||
                              name.includes(".m4v") ||
                              name.includes(".3gp")
                            ) {
                              setOpenVideoViewer(true);
                              setViewVideoFile(currentProject?.attachments[j]);
                            } else {
                            }
                          }}
                          className="text-sky-600 cursor-pointer hover:text-blue-700"
                        >
                          View
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className={`z-50 ${
                  showConfirmDelete ? "h-full w-full" : "h-0 w-0"
                } left-0 right-0 top-0 bottom-0 m-auto overflow-hidden 
							bg-white/60 fixed transition-all duration-200 ease-in-out flex items-center justify-center`}
              >
                <div className="w-[400px] flex gap-2 flex-col rounded-lg bg-white px-4 py-3 border-[1px] border-gray-300">
                  <h1 className="text-md text-gray-800">
                    Are you sure you need to delete the request
                  </h1>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button
                      disabled={deleteLoading}
                      onClick={() => setShowConfirmDelete(false)}
                      className="bg-transparent text-gray-600 px-4 py-2 text-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteThisRequestConfirm()}
                      className="bg-red-600 transition-all duration-200 ease-in-out px-4 py-2 text-white
										text-md rounded-lg"
                    >
                      {deleteLoading ? <span className="loader6" /> : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="">
                <button
                  onClick={() => {
                    deleteThisRequest();
                  }}
                  className="flex mt-3 items-center gap-1 bg-red-500 hover:bg-red-500 text-white 
								px-5 py-1 rounded-lg flex items-center justify-center"
                >
                  <span className="text-lg cursor-pointer font-normal">
                    Delete request
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {requests.map((req, j) => (
        <div
          key={j}
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
                req?.status === "Under review" ? "bg-yellow-500" : "bg-sky-600"
              }`}
            />
            {req.status}
          </div>
          <h1 className="text-sm font-normal mt-2 flex items-center gap-1 text-gray-800">
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
            <span
              onClick={() => {
                setCurrentProject(req);
                setOpenDetailsTab(true);
              }}
              className="hover:underline cursor-pointer"
            >
              More details
            </span>
          </h1>
        </div>
      ))}
    </div>
  );
}
