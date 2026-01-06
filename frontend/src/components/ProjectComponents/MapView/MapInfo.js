"use client";
import { useState, useEffect } from "react";
import MainMapComponent from "./MainMapComponent";
import MapInfoCard from "./MapInfoCard";
import axios from "axios";
import { getProjectAccessRequestById } from "../../../utils/ApiRoutes";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function MapInfo({ sideBarExtend, params }) {
  // body...
  const [currentFile, setCurrentFile] = useState("");
  const [showName, setShowName] = useState(true);
  const [kmlFile, setKmlFile] = useState("");
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [request, setRequest] = useState("");
  const [kmlFiles, setKmlFiles] = useState([]);

  useEffect(() => {
    if (!filesLoaded) {
      fetchKmlFiles(params?.projectId);
    }
  }, []);

  const fetchKmlFiles = async (ID) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getProjectAccessRequestById,
      {
        id: ID,
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    setRequest(data?.request[0]);
    setKmlFiles(data?.request[0]?.kmlkmzFiles);
    // setKmlFiles(data?.request[0]?.kmlkmzFiles)
    setFilesLoaded(true);
    // console.log(data)
  };
  return (
    <main className="w-full h-full overflow-hidden items-center flex">
      <div
        className={`h-full ${
          sideBarExtend ? "w-[30%]" : "w-[20%]"
        } bg-gray-50 border-r-[3px] border-gray-300 flex flex-col`}
      >
        <div className="flex items-center pt-4 pb-3 border-b-[1px] border-gray-300 px-3">
          <h1 className="text-lg text-black font-semibold">KML files</h1>
        </div>
        <div className="flex flex-col gap-3 py-3 px-3">
          {kmlFiles.map((kml, j) => {
            return (
              <MapInfoCard
                key={j}
                kml={kml}
                j={j}
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                showName={showName}
                setShowName={setShowName}
                setKmlFile={setKmlFile}
              />
            );
          })}
        </div>
      </div>
      <div
        className={` ${sideBarExtend ? "w-[70%]" : "w-[80%]"} h-full bg-black`}
      >
        <MainMapComponent kmlFile={kmlFile} />
      </div>
    </main>
  );
}
