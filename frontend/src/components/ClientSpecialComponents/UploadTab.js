// "use client";

// import { useState, useEffect } from "react";
// import UploadDataComponent from "./UploadDataComponent";
// import ImageKit from "imagekit";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { RxCross2 } from "react-icons/rx";
// import {
//   createFolder,
//   updateFilesInFolder,
//   updateTowerProjectFolders,
//   getFoldersById,
//   updateFolders,
//   createFile,
//   getFilesByFolderId,
//   getVideoFoldersById,
//   createVideoFolder,
//   getFolderName,
//   uploadVideo,
// } from "../../utils/ApiRoutes";
// import { currentUserState } from "../../atoms/userAtom";
// import { useRecoilState } from "recoil";
// import FolderComponent from "./FolderComponent";
// import VideoFolderComponent from "./VideoFolderComponent";
// import axios from "axios";
// import { IoMdSearch } from "react-icons/io";
// import MapComponent2 from "./MapComponent2";
// import { TbChevronDown } from "react-icons/tb";
// import { BiImages } from "react-icons/bi";
// import { MdOutlineVideoLibrary } from "react-icons/md";

// let tempData = [];
// export default function UploadTab({
//   project,
//   setProject,
//   setCurrentTab,
//   setCloseHeader,
// }) {
//   const rawData = [];
//   const [openUploadTab, setOpenUploadTab] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadedFiles, setLoadedFiles] = useState([]);
//   const [askConfirm, setAskConfirm] = useState(false);
//   const [creatingFolder, setCreatingFolder] = useState(false);
//   const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
//   const [uploadedFolderData, setUploadedFolderData] = useState([]);
//   const [currentFolders, setCurrentFolders] = useState([]);
//   const [currentVideoFolders, setCurrentVideoFolders] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [filesUploading, setFilesUploading] = useState(false);
//   const [uploadingFileName, setUploadingFileName] = useState("");
//   const [uploadingFilesStarted, setUploadingFilesStarted] = useState(false);
//   const [uploadingFileNumber, setUploadingFileNumber] = useState(0);
//   const [uploadPercentage, setUploadPercentage] = useState(0);
//   const [showUploadingData, setShowUploadingData] = useState(false);
//   const [showMap, setShowMap] = useState(false);
//   const [showMarkers, setShowMarkers] = useState([]);
//   const [clearLoadedFiles, setClearLoadedFiles] = useState(false);
//   const [showFolderStatus, setShowFolderStatus] = useState("");
//   const [currentFileTab, setCurrentFileTab] = useState("image");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [videoSearchValue, setVideoSearchValue] = useState("");
//   const [videoSearchResults, setVideoSearchResults] = useState([]);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const imagekit = new ImageKit({
//     publicKey:
//       "public_EarkduisdArUSMPjjvLL3OdbPu0=" ||
//       process.env.NEXT_PUBLIC_IMAGEKIT_ID,
//     privateKey:
//       "private_/Q7BUNGt3H7K+CT7nV0hpBJLf4Y=" ||
//       process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
//     urlEndpoint:
//       "https://ik.imagekit.io/d3kzbpbila/x-bird/" ||
//       process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
//   });

//   function generateRandomId(length = 8) {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let randomId = "";

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomId += characters.charAt(randomIndex);
//     }

//     return randomId;
//   }

//   const getCurrentDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");
//     return `${day}-${month}-${year}`;
//   };

//   const loadFileWithFolderId = (folderId) => {
//     return new Promise((resolve) => {
//       let loadedFilesInFolderId = {};
//       for (let i = 0; i < loadedFiles?.length; i++) {
//         loadedFilesInFolderId[loadedFiles[i]?.file?.name] = folderId;
//         if (i + 1 === loadedFiles?.length) {
//           resolve(loadedFilesInFolderId);
//         }
//       }
//     });
//   };

//   const uploadWithoutFolderName = async () => {
//     const currdate = await getCurrentDate();
//     const number =
//       project?.folders?.length > 0 ? project?.folders?.length + 1 : "0";
//     const folderName = `FlightData-${number}`;
//     const folderId = await generateRandomId(10);
//     loadFileWithFolderId(folderId).then(async (loadedFilesInFolderId) => {
//       if (currentFileTab === "image") {
//         const { data } = await axios.post(createFolder, {
//           name: folderName,
//           folderCreatedDate: currdate,
//           projectId: project?._id,
//           folderId,
//           userDetails: {
//             name: currentUser?.name,
//             _id: currentUser?._id,
//             image: currentUser?.image,
//           },
//         });
//         if (data?.status) {
//           const foldersData = [data?.folder];
//           foldersCreated(foldersData, loadedFilesInFolderId);
//         } else {
//           alert("Something went wrong! could not create space for files!");
//         }
//       } else {
//         const { data } = await axios.post(createVideoFolder, {
//           name: folderName,
//           folderCreatedDate: currdate,
//           projectId: project?._id,
//           folderId,
//           userDetails: {
//             name: currentUser?.name,
//             _id: currentUser?._id,
//             image: currentUser?.image,
//           },
//         });
//         if (data?.status) {
//           const foldersData = [data?.folder];
//           foldersCreated(foldersData, loadedFilesInFolderId);
//         } else {
//           alert("Something went wrong! could not create space for files!");
//         }
//       }
//     });
//     // const loadedFilesInFolderId = await loadFileWithFolderId(folderId);
//   };

//   const foldersCreated = async (foldersCreatedData, loadedFilesInFolderId) => {
//     const foldersId = foldersCreatedData?.map(
//       (folderData) => folderData?.folderId
//     );
//     if (project?.folders) {
//       const folders = [...project?.folders, ...foldersId];
//       const { data } = await axios.post(
//         `${updateFolders}?industry=${project?.industry}`,
//         { folders, id: project?._id }
//       );
//       if (data?.status) {
//         setProject(data?.project);
//         startUploadingFiles(data?.project, loadedFilesInFolderId);
//         setCreatingFolder(false);
//         setAskConfirm(false);
//         setFilesUploading(true);
//       }
//     }
//   };

//   const uploadWithFolderNames = async (
//     folderNames,
//     i,
//     loadedFilesInFolderId
//   ) => {
//     const currdate = await getCurrentDate();
//     const { data } = await axios.post(createFolder, {
//       name: folderNames[i].folderName,
//       folderCreatedDate: currdate,
//       projectId: project?._id,
//       folderId: folderNames[i].folderId,
//       userDetails: {
//         name: currentUser?.name,
//         _id: currentUser?._id,
//         image: currentUser?.image,
//       },
//     });
//     if (data?.status) {
//       tempData = [...tempData, data?.folder];
//       if (i + 1 === folderNames?.length) {
//         setUploadedFolderData(tempData);
//         const foldersData = tempData;
//         foldersCreated(foldersData, loadedFilesInFolderId);
//         tempData = [];
//       } else {
//         uploadWithFolderNames(folderNames, i + 1, loadedFilesInFolderId);
//       }
//     } else {
//       alert("Something went wrong! could not create space for files!");
//     }
//   };

