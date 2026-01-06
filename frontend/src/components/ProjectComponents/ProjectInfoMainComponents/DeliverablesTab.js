"use client";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import {
  updateDeliverablesInProject,
  host,
  uploadModel,
  uploadObjModel,
} from "../../../utils/ApiRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import GeoServerTiffViewer from "./GeoServerTiffViewer";
import CesiumViewer from "./CesiumViewer";
import ReactPlayer from "react-player";

export default function DeliverablesTab({
  deliverablesRequested,
  project,
  setProject,
}) {
  // body...
  const [deliverables, setDeliverables] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDataTabOpen, setUploadDataTabOpen] = useState(false);
  const [date, setDate] = useState("");
  const [fileType, setFileType] = useState("");
  const [openGeoServerViewer, setOpenGeoServerViewer] = useState(false);
  const [currentStore, setCurrentStore] = useState("");
  const [fileName, setFileName] = useState("");
  const [openVideoPlayer, setOpenVideoPlayer] = useState(false);
  const [tempDeliverablesRequested, setTempDeliverablesRequested] = useState(
    []
  );
  const [openCesiumViewer, setOpenCesiumViewer] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [altitude, setAltitude] = useState("");
  const [scale, setScale] = useState("");
  const [mapBasedDeliverables, setMapBasedDeliverables] = useState([]);
  // const [metadata,setMetadata] = useState([]);

  useEffect(() => {
    setTempDeliverablesRequested([...deliverablesRequested, "video"]);
  }, [deliverablesRequested]);

  const handleFileChange = (e) => {
    if (e?.target?.files?.[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0]?.name);
    }
  };

  const handleFileChange2 = (e) => {
    if (e?.target?.files?.[0]) {
      if (
        e.target.files[0].name?.includes(".glb") ||
        e.target.files[0].name?.includes(".gltf") ||
        e.target.files[0].name?.includes(".zip")
      ) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0]?.name);
      }
    }
  };

  const saveToProject = async (store, metadata = {}) => {
    const newData = {
      fileName,
      workspace: project?._id,
      store,
      deliverableType: fileType,
      date,
      metadata,
    };
    const updatedDeliverables = [...project?.deliverables, newData];
    const { data } = await axios.post(
      `${updateDeliverablesInProject}?industry=${project?.industry}`,
      {
        id: project?._id,
        deliverables: updatedDeliverables,
      }
    );
    if (data?.status) {
      setUploading(false);
      setFileName("");
      setFile(null);
      setProject(data?.project);
    } else {
      alert("Cannot add the file to the project");
    }
  };

  function generateRandomId(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!file) {
      alert("Please select a glb or gltf file.");
      return;
    }

    if (fileType?.toLowerCase() === "3d model") {
      const formData = new FormData();
      formData.append("model", file);

      try {
        const xhr = new XMLHttpRequest();
        const uniqueId = await generateRandomId(10);

        const workspace = project._id;
        const fileNameWithExtension = file.name;
        const store = workspace + "-" + fileNameWithExtension;

        let backendUrl = "";
        if (fileNameWithExtension?.includes(".zip")) {
          backendUrl = `${uploadObjModel}?filename=${file?.name}&projectId=${project?._id}&tag=${uniqueId}`;
        } else {
          backendUrl = `${uploadModel}?filename=${file?.name}&projectId=${project?._id}&tag=${uniqueId}`;
        }

        xhr.open("POST", backendUrl, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploading(false);
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            saveToProject(response.url, response.coordinates);
            const metadata = {
              latitude,
              longitude,
              altitude,
              scale,
            };
            // saveToProject(response.url,response.coordinates);
            saveToProject(response.url, metadata);

            toast.success(fileType + "Uploaded Successfully!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            // alert('TIFF file uploaded successfully!');
          } else {
            toast.error(`Failed: ${xhr.responseText}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
            // alert('Error:',xhr.responseText);
            setUploading(false);
            console.error("Error:", xhr.responseText);
          }
        };

        xhr.onerror = () => {
          console.error("Error:", xhr);
          setUploading(false);
          alert("An error occurred while uploading the TIFF file.");
        };

        xhr.send(formData);
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while uploading the TIFF file.");
        setUploading(false);
      }
    } else {
      const workspace = project._id;
      const fileNameWithExtension = file.name;
      const store = workspace + "-" + fileNameWithExtension;
      const url = `http://localhost:8080/geoserver/rest/workspaces/${workspace}/coveragestores/${store}/file.geotiff?configure=first&recalculate=nativebbox,latlonbbox&coverageName=${store}`;

      try {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", url, true);
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa("admin:geoserver")
        );
        xhr.setRequestHeader("Content-Type", "image/tiff");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploading(false);
            saveToProject(store);
            toast.success(fileType + "Uploaded Successfully!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            // alert('TIFF file uploaded successfully!');
          } else {
            toast.error(`Failed: ${xhr.responseText}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
            // alert('Error:',xhr.responseText);
            setUploading(false);
            console.error("Error:", xhr.responseText);
          }
        };

        xhr.onerror = () => {
          console.error("Error:", xhr);
          setUploading(false);
          alert("An error occurred while uploading the TIFF file.");
        };

        xhr.send(file);
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while uploading the TIFF file.");
        setUploading(false);
      }
    }
  };

  const uploadFile = async () => {
    if (fileType?.toLowerCase() === "3d model") {
      if (
        file &&
        fileName.length > 2 &&
        date &&
        fileType.length > 0 &&
        latitude &&
        longitude &&
        altitude &&
        scale
      ) {
        setUploading(true);
        setUploadDataTabOpen(false);
        handleSubmit();
      }
    } else {
      if (file && fileName.length > 2 && date && fileType.length > 0) {
        setUploading(true);
        setUploadDataTabOpen(false);
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (project) {
      setFileType(project?.deliverablesRequired?.[0]);
      const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      setDate(getTodayDate());
      setDeliverables(project?.deliverables);
    }
  }, [project]);

  useEffect(() => {
    if (project?.deliverables?.length > 0) {
      let filteredDelivereables = project?.deliverables?.filter(
        (deliverable) => {
          if (
            deliverable?.deliverableType?.toLowerCase() !== "video" &&
            deliverable?.deliverableType?.toLowerCase() !== "3d model"
          ) {
            return true;
          }
          return false;
        }
      );
      if (filteredDelivereables?.length > 0) {
        setMapBasedDeliverables(filteredDelivereables);
      }
    }
  }, [project]);

  return (
    <div className="w-full">
      <ToastContainer />
      <div
        className={`fixed top-0 z-50 ${
          openVideoPlayer ? "left-0" : "-left-[100%]"
        } transition-all duration-200 
			ease-in-out bg-black/40 flex h-full w-full items-center justify-center flex flex-col`}
      >
        <div className="w-[500px] overflow-hidden rounded-lg border-[1px] border-gray-300 bg-white">
          <div className="px-4 py-2 flex items-center justify-between gap-4">
            <h1 className="text-md font-semibold text-gray-900">
              Video Player
            </h1>
            <div
              onClick={() => {
                setOpenVideoPlayer(false);
                setCurrentStore("");
              }}
              className="hover:bg-gray-200 rounded-full p-1 cursor-pointer transition-all duration-200 ease-in-out"
            >
              <RxCross2 className="h-5 w-5 text-gray-700" />
            </div>
          </div>
          <div className="w-full aspect-video">
            {openVideoPlayer && (
              <ReactPlayer
                url={`${host}${currentStore}`}
                id="video"
                onError={(error) => {
                  console.log(error);
                }}
                controls
                className="relative z-1"
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 z-50 ${
          uploadDataTabOpen ? "left-0" : "-left-[100%]"
        } bg-black/40 h-full w-full 
			transition-all px-4 py-3 duration-200 ease-in-out flex items-center justify-center`}
      >
        <div
          className="flex flex-col bg-white border-[1px] border-gray-300 rounded-lg overflow-hidden 
				w-[650px]"
        >
          <div className="px-4 py-2 border-b-[1px] gap-8 flex items-center justify-between border-gray-300">
            <h1 className="text-lg font-semibold text-black">Upload Data</h1>
            <div
              onClick={() => {
                setUploadDataTabOpen(false);
              }}
              className="p-1 cursor-pointer rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out"
            >
              <RxCross2 className="h-5 w-5 text-gray-700" />
            </div>
          </div>
          <div className="px-4 py-3 flex md:flex-row flex-col gap-3">
            <div className="flex gap-3 md:w-[50%] w-full flex-col">
              <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                File Name
              </h1>
              <div className="p-2 w-full border-[1px] border-gray-300 rounded-lg">
                <input
                  type="text"
                  className="w-full text-md text-gray-900 bg-transparent outline-none"
                  placeholder="File Name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 md:w-[50%] w-full flex-col">
              <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                Date
              </h1>
              <div className="p-2 w-full border-[1px] bg-gray-50 border-gray-300 rounded-lg">
                <input
                  type="date"
                  className="w-full text-md text-gray-900 bg-transparent outline-none"
                  placeholder=""
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-0 flex md:flex-row flex-col gap-3">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg text-black">File Type</h1>
              <div
                className="w-full bg-gray-50 rounded-lg border-[1px] hover:border-gray-400 
							border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                >
                  {deliverablesRequested?.map((deliverable, k) => (
                    <option key={k} value={deliverable}>
                      {deliverable}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="w-full px-4 py-3 pt-0 flex md:flex-row flex-col items-center gap-3">
            <input
              type="file"
              id="#file1"
              accept=".tif,.tiff"
              onChange={handleFileChange}
              hidden
            />
            <input
              type="file"
              id="#file2"
              accept=".glb,.gltf,.zip"
              onChange={handleFileChange2}
              hidden
            />
            <button
              onClick={() => {
                if (fileType?.toLowerCase() === "3d model") {
                  document.getElementById("#file2").click();
                } else {
                  document.getElementById("#file1").click();
                }
              }}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
            >
              {fileType?.toLowerCase() === "3d model"
                ? "Select File (ex.glb)"
                : "Select File (ex.tiff)"}
            </button>
            {file && (
              <h1 className="text-md font-semibold text-gray-800">
                Selected file :- {fileName}
              </h1>
            )}
          </div>
          {fileType?.toLowerCase() === "3d model" && (
            <>
              <div className="w-full px-4 py-3 pt-2 gap-3 flex md:flex-row flex-col">
                <div className="flex gap-3 md:w-[50%] w-full flex-col">
                  <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                    Latitude
                  </h1>
                  <div className="p-2 w-full border-[1px] border-gray-300 rounded-lg">
                    <input
                      type="text"
                      className="w-full text-md text-gray-900 bg-transparent outline-none"
                      placeholder="Enter lat"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 md:w-[50%] w-full flex-col">
                  <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                    Longitude
                  </h1>
                  <div className="p-2 w-full border-[1px] border-gray-300 rounded-lg">
                    <input
                      type="text"
                      className="w-full text-md text-gray-900 bg-transparent outline-none"
                      placeholder="Enter lon"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 py-3 pt-2 gap-3 flex md:flex-row flex-col">
                <div className="flex gap-3 md:w-[50%] w-full flex-col">
                  <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                    Altitude
                  </h1>
                  <div className="p-2 w-full border-[1px] border-gray-300 rounded-lg">
                    <input
                      type="text"
                      className="w-full text-md text-gray-900 bg-transparent outline-none"
                      placeholder="Enter alt"
                      value={altitude}
                      onChange={(e) => setAltitude(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 md:w-[50%] w-full flex-col">
                  <h1 className="p-0 m-0 flex items-center gap-3 leading-none text-md text-gray-800 font-semibold">
                    Scale
                  </h1>
                  <div className="p-2 w-full border-[1px] border-gray-300 rounded-lg">
                    <input
                      type="text"
                      className="w-full text-md text-gray-900 bg-transparent outline-none"
                      placeholder="Enter max. scale"
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="w-full px-4 py-3 pt-2">
            <button
              onClick={uploadFile}
              className="text-white bg-blue-600 hover:bg-blue-500 w-full py-2 
						rounded-lg w-full transition-all duration-200 ease-in-out"
            >
              Upload File
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-lg font-semibold text-black px-2">
        Deliverables requested
      </h1>
      <div className="w-full grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-3 px-2 mt-1">
        {deliverablesRequested?.map((deliverable, j) => (
          <div
            key={j}
            className="w-full rounded-lg border-[1px] px-3 cursor-pointer py-2 flex items-center justify-center 
					border-gray-300 bg-gray-100 hover:bg-gray-200 ease-in-out transition-all duration-200"
          >
            <h1 className="text-sm text-black">{deliverable}</h1>
          </div>
        ))}
      </div>
      <div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]" />
      {uploading && (
        <>
          <h1 className="text-md my-3 font-semibold text-gray-800 px-3">
            Uploading {fileName}, Date :- {date}
          </h1>
          <div className="h-2 rounded-full w-[98%] mx-auto my-3 bg-gray-200">
            <div
              className={`h-full rounded-full w-[${uploadProgress}%] bg-gradient-to-r  from-pink-500 via-red-500 to-violet-500`}
            />
          </div>
        </>
      )}
      <div className="w-full flex md:px-2 md:flex-row flex-col items-center justify-between">
        <h1 className="text-md font-semibold text-gray-800">
          Total Processed Date Avaiable - {project?.deliverables?.length}
        </h1>
        <div
          onClick={() => setUploadDataTabOpen(true)}
          className="rounded-lg border-[1px] px-7 cursor-pointer py-2 
				border-gray-300 bg-blue-600 hover:bg-blue-500 ease-in-out transition-all duration-200"
        >
          <h1 className="text-sm text-white">Upload Data</h1>
        </div>
      </div>

      {deliverables?.length > 0 ? (
        <div className="w-full md:px-2 px-0 py-3 flex-col flex">
          <h1 className="text-gray-900 text-lg font-semibold">
            Processed Date
          </h1>
          <div className="h-[1px] w-full my-3 bg-[#EBE8FF]" />
          {tempDeliverablesRequested?.map((deliverableReq, k) => (
            <div className="mb-6 flex flex-col gap-2" key={k}>
              <h1 className="text-md text-gray-800 capitalize">
                {deliverableReq}
              </h1>
              <div className="grid md:grid-cols-3 md:gap-4 gap-3 sm:grid-cols-2 grid-cols-1">
                {deliverables?.map((deliverable, j) => {
                  if (deliverable?.deliverableType === deliverableReq) {
                    return (
                      <div key={j}>
                        <div
                          className="rounded-lg shadow-md shadow-blue-600/30 overflow-hidden border-[1px] 
												border-gray-300 flex flex-col hover:shadow-blue-600/50 transition-all duration-100 ease-in-out"
                        >
                          <div className="flex items-center gap-5 justify-between px-2 py-2 border-b-[1px] border-gray-300">
                            <h1 className="text-md text-gray-800 break-all">
                              {deliverable?.fileName}
                            </h1>
                            <button
                              className="text-sm font-medium bg-red-600 hover:bg-red-500 
														text-white flex items-center gap-2 hover:gap-3 transition-all 
														duration-100 ease-in-out p-1 rounded-lg"
                            >
                              <AiOutlineDelete className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-col gap-2 px-2 py-2">
                            <h1 className="text-sm font-normal text-gray-700">
                              Date :- {deliverable?.date}
                            </h1>
                            {deliverable?.deliverableType?.toLowerCase() ===
                              "video" ||
                            deliverable?.deliverableType?.toLowerCase() ===
                              "3d model" ? (
                              <h1 className="text-sm font-normal break-all text-gray-700">
                                Url :- {deliverable?.store}
                              </h1>
                            ) : (
                              <h1 className="text-sm font-normal break-all text-gray-700">
                                Store :- {deliverable?.store}
                              </h1>
                            )}
                          </div>
                          <div className="px-2 py-3 pt-1">
                            <button
                              onClick={() => {
                                if (
                                  deliverable?.deliverableType?.toLowerCase() ===
                                  "video"
                                ) {
                                  setCurrentStore(deliverable?.store);
                                  setOpenVideoPlayer(true);
                                } else if (
                                  deliverable?.deliverableType?.toLowerCase() ===
                                  "3d model"
                                ) {
                                  setCurrentStore(deliverable?.store);
                                  // Open 3d viewer
                                  setOpenCesiumViewer(true);
                                } else {
                                  setCurrentStore(deliverable?.store);
                                  setOpenGeoServerViewer(true);
                                }
                              }}
                              className="text-sm w-full font-medium bg-blue-600 hover:bg-blue-500 
														text-white flex items-center justify-center gap-2 hover:gap-3 transition-all 
														duration-100 ease-in-out px-2 py-1 rounded-lg"
                            >
                              {deliverable?.deliverableType?.toLowerCase() ===
                              "video"
                                ? "Open"
                                : "View"}
                              <FaArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full px-5 py-3 flex-col flex items-center justify-center">
          <img
            src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8"
            alt=""
            className="h-[200px]"
          />
          <h1 className="text-gray-600 text-md font-normal">
            No deliverables are currently uploaded.
          </h1>
        </div>
      )}
      {openGeoServerViewer && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-in-out top-0 
				h-full w-full ${
          openGeoServerViewer ? "left-0" : "-left-[100%]"
        } bg-white rounded-lg 
				border-[1px] border-gray-700`}
        >
          <GeoServerTiffViewer
            store={currentStore}
            mapBasedDeliverables={mapBasedDeliverables}
            project={project}
            setProject={setProject}
            setOpenGeoServerViewer={setOpenGeoServerViewer}
          />
        </div>
      )}
      {openCesiumViewer && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-in-out top-0
				h-full w-full ${
          openCesiumViewer ? "left-0" : "-left-[100%]"
        } bg-white rounded-lg
				border-[1px] border-gray-700`}
        >
          <CesiumViewer
            currentStore={currentStore}
            setCurrentStore={setCurrentStore}
            setOpenCesiumViewer={setOpenCesiumViewer}
          />
        </div>
      )}
    </div>
  );
}
