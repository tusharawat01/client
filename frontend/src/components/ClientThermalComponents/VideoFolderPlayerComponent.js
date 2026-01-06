"use client";
import { host, updateDeliverablesInProject } from "../../utils/ApiRoutes";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

export default function VideoFolderPlayerComponent({
  file,
  ReactPlayer,
  k,
  project,
  setProject,
  setOpenFolder,
  setCurrentTab,
  setCloseHeader,
}) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [deliverables, setDeliverables] = useState([]);
  const [date, setDate] = useState("");

  const addToDeliverables = async () => {
    let deliverables =
      project?.deliverables?.length > 0 ? [...project?.deliverables] : [];

    const idx = deliverables?.findIndex((deliverable) => {
      if (deliverable?.store === file?.url) return true;
      return false;
    });
    if (idx > -1) {
      alert("This video already exists in deliverables");
    } else {
      const newData = {
        fileName: file?.name,
        workspace: project?._id,
        store: file?.url,
        deliverableType: "video",
        date,
      };
      const updatedDeliverables = [...deliverables, newData];
      const { data } = await axios.post(
        `${updateDeliverablesInProject}?industry=${project?.industry}`,
        {
          id: project?._id,
          deliverables: updatedDeliverables,
        }
      );
      if (data?.status) {
        setProject(data?.project);
        setOpenFolder(false);
        setCurrentTab("processedData");
        setCloseHeader(true);
      } else {
        alert("Cannot add the file to the project");
      }
    }
  };

  const downloadVideo = () => {
    let currUrl = file?.url?.split("/compressed");
    currUrl = currUrl.join("");
    currUrl = currUrl?.split(".");
    currUrl.pop();
    currUrl = currUrl.join(".");
    const videoUrl = `${host}/videos${currUrl}`;
    const atag = document.createElement("a");
    atag.href = videoUrl;
    atag.download = videoUrl.split("/").pop(); // Optional: Set a filename
    document.body.appendChild(atag);
    atag.click();
    document.body.removeChild(atag);
  };

  useEffect(() => {
    if (project) {
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

  return (
    <div>
      <div
        key={k}
        className="flex flex-col w-full bg-white rounded-lg border-gray-300 
		overflow-hidden border-[1px]"
      >
        <div className="w-full aspect-video shadow-lg shadow-gray-800/20">
          {error ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4">
              <p className="text-gray-800 text-md">
                file : {file?.name} was not found or under processing, try again
                later
              </p>
            </div>
          ) : (
            <ReactPlayer
              url={`${host}${file?.url}`}
              ref={videoRef}
              id="video"
              onError={(error) => {
                setError(error);
              }}
              controls
              className="relative z-1"
              width="100%"
              height="100%"
            />
          )}
        </div>
        <div className="flex flex-col gap-1 px-3 pt-4 pb-2">
          <h1 className="text-md font-normal break-all text-gray-800">
            {file?.name}
          </h1>
          <p className="text-sm font-normal break-all text-gray-600">
            {file?.updatedAt?.split("T")?.[0]}
          </p>
          <p className="text-sm font-normal break-all text-gray-600">
            {file?.url}
          </p>
          <button
            onClick={downloadVideo}
            className={`text-white text-sm rounded-lg mt-1 px-4 py-1 bg-blue-600 
				hover:bg-blue-500 ${
          error ? "opacity-[30%] cursor-not-allowed" : "opacity-[100%]"
        }`}
          >
            Download
          </button>

          <button
            onClick={addToDeliverables}
            className={`text-white text-sm rounded-lg mt-1 px-4 py-1 bg-blue-600 
				hover:bg-blue-500 ${
          error ? "opacity-[30%] cursor-not-allowed" : "opacity-[100%]"
        }`}
          >
            Add to Deliverables
          </button>
        </div>
      </div>
    </div>
  );
}