//   const startUploading = async () => {
//     let folderNames = [];
//     let loadedFilesInFolderId = {};
//     setCreatingFolder(true);
//     if (loadedFiles[0]?.file?.path) {
//       let folderId = "";
//       for (let i = 0; i < loadedFiles?.length; i++) {
//         if (
//           !folderNames.find(
//             (folder) =>
//               folder.folderName === loadedFiles[i]?.file?.path?.split("/")[1]
//           )
//         ) {
//           folderId = await generateRandomId(10);
//           folderNames = [
//             ...folderNames,
//             {
//               folderName: loadedFiles[i]?.file?.path?.split("/")[1],
//               folderId,
//             },
//           ];
//           loadedFilesInFolderId[loadedFiles[i].file.path] = folderId;
//         } else {
//           loadedFilesInFolderId[loadedFiles[i].file.path] = folderId;
//         }
//         if (i + 1 === loadedFiles?.length) {
//           uploadWithFolderNames(folderNames, 0, loadedFilesInFolderId);
//         }
//       }
//     } else {
//       uploadWithoutFolderName();
//     }
//   };

//   const fetchFolderAndSetStatus = async (folderId) => {
//     const { data } = await axios.post(getFoldersById, {
//       id: folderId,
//     });
//     if (data.status) {
//       setShowFolderStatus(data?.folder[0]?.name);
//     }
//   };

//   const uploadImage = async (
//     loadedFiles,
//     i,
//     loadedFilesInFolderId,
//     currproject
//   ) => {
//     setUploadingFileName(loadedFiles[i].file?.name);
//     setUploadingFileNumber(i + 1);
//     fetchFolderAndSetStatus(
//       loadedFiles[i]?.file?.path
//         ? loadedFilesInFolderId[loadedFiles[i]?.file?.path]
//         : loadedFilesInFolderId[loadedFiles[i]?.file?.name]
//     );
//     if (currentFileTab === "image") {
//       imagekit
//         .upload({
//           file: loadedFiles[i].base64, //required
//           fileName: loadedFiles[i]?.file?.name, //required
//           extensions: [
//             {
//               name: "google-auto-tagging",
//               maxTags: 5,
//               minConfidence: 95,
//             },
//           ],
//         })
//         .then((response) => {
//           uploadFileToDB(response.url, loadedFiles[i], loadedFilesInFolderId);
//           if (i + 1 === loadedFiles?.length) {
//             fetchFolders(currproject?.folders);
//             setLoadedFiles([]);
//             setClearLoadedFiles(true);
//             setUploadingFilesStarted(false);
//           } else {
//             uploadImage(loadedFiles, i + 1, loadedFilesInFolderId, currproject);
//           }
//         })
//         .catch((error) => {
//           console.log(error.message);
//         });
//     } else {
//       const formData = new FormData();
//       formData.append("video", loadedFiles[i]?.file);
//       console.log(loadedFiles, i, loadedFiles[i].file);
//       try {
//         const xhr = new XMLHttpRequest();
//         const uniqueId = await generateRandomId(10);
//         const backendUrl = `${uploadVideo}?filename=${loadedFiles[i]?.file?.name}&projectId=${project?._id}&tag=${uniqueId}`;
//         xhr.open("POST", backendUrl, true);

//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//             const percentComplete = Math.round(
//               (event.loaded / event.total) * 100
//             );
//             setUploadProgress(percentComplete);
//           }
//         };

//         xhr.onload = () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             const url = xhr.responseText;
//             uploadFileToDB(url, loadedFiles[i], loadedFilesInFolderId);
//             if (i + 1 === loadedFiles?.length) {
//               fetchFolders(currproject?.folders);
//               setLoadedFiles([]);
//               setClearLoadedFiles(true);
//               setUploadingFilesStarted(false);
//             } else {
//               uploadImage(
//                 loadedFiles,
//                 i + 1,
//                 loadedFilesInFolderId,
//                 currproject
//               );
//             }
//           } else {
//             alert(`Failed to upload file: ${xhr.responseText}`);
//           }
//         };

//         xhr.onerror = () => {
//           setUploadStatus("An error occurred while uploading the file.");
//         };

//         xhr.send(formData);
//       } catch (error) {
//         console.log(error);
//         setUploadStatus("An error occurred while uploading the file.");
//       }
//     }
//   };

//   const startUploadingFiles = async (currproject, loadedFilesInFolderId) => {
//     setUploadingFilesStarted(true);
//     setOpenUploadTab(false);
//     uploadImage(loadedFiles, 0, loadedFilesInFolderId, currproject);
//   };

//   const fetchFolders = async (foldersId) => {
//     const { data } = await axios.post(getFoldersById, {
//       id: foldersId,
//     });
//     if (data.status) {
//       setCurrentFolders(data?.folder);
//     }
//   };

//   const fetchVideoFolders = async (foldersId) => {
//     const { data } = await axios.post(getVideoFoldersById, {
//       id: foldersId,
//     });
//     if (data.status) {
//       setCurrentVideoFolders(data?.folder);
//     }
//   };

//   useEffect(() => {
//     if (project?.folders?.length > 0) {
//       fetchFolders(project?.folders);
//       fetchVideoFolders(project?.folders);
//     }
//   }, [project]);

//   useEffect(() => {
//     if (project) {
//       if (currentFileTab === "image") {
//         fetchFolders(project?.folders);
//       } else {
//         fetchVideoFolders(project?.folders);
//       }
//     }
//     if (loadedFiles?.length > 0) {
//       setLoadedFiles([]);
//     }
//   }, [currentFileTab]);

//   useEffect(() => {
//     if (searchValue) {
//       const searchFolder = async (val) => {
//         const result = currentFolders?.filter(
//           (folder) =>
//             folder?.name?.toLowerCase()?.includes(val) ||
//             folder?.userDetails?.name?.toLowerCase()?.includes(val) ||
//             folder?.folderCreatedDate?.toLowerCase()?.includes(val)
//         );
//         setSearchResults(result);
//       };
//       searchFolder(searchValue);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchValue]);

//   const uploadFileToDB = async (url, loadedFile, loadedFilesInFolderId) => {
//     const folderId = loadedFile?.file?.path
//       ? loadedFilesInFolderId[loadedFile?.file?.path]
//       : loadedFilesInFolderId[loadedFile?.file?.name];
//     const { data } = await axios.post(getFolderName, { folderId });

//     const tags = data?.status ? [data?.name] : [];
//     const tempdata = {
//       url,
//       name: loadedFile?.file?.name,
//       fileDat: loadedFile?.file,
//       exif_data: loadedFile?.exif_data,
//       folderId,
//       tags,
//     };
//     const data2 = await axios.post(createFile, tempdata);
//     if (data2?.data?.status) {
//       console.log("ok");
//     }
//   };

//   console.log(project?.folders);

//   useEffect(() => {
//     if (uploadingFileNumber) {
//       const percent = Math.round(
//         (uploadingFileNumber / loadedFiles?.length) * 100
//       );
//       setUploadPercentage(percent);
//     }
//   }, [uploadingFileNumber]);

//   return (
//     <div className="w-full pt-[100px] max-w-6xl mx-auto">
//       <ToastContainer />
//       <div
//         className={`${
//           openUploadTab
//             ? "w-full h-full md:p-10 p-1"
//             : "h-[0%] w-[0%] overflow-hidden"
//         } fixed inset-0
// 			bg-gray-800/50 flex items-center justify-center transition-all duration-200
// 			ease-in-out z-50`}
//       >
//         <div
//           className="bg-gray-900 rounded-md border-[1px] border-gray-700
// 				h-full w-full flex flex-col overflow-y-auto relative"
//         >
//           <div className="w-full absolute top-0 flex items-end bg-gray-900/80 overflow-x-scroll scrollbar-none">
//             <div
//               className="flex flex-col transition-all
// 						duration-200 ease-in-out w-full"
//             >
//               <div className="md:px-5 flex items-center gap-5 justify-between sm:px-4 px-2 py-2">
//                 <h1 className="sm:text-lg text-md whitespace-nowrap font-semibold text-gray-100 flex items-center gap-2">
//                   <div
//                     onClick={() => setOpenUploadTab(false)}
//                     className="p-1 hover:bg-gray-800 rounded-full transition-all duration-200 ease-in-out cursor-pointer"
//                   >
//                     <RxCross2 className="h-5 w-5 text-gray-300" />
//                   </div>
//                   Upload data
//                 </h1>
//                 {loadedFiles.length > 0 &&
//                 !loading &&
//                 !uploadingFilesStarted ? (
//                   <div className="flex items-center gap-3">
//                     <h1
//                       onClick={() => {
//                         if (
//                           loadedFiles.length > 0 &&
//                           !loading &&
//                           !uploadingFilesStarted
//                         )
//                           setClearLoadedFiles(true);
//                       }}
//                       className="sm:text-md text-sm whitespace-nowrap px-4 py-[5px] rounded-lg
// 										font-semibold text-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-800/50 cursor-pointer"
//                     >
//                       Clear
//                     </h1>
//                     <h1
//                       onClick={() => {
//                         if (
//                           loadedFiles.length > 0 &&
//                           !loading &&
//                           !uploadingFilesStarted
//                         )
//                           setAskConfirm(true);
//                       }}
//                       className="sm:text-md text-sm whitespace-nowrap px-4 py-[5px] rounded-lg
// 										font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
//                     >
//                       Confirm
//                     </h1>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => {
//                         setCurrentFileTab("image");
//                       }}
//                       className={`px-3 py-1 rounded-lg ${
//                         currentFileTab === "image"
//                           ? "bg-blue-600 hover:bg-blue-500"
//                           : " hover:bg-gray-700"
//                       } transition-all
// 										duration-200 ease-in-out text-white`}
//                     >
//                       Image
//                     </button>
//                     <button
//                       onClick={() => {
//                         setCurrentFileTab("video");
//                       }}
//                       className={`px-3 py-1 rounded-lg ${
//                         currentFileTab === "video"
//                           ? "bg-blue-600 hover:bg-blue-500"
//                           : " hover:bg-gray-700"
//                       } transition-all
// 										duration-200 ease-in-out text-white`}
//                     >
//                       Video
//                     </button>
//                     <button
//                       onClick={() => {
//                         setCurrentFileTab("3d model");
//                       }}
//                       className={`px-3 py-1 rounded-lg ${
//                         currentFileTab === "3d model"
//                           ? "bg-blue-600 hover:bg-blue-500"
//                           : " hover:bg-gray-700"
//                       } transition-all
// 										duration-200 ease-in-out text-white`}
//                     >
//                       3d Model
//                     </button>
//                     <button
//                       onClick={() => {
//                         setCurrentFileTab("pintcloud");
//                       }}
//                       className={`px-3 py-1 rounded-lg ${
//                         currentFileTab === "pointcloud"
//                           ? "bg-blue-600 hover:bg-blue-500"
//                           : " hover:bg-gray-700"
//                       } transition-all
// 										duration-200 ease-in-out text-white`}
//                     >
//                       Point cloud
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div
//                 className={`w-full h-[2px] transition-all duration-200
// 							ease-in-out bg-blue-500`}
//               />
//             </div>
//           </div>

//           <UploadDataComponent
//             loadedFiles={loadedFiles}
//             setLoadedFiles={setLoadedFiles}
//             loading={loading}
//             setLoading={setLoading}
//             clearLoadedFiles={clearLoadedFiles}
//             setClearLoadedFiles={setClearLoadedFiles}
//             currentFileTab={currentFileTab}
//           />
//         </div>
//       </div>

//       <div
//         className={`${
//           askConfirm ? "h-full w-full" : "h-[0%] w-[0%]"
//         } m-auto bottom-0 left-0 right-0 top-0 overflow-hidden fixed z-50
// 			bg-gray-800/70 flex items-center justify-center transition-all duration-200 ease-in-out`}
//       >
//         <div className="bg-[#212121] rounded-lg border-[1px] border-gray-700 md:w-[60%] w-[95%] flex flex-col">
//           <div className="w-full px-2 flex items-center gap-1 py-2">
//             <div
//               onClick={() => setAskConfirm(false)}
//               className="rounded-full p-1 flex items-center hover:bg-gray-800/50 cursor-pointer justify-center"
//             >
//               <RxCross2 className="h-5 w-5 text-gray-300" />
//             </div>
//             <h1 className="text-md font-semibold text-gray-100">
//               Upload Confirmation
//             </h1>
//           </div>
//           <div className="w-full h-[1px] bg-gray-700" />
//           <div className="flex flex-col gap-2 px-4 py-2">
//             <h1 className="text-md font-semibold text-gray-200">
//               Upload {loadedFiles?.length} files into the project -{" "}
//               {project?.name}
//             </h1>
//             <div className="flex items-center gap-2 justify-end">
//               <button
//                 onClick={() => setAskConfirm(false)}
//                 className="text-white px-4 py-2 rounded-lg hover:bg-gray-800/70
// 							transition-all duration-200 ease-in-out"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={startUploading}
//                 className={`px-4 ${
//                   creatingFolder ? "py-[6px]" : "py-2"
//                 } rounded-lg hover:bg-blue-600 bg-blue-500 text-white
// 							transition-all duration-200 ease-in-out`}
//               >
//                 {creatingFolder ? <span className="loader1" /> : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`flex fixed flex-col bg-white z-50 rounded-lg border-[1px] border-gray-300
// 			${
//         uploadingFilesStarted ? "" : "h-[0%] w-[0%] overflow-hidden"
//       } right-0 bottom-0`}
//       >
//         <div className="flex flex-col px-4 py-2 border-b-[1px] border-gray-200 ">
//           <div className="w-full  justify-between flex items-center ">
//             <h1 className="text-md font-semibold leading-none text-blue-600">
//               Uploading to {showFolderStatus}
//             </h1>
//             <div
//               onClick={() => setShowUploadingData(!showUploadingData)}
//               className="p-1 rounded-full hover:bg-gray-100 cursor-pointer flex items-center justify-center"
//             >
//               <TbChevronDown
//                 className={`h-5 w-5 ${
//                   showUploadingData ? "rotate-0" : "rotate-180"
//                 } transition-all duration-200
// 							ease-in-out text-gray-800`}
//               />
//             </div>
//           </div>
//           <h1 className="text-xs font-semibold leading-none mt-1 text-gray-500">
//             Dont refresh or change the tab while upload in progress
//           </h1>
//         </div>
//         <div
//           className={`w-full flex flex-col ${
//             showUploadingData ? "h-auto px-4 py-2" : "h-0 overflow-hidden"
//           } transition-all
// 				duration-200 ease-in-out`}
//         >
//           <h1 className="text-md font-semibold text-gray-800 flex items-center justify-between gap-5">
//             <span>
//               Uploading{" "}
//               <span className="text-blue-500">{uploadingFileName}</span> (
//               {uploadingFileNumber}/{loadedFiles?.length})
//             </span>
//             <span>{uploadPercentage}%</span>
//           </h1>
//           <div className="flex pb-1 items-center w-full mt-3">
//             <div className="rounded-full h-2 bg-gray-200 w-full overflow-hidden">
//               <div
//                 style={{
//                   width: `${uploadPercentage}%`,
//                 }}
//                 className={`h-full bg-gradient-to-r from-purple-500 to-pink-600
// 							rounded-full`}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-full flex sm:flex-row flex-col items-center gap-5 justify-between">
//         <h1 className="text-lg font-semibold text-white px-2">
//           Raw data files are uploaded here
//         </h1>
//         <button
//           onClick={() => setOpenUploadTab(true)}
//           className="px-5 py-1 bg-blue-500 text-white flex items-center gap-2 rounded-lg border-[1px] border-gray-700"
//         >
//           Upload
//         </button>
//       </div>
//       <div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]/60" />
//       {project?.folders?.length > 0 ? (
//         currentFolders?.length > 0 || currentVideoFolders?.length > 0 ? (
//           <>
//             <div className="w-full flex sm:flex-row flex-col items-center gap-5 justify-between pb-3">
//               <div className="flex items-center rounded-lg overflow-hidden ">
//                 <div
//                   onClick={() => setCurrentFileTab("image")}
//                   className={`p-1 ${
//                     currentFileTab === "image"
//                       ? "text-gray-100 bg-blue-500"
//                       : "text-gray-300 hover:bg-gray-800/80"
//                   } cursor-pointer transition-all
// 								duration-200 ease-in-out border-[1px] rounded-l-lg border-gray-300`}
//                 >
//                   <BiImages className="h-5 w-5" />
//                 </div>
//                 <div
//                   onClick={() => setCurrentFileTab("video")}
//                   className={`p-1 ${
//                     currentFileTab === "video"
//                       ? "text-gray-100 bg-blue-500"
//                       : "text-gray-300 hover:bg-gray-800/80"
//                   } cursor-pointer transition-all
// 								duration-200 ease-in-out border-[1px] border-l-[0px] rounded-r-lg border-gray-300`}
//                 >
//                   <MdOutlineVideoLibrary className="h-5 w-5" />
//                 </div>
//               </div>

//               <div className="flex items-center w-[350px] gap-1 p-1 px-2 rounded-lg border-[1px] border-gray-700 hover:border-sky-500 focus-within:border-sky-500">
//                 <IoMdSearch className="h-[18px] w-[18px] text-gray-200 peer-focus:text-blue-500 " />
//                 <input
//                   type="text"
//                   className="text-sm w-full peer text-gray-200 bg-transparent outline-none placeholder:text-gray-500"
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   placeholder="Search by name, date, username"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             <div className="w-full">
//               <div className="w-full">
//                 {currentFileTab === "image" ? (
//                   <table className="w-full border-[1px] border-gray-700 rounded-lg">
//                     <thead>
//                       <tr className="bg-gray-900 text-gray-100 border-b-[1px] border-gray-400">
//                         <td className="px-4 py-2 text-center">Folder Name</td>
//                         <td className="px-4 py-2 text-center">Upload Date</td>
//                         <td className="px-4 py-2 text-center">Uploaded By</td>
//                         <td className="px-4 py-2 text-center">
//                           Number of files
//                         </td>
//                         <td className="px-4 py-2 text-center">KML</td>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {!searchValue
//                         ? currentFolders?.map((folder, k) => (
//                             <FolderComponent
//                               folder={folder}
//                               key={k}
//                               k={k}
//                               uploadingFilesStarted={uploadingFilesStarted}
//                               showMarkers={showMarkers}
//                               setShowMarkers={setShowMarkers}
//                               setShowMap={setShowMap}
//                             />
//                           ))
//                         : searchResults?.map((folder, k) => (
//                             <FolderComponent
//                               folder={folder}
//                               key={k}
//                               k={k}
//                               uploadingFilesStarted={uploadingFilesStarted}
//                               showMarkers={showMarkers}
//                               setShowMarkers={setShowMarkers}
//                               setShowMap={setShowMap}
//                             />
//                           ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <table className="w-full border-[1px] border-gray-400">
//                     <thead>
//                       <tr className="bg-gray-900 text-gray-100 border-b-[1px] border-gray-400">
//                         <td className="px-4 py-2 text-center">Folder Name</td>
//                         <td className="px-4 py-2 text-center">Upload Date</td>
//                         <td className="px-4 py-2 text-center">Uploaded By</td>
//                         <td className="px-4 py-2 text-center">
//                           Number of files
//                         </td>
//                         <td className="px-4 py-2 text-center">Open</td>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {!videoSearchValue
//                         ? currentVideoFolders?.map((folder, k) => (
//                             <VideoFolderComponent
//                               folder={folder}
//                               key={k}
//                               k={k}
//                               project={project}
//                               setProject={setProject}
//                               setCurrentTab={setCurrentTab}
//                               setCloseHeader={setCloseHeader}
//                             />
//                           ))
//                         : videoSearchResults?.map((folder, k) => (
//                             <VideoFolderComponent
//                               folder={folder}
//                               key={k}
//                               k={k}
//                               project={project}
//                               setProject={setProject}
//                               setCurrentTab={setCurrentTab}
//                               setCloseHeader={setCloseHeader}
//                             />
//                           ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="w-full px-5 py-3 flex-col flex items-center justify-center">
//             <img
//               src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8"
//               alt=""
//               className="h-[200px]"
//             />
//             <h1 className="text-gray-600 text-md font-normal">Loading...</h1>
//           </div>
//         )
//       ) : (
//         <div className="w-full px-5 py-3 mt-5 flex-col flex items-center justify-center">
//           <img
//             src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8"
//             alt=""
//             className="h-[200px]"
//           />
//           <h1 className="text-gray-400 mt-3 text-md font-normal">
//             No raw data are currently uploaded.{" "}
//             <span
//               onClick={() => setOpenUploadTab(true)}
//               className="text-blue-500 hover:text-blue-600 cursor-pointer"
//             >
//               Upload
//             </span>{" "}
//           </h1>
//         </div>
//       )}
//       <MapComponent2
//         showMap={showMap}
//         setShowMap={setShowMap}
//         loadedFiles={showMarkers}
//         showMarkers={showMarkers}
//         setShowMarkers={setShowMarkers}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
// import UploadDataComponent from "./UploadDataComponent";
// import ImageKit from "imagekit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross2 } from "react-icons/rx";
import VideoPlayer from "./VideoPlayer";
import {
  updateDeliverablesInProject,
  host,
  upload,
  uploadModel,
  uploadObjModel,
  uploadPointCloudFile,
  viewPointCloudFile,
} from "../../utils/ApiRoutes";
import { FaArrowRight } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import GeoServerTiffViewer from "./GeoServerTiffViewer";
import CesiumViewer from "./CesiumViewer";
import { FaPlay } from "react-icons/fa";
import dynamic from "next/dynamic";
const PointcloudNavigator = dynamic(() => import("./PointCloudNavigator"), {
  ssr: false,
});

import { currentUserState } from "../../atoms/userAtom";
import { useRecoilState } from "recoil";
// import FolderComponent from "./FolderComponent";
// import VideoFolderComponent from "./VideoFolderComponent";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
// import MapComponent2 from "./MapComponent2";
import { TbChevronDown } from "react-icons/tb";
import { BiImages } from "react-icons/bi";
import { MdOutlineVideoLibrary } from "react-icons/md";

let tempData = [];
const GeoServerURL = process.env.NEXT_PUBLIC_GEOSERVER_URL;

const VideoThumbnail = ({ videoUrl, className = "", onClick }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateThumbnail();
  }, [videoUrl]);

  const generateThumbnail = () => {
    if (!videoUrl) return;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const timeout = setTimeout(() => {
      console.error("Thumbnail generation timeout");
      setLoading(false);
      setError(true);
    }, 10000);

    video.onloadedmetadata = () => {
      console.log("Video metadata loaded, duration:", video.duration);

      if (video.duration && video.duration > 0) {
        // Seek to 10% of video duration, max 5 seconds, min 1 second
        const seekTime = Math.min(Math.max(video.duration * 0.1, 1), 5);
        console.log("Seeking to:", seekTime);
        video.currentTime = seekTime;
      } else {
        // If duration is not available, try seeking to 1 second
        video.currentTime = 1;
      }
    };

    video.onseeked = () => {
      console.log("Video seeked successfully");
      clearTimeout(timeout);

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions with fallback values
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        canvas.width = width;
        canvas.height = height;

        console.log("Canvas dimensions:", width, "x", height);

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, width, height);

        // Convert to data URL with higher quality
        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.9);

        console.log("Thumbnail generated successfully");
        setThumbnail(thumbnailDataUrl);
        setLoading(false);

        // Clean up
        video.src = "";
        video.load();
      } catch (error) {
        console.error("Error generating thumbnail:", error);
        clearTimeout(timeout);
        setLoading(false);
        setError(true);
      }
    };

    video.onerror = (e) => {
      console.error("Video error:", e, video.error);
      clearTimeout(timeout);
      setLoading(false);
      setError(true);
    };

    video.onabort = () => {
      console.error("Video load aborted");
      clearTimeout(timeout);
      setLoading(false);
      setError(true);
    };

    // Add load event handler
    video.onloadstart = () => {
      console.log("Video load started");
    };

    video.oncanplay = () => {
      console.log("Video can start playing");
    };
    const fullVideoUrl = videoUrl.startsWith("http")
      ? videoUrl
      : `${host}${videoUrl}`;
    console.log("Loading video from URL:", fullVideoUrl);

    video.src = videoUrl;
    video.load();
  };

  if (loading) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gray-900 overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {thumbnail ? (
        <>
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <FaPlay className="h-6 w-6 text-gray-800 ml-1" />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <FaPlay className="h-8 w-8" />
            <span className="text-xs">No Preview</span>
          </div>
        </div>
      )}
    </div>
  );
};

const extractGeospatialCoordinates = async (file) => {
  try {
    const fileExtension = file.name.toLowerCase().split(".").pop();

    // For image files (JPEG, TIFF with EXIF)
    if (["jpg", "jpeg", "tif", "tiff"].includes(fileExtension)) {
      return await extractFromImageExif(file);
    }

    // For 3D model files
    if (["glb", "gltf"].includes(fileExtension)) {
      return await extractFromGLTF(file);
    }

    // For other geospatial files
    if (["kml", "kmz", "gpx"].includes(fileExtension)) {
      return await extractFromGeospatialFile(file);
    }

    return null;
  } catch (error) {
    console.warn("Could not extract coordinates from file:", error);
    return null;
  }
};

const extractFromGLTF = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let gltfData;

        if (file.name.toLowerCase().endsWith(".glb")) {
          // Parse GLB binary format
          const arrayBuffer = e.target.result;
          const dataView = new DataView(arrayBuffer);

          const magic = dataView.getUint32(0, true);
          if (magic !== 0x46546c67) {
            resolve(null);
            return;
          }

          const jsonChunkLength = dataView.getUint32(12, true);
          const jsonChunkType = dataView.getUint32(16, true);

          if (jsonChunkType === 0x4e4f534a) {
            const jsonBytes = new Uint8Array(arrayBuffer, 20, jsonChunkLength);
            const jsonString = new TextDecoder().decode(jsonBytes);
            gltfData = JSON.parse(jsonString);
          }
        } else {
          const text = e.target.result;
          gltfData = JSON.parse(text);
        }

        if (gltfData) {
          const coordinates = extractCoordinatesFromGLTF(gltfData);
          resolve(coordinates);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.warn("Error parsing GLTF:", error);
        resolve(null);
      }
    };

    if (file.name.toLowerCase().endsWith(".glb")) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

const extractCoordinatesFromGLTF = (gltfData) => {
  try {
    // Check for geospatial extensions
    if (gltfData.extensions) {
      if (gltfData.extensions.CESIUM_RTC) {
        const center = gltfData.extensions.CESIUM_RTC.center;
        if (center && center.length >= 3) {
          const coords = cartesianToGeographic(center[0], center[1], center[2]);
          return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: coords.altitude,
            source: "CESIUM_RTC",
          };
        }
      }
    }

    // Check extras for custom coordinate data
    if (gltfData.extras) {
      if (gltfData.extras.coordinates || gltfData.extras.location) {
        const coords = gltfData.extras.coordinates || gltfData.extras.location;
        if (coords.latitude && coords.longitude) {
          return {
            latitude: parseFloat(coords.latitude),
            longitude: parseFloat(coords.longitude),
            altitude: parseFloat(coords.altitude) || 0,
            source: "extras",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.warn("Error extracting coordinates from GLTF:", error);
    return null;
  }
};

const cartesianToGeographic = (x, y, z) => {
  const longitude = Math.atan2(y, x);
  const p = Math.sqrt(x * x + y * y);
  const latitude = Math.atan2(z, p * (1 - 0.00669437999014));
  const altitude = p / Math.cos(latitude) - 6378137.0;

  return {
    latitude: latitude * (180 / Math.PI),
    longitude: longitude * (180 / Math.PI),
    altitude: altitude,
  };
};

const extractFromGeospatialFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        let coordinates = null;

        // Parse KML
        if (text.includes("<kml") || text.includes("<?xml")) {
          const coordElements = xmlDoc.getElementsByTagName("coordinates");
          if (coordElements.length > 0) {
            const coordText = coordElements[0].textContent.trim();
            const coords = coordText.split(",");
            if (coords.length >= 2) {
              coordinates = {
                longitude: parseFloat(coords[0]),
                latitude: parseFloat(coords[1]),
                altitude: coords.length > 2 ? parseFloat(coords[2]) : 0,
                source: "KML",
              };
            }
          }
        }

        resolve(coordinates);
      } catch (error) {
        console.warn("Error parsing geospatial file:", error);
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};

export default function UploadTab({
  deliverablesRequested,
  project,
  setProject,
  setCurrentTab,
  setCloseHeader,
}) {
  const rawData = [];
  const [deliverables, setDeliverables] = useState([]);
  const [currentDeliverable, setCurrentDeliverable] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDataTabOpen, setUploadDataTabOpen] = useState(false);
  const [date, setDate] = useState("");
  const [fileType, setFileType] = useState("");
  const [openGeoServerViewer, setOpenGeoServerViewer] = useState(false);
  const [pointCloudNavigator, setPointCloudNavigator] = useState(false);
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
  const [extractingCoordinates, setExtractingCoordinates] = useState(false);
  const [coordinatesAutoFilled, setCoordinatesAutoFilled] = useState(false);

  //different
  const [openUploadTab, setOpenUploadTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [askConfirm, setAskConfirm] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [uploadedFolderData, setUploadedFolderData] = useState([]);
  const [currentFolders, setCurrentFolders] = useState([]);
  const [currentVideoFolders, setCurrentVideoFolders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filesUploading, setFilesUploading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [uploadingFilesStarted, setUploadingFilesStarted] = useState(false);
  const [uploadingFileNumber, setUploadingFileNumber] = useState(0);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showUploadingData, setShowUploadingData] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showMarkers, setShowMarkers] = useState([]);
  const [clearLoadedFiles, setClearLoadedFiles] = useState(false);
  const [showFolderStatus, setShowFolderStatus] = useState("");
  const [currentFileTab, setCurrentFileTab] = useState("image");
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [videoSearchValue, setVideoSearchValue] = useState("");
  const [videoSearchResults, setVideoSearchResults] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  // const imagekit = new ImageKit({
  //   publicKey:
  //     "public_EarkduisdArUSMPjjvLL3OdbPu0=" ||
  //     process.env.NEXT_PUBLIC_IMAGEKIT_ID,
  //   privateKey:
  //     "private_/Q7BUNGt3H7K+CT7nV0hpBJLf4Y=" ||
  //     process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
  //   urlEndpoint:
  //     "https://ik.imagekit.io/d3kzbpbila/x-bird/" ||
  //     process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
  // });

  // Modified file change handlers with coordinate extraction
  const handleFileChangeWithCoordinateExtraction = async (selectedFile) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setCoordinatesAutoFilled(false);
    // Only extract coordinates for 3D models and geospatial files
    const fileExtension = selectedFile.name.toLowerCase().split(".").pop();
    const geospatialExtensions = [
      "glb",
      "gltf",
      "tif",
      "tiff",
      "kml",
      "kmz",
      "gpx",
    ];

    if (geospatialExtensions.includes(fileExtension)) {
      setExtractingCoordinates(true);
      console.log("Extracting coordinates from file metadata...");

      try {
        const coordinates = await extractGeospatialCoordinates(selectedFile);

        if (coordinates) {
          console.log("Extracted coordinates:", coordinates);
          setLatitude(coordinates.latitude.toString());
          setLongitude(coordinates.longitude.toString());
          setAltitude(coordinates.altitude.toString());
          setCoordinatesAutoFilled(true);

          toast.success(
            `📍 Coordinates auto-extracted from ${coordinates.source}!`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } else {
          console.log("No coordinates found in file metadata");
          toast.info(
            "📍 No coordinates found in file metadata. Please enter manually.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
      } catch (error) {
        console.warn("Error extracting coordinates:", error);
        toast.warn(
          "⚠️ Could not extract coordinates from file. Please enter manually.",
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      } finally {
        setExtractingCoordinates(false);
      }
    }
  };

  useEffect(() => {
    setTempDeliverablesRequested([...deliverablesRequested, "video"]);
  }, [deliverablesRequested]);

  const handleFileChange = async (e) => {
    if (e?.target?.files?.[0]) {
      await handleFileChangeWithCoordinateExtraction(e.target.files[0]);
    }
  };

  const handleFileChange2 = async (e) => {
    if (e?.target?.files?.[0]) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = [
        ".glb",
        ".gltf",
        ".obj",
        ".tls",
        ".3mx",
        ".zip",
      ];

      if (
        allowedExtensions.some((ext) =>
          selectedFile.name.toLowerCase().includes(ext)
        )
      ) {
        await handleFileChangeWithCoordinateExtraction(selectedFile);
      }
    }
  };

  const handleVideoFileChange = async (e) => {
    if (e?.target?.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handlePointCloudFileChange = async (e) => {
    if (e?.target?.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
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
    // const updatedDeliverables = [...project?.deliverables, newData];
    const updatedDeliverables = [...(project?.deliverables || []), newData];
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

  const uploadVideo = async () => {
    if (!file) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("filename", fileName);
    formData.append("projectId", project?._id);

    try {
      const uniqueId = await generateRandomId(10);
      setUploading(true);
      const xhr = new XMLHttpRequest();

      let backendUrl = `${upload}?filename=${file?.name}&projectId=${project?._id}&tag=${uniqueId}`;

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
          const response = JSON.parse(xhr.responseText);
          console.log("Video upload response:", response);

          // Save video to project with the returned URL/path
          saveToProject(response.newFile.fileUrl);

          toast.success("Video uploaded successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(`Upload failed: ${xhr.responseText}`, {
            position: "top-right",
            autoClose: 3000,
          });
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        console.error("Video upload error:", xhr);
        setUploading(false);
        toast.error("An error occurred while uploading the video.", {
          position: "top-right",
          autoClose: 3000,
        });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Video upload error:", error);
      setUploading(false);
      toast.error("An error occurred while uploading the video.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const uploadPointCloud = async () => {
    if (!file) {
      alert("Please select a point cloud file.");
      return;
    }

    const formData = new FormData();
    formData.append("pointCloud", file);
    console.log("File sent : ", file);
    // formData.append("filename", fileName);
    // formData.append("projectId", project?._id);

    try {
      const uniqueId = await generateRandomId(10);
      setUploading(true);
      const xhr = new XMLHttpRequest();

      let backendUrl = `${uploadPointCloudFile}?filename=${file?.name}&projectId=${project?._id}&tag=${uniqueId}`;

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
          const response = JSON.parse(xhr.responseText);
          console.log("point cloud upload response:", response);

          // Save point cloud to project with the returned URL/path
          saveToProject(response.newFile.fileUrl);

          toast.success("Point cloud file uploaded successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(`Upload failed: ${xhr.responseText}`, {
            position: "top-right",
            autoClose: 3000,
          });
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        console.error("point cloud upload error:", xhr);
        setUploading(false);
        toast.error("An error occurred while uploading the point cloud.", {
          position: "top-right",
          autoClose: 3000,
        });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Point cloud upload error:", error);
      setUploading(false);
      toast.error("An error occurred while uploading the point cloud.", {
        position: "top-right",
        autoClose: 3000,
      });
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
    if (fileType?.toLowerCase() === "video") {
      await uploadVideo();
      return;
    }

    if (fileType?.toLowerCase() === "point cloud") {
      await uploadPointCloud();
      return;
    }

    if (!file) {
      alert("Please select file.");
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

            // saveToProject(response.url, response.coordinates);
            const metadata = {
              latitude,
              longitude,
              altitude,
              scale,
            };
            // saveToProject(response.url,response.coordinates);
            saveToProject(response.url, metadata);

            toast.success(fileType + "Uploaded Successfully!", {
              position: "top-right",
            });
            // alert('TIFF file uploaded successfully!');
          } else {
            toast.error(`Failed: ${xhr.responseText}`, {
              position: "top-right",
              autoClose: 2000,
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
      const fileNameWithExtension = file.name.replace(/\.[^/.]+$/, "");
      const store = workspace + "-" + fileNameWithExtension;
      const url = `${GeoServerURL}/geoserver/rest/workspaces/${workspace}/coveragestores/${store}/file.geotiff?configure=first&recalculate=nativebbox,latlonbbox&coverageName=${store}`;

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
              position: "top-right",
              autoClose: 2000,
            });
            // alert('TIFF file uploaded successfully!');
          } else {
            toast.error(`Failed: ${xhr.responseText}`, {
              position: "top-right",
              autoClose: 2000,
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
    if (fileType?.toLowerCase() === "video") {
      if (file && fileName.length > 2 && date) {
        setUploading(true);
        setUploadDataTabOpen(false);
        handleSubmit();
      } else {
        toast.error("Please fill in all required fields for video upload.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return;
    }
    if (fileType?.toLowerCase() === "point cloud") {
      if (file && fileName.length > 2 && date) {
        setUploading(true);
        setUploadDataTabOpen(false);
        handleSubmit();
      } else {
        toast.error(
          "Please fill in all required fields for point cloud file upload.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      return;
    }

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

  const playVideo = async (videoStore) => {
    try {
      setCurrentStore(videoStore);
      setOpenVideoPlayer(true);
      <VideoPlayer fileUrl={videoStore} />;
    } catch (error) {
      console.error("Error streaming video:", error);
      toast.error("Failed to load video stream", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const viewPointCloud = async (url) => {
    try {
      // Show loading state
      setPointCloudNavigator(false);

      // Step 1: Download file from Cloudinary
      console.log("Downloading file from Cloudinary...");
      const fileResponse = await fetch(url);

      if (!fileResponse.ok) {
        throw new Error(`Failed to download file: ${fileResponse.statusText}`);
      }

      const blob = await fileResponse.blob();
      console.log(`File downloaded. Size: ${blob.size} bytes`);

      // Step 2: Create FormData and send to backend
      const formData = new FormData();

      // Extract filename from URL or generate one
      const filename = url.split("/").pop().split("?")[0] + ".las";
      formData.append("file", blob, filename);
      formData.append("originalUrl", url);

      console.log("Sending file to backend for processing...");
      const response = await fetch(viewPointCloudFile, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to process point cloud file"
        );
      }

      if (!data.url) {
        throw new Error("No tileset URL returned from server");
      }

      setCurrentStore(data.url);
      setPointCloudNavigator(true);

      toast.success(data.message || "Point cloud loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error processing point cloud:", error);

      let errorMessage = "Failed to load point cloud";
      if (error.message.includes("download")) {
        errorMessage = "Failed to download file from Cloudinary";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error - please check your connection";
      } else if (error.message.includes("conversion")) {
        errorMessage = "File conversion failed - invalid point cloud format";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      setPointCloudNavigator(false);
    }
  };

  useEffect(() => {
    if (project) {
      setFileType(project?.deliverablesRequired?.[0]);
      const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
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
    <div className="w-full pt-[100px] max-w-7xl mx-auto bg-white min-h-screen">
      <ToastContainer />
      {extractingCoordinates && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="text-sm">Extracting coordinates...</span>
          </div>
        </div>
      )}
      <div
        className={`fixed top-0 z-50 ${
          openVideoPlayer ? "left-0" : "-left-[100%]"
        } transition-all duration-200 
			ease-in-out bg-black/40 flex h-full w-full items-center justify-center flex flex-col`}
      >
        <div className="w-[500px] overflow-hidden rounded-lg border-[1px] border-gray-300 bg-white">
          <div className="px-4 py-2 flex items-center justify-between gap-4">
            <h1 className="text-md font-semibold text-gray-900">
              Video Player - {fileName}
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
          <div className="w-full aspect-video bg-black">
            {openVideoPlayer && currentStore && (
              <VideoPlayer fileUrl={`${currentStore}`} />
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
								placeholder:text-gray-300"
                >
                  {fileType?.toLowerCase() === "video" ? (
                    <option value="video">video</option>
                  ) : (
                    deliverablesRequested?.map((deliverable, k) => (
                      <option key={k} value={deliverable}>
                        {deliverable}
                      </option>
                    ))
                  )}
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
              accept=".glb,.gltf,.zip,.obj,.tls,.3mx"
              onChange={handleFileChange2}
              hidden
            />

            <input
              type="file"
              id="#videoFile"
              accept=".mp4,.avi,.mov,.wmv,.flv,.webm,.mkv"
              onChange={handleVideoFileChange}
              hidden
            />
            <input
              type="file"
              id="#pointcloudFile"
              accept=" .dwg,
        .dxf,
        .dwf,
        .shp,
        .las,
        .laz"
              onChange={handlePointCloudFileChange}
              hidden
            />

            <button
              onClick={() => {
                if (fileType?.toLowerCase() === "video") {
                  document.getElementById("#videoFile").click();
                } else if (fileType?.toLowerCase() === "3d model") {
                  document.getElementById("#file2").click();
                } else if (fileType?.toLowerCase() === "point cloud") {
                  document.getElementById("#pointcloudFile").click();
                } else {
                  document.getElementById("#file1").click();
                }
              }}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
            >
              {fileType?.toLowerCase() === "video"
                ? "Select Video File"
                : fileType?.toLowerCase() === "3d model"
                ? "Select File (ex.glb)"
                : fileType?.toLowerCase() === "point cloud"
                ? "Select File (ex .las, .laz)"
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
                    {coordinatesAutoFilled && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Auto-filled
                      </span>
                    )}
                  </h1>
                  <div
                    className={`p-2 w-full border-[1px] border-gray-300 rounded-lg ${
                      coordinatesAutoFilled
                        ? "bg-green-50 border-green-300"
                        : ""
                    }`}
                  >
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
                    {coordinatesAutoFilled && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Auto-filled
                      </span>
                    )}
                  </h1>
                  <div
                    className={`p-2 w-full border-[1px] border-gray-300 rounded-lg ${
                      coordinatesAutoFilled
                        ? "bg-green-50 border-green-300"
                        : ""
                    }`}
                  >
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
                    {coordinatesAutoFilled && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Auto-filled
                      </span>
                    )}
                  </h1>
                  <div
                    className={`p-2 w-full border-[1px] border-gray-300 rounded-lg ${
                      coordinatesAutoFilled
                        ? "bg-green-50 border-green-300"
                        : ""
                    }`}
                  >
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
              disabled={extractingCoordinates}
              className="text-white bg-blue-600 hover:bg-blue-500 w-full py-2 
						rounded-lg w-full transition-all duration-200 ease-in-out disabled:bg-gray-400"
            >
              {extractingCoordinates ? "Processing file..." : "Upload File"}
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
                          {/* Enhanced thumbnail section for videos */}
                          {deliverable?.deliverableType?.toLowerCase() ===
                            "video" && (
                            <div className="relative">
                              <VideoPlayer
                                videoUrl={`${deliverable.store}`}
                                className="w-full h-48"
                              />
                              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                VIDEO
                              </div>
                            </div>
                          )}
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
                            {/* {deliverable?.deliverableType?.toLowerCase() ===
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
                            )} */}
                            {deliverable?.deliverableType?.toLowerCase() ===
                              "3d model" &&
                              deliverable?.metadata && (
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>
                                    📍 Lat: {deliverable.metadata.latitude}
                                  </div>
                                  <div>
                                    📍 Lon: {deliverable.metadata.longitude}
                                  </div>
                                  <div>
                                    📏 Alt: {deliverable.metadata.altitude}m
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="px-2 py-3 pt-1">
                            <button
                              onClick={() => {
                                if (!deliverable) return;
                                const type =
                                  deliverable.deliverableType
                                    ?.toLowerCase()
                                    .trim() || "";

                                setCurrentStore(deliverable.store);
                                setCurrentDeliverable(deliverable);
                                setFileName(deliverable.fileName);

                                if (type === "video") {
                                  playVideo(deliverable.store);
                                } else if (type === "3d model") {
                                  setOpenCesiumViewer(true);
                                } else if (type === "point cloud") {
                                  setPointCloudNavigator(true);
                                } else {
                                  setOpenGeoServerViewer(true);
                                }
                              }}
                              className="text-sm w-full font-medium bg-blue-600 hover:bg-blue-500 
             text-white flex items-center justify-center gap-2 hover:gap-3 transition-all 
             duration-100 ease-in-out px-2 py-2 rounded-lg"
                            >
                              {deliverable?.deliverableType
                                ?.toLowerCase()
                                .trim() === "video" ? (
                                <>
                                  <FaPlay className="h-3 w-3" />
                                  Play Video
                                </>
                              ) : (
                                <>
                                  View
                                  <FaArrowRight className="h-3 w-3" />
                                </>
                              )}
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
      {pointCloudNavigator && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-in-out top-0 
				h-full w-full ${
          pointCloudNavigator ? "left-0" : "-left-[100%]"
        } bg-white rounded-lg 
				border-[1px] border-gray-700`}
        >
          <PointcloudNavigator
            url={currentStore}
            // mapBasedDeliverables={mapBasedDeliverables}
            // project={project}
            // setProject={setProject}
            // setPointCloudNavigator={setPointCloudNavigator}
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
            currentDeliverable={currentDeliverable}
            setCurrentStore={setCurrentStore}
            setOpenCesiumViewer={setOpenCesiumViewer}
          />
        </div>
      )}
    </div>
  );
}
