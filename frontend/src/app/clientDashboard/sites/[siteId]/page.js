"use client";

import { useState, useEffect, useRef } from "react";
import ClientHeader from "../../../../components/ClientDashboardComponents/ClientHeader";
import SiteMapCard from "../../../../components/ClientDashboardComponents/SiteMapCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiLocationMarker, HiOutlineMail } from "react-icons/hi";
import { FiCornerDownRight } from "react-icons/fi";
import { AiOutlineCalendar } from "react-icons/ai";
import { LiaIndustrySolid } from "react-icons/lia";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Link from "next/link";
import { useRecoilState } from "recoil";
import {
  currentUserState,
  currentProjectState,
} from "../../../../atoms/userAtom";
import { getSiteById } from "../../../../utils/SiteApiRoutes";
import {
  fetchProjectsBySiteId,
  fetchAllProjectType,
} from "../../../../utils/ApiRoutes";
import axios from "axios";
import { LuMaximize2 } from "react-icons/lu";
import { Tile as TileLayer2, Vector as VectorLayer } from "ol/layer.js";
import KML from "ol/format/KML.js";
import Map from "ol/Map.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import { RxCross2 } from "react-icons/rx";
import XYZ from "ol/source/XYZ.js";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function Home({ params }) {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [projectsId, setProjectsId] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentSite, setCurrentSite] = useState("");
  const [loading, setLoading] = useState(true);
  const [openLargeMap, setOpenLargeMap] = useState(false);
  const [currentMap, setCurrentMap] = useState("");
  const [currentKml, setCurrentKml] = useState("");
  const [kmlLoaded, setKmlLoaded] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const router = useRouter();

  const addSourceToMap = async (kmlFile) => {
    let map = currentMap;
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: kmlFile,
        format: new KML(),
      }),
    });

    await map.addLayer(vectorLayer);
    // changeTheView();
    // const extent = await vectorLayer.getSource().getExtent();
    vectorLayer.getSource().on("change", () => {
      const vectorSource = vectorLayer.getSource();

      if (vectorSource.getState() === "ready" && !kmlLoaded) {
        const extent = vectorSource.getExtent();
        if (extent[0] === Infinity) {
          console.log(
            "Extent is invalid. KML data might not be loaded correctly."
          );
        } else {
          setKmlLoaded(true);
          map.getView().fit(extent, {
            padding: [100, 100, 100, 100],
            zoom: 0,
            duration: 1500,
          });
          setCurrentMap(map);
        }
      }
    });
  };

  const initMap = async () => {
    let vector = new VectorLayer({
      source: new VectorSource(),
    });

    let view = new View({
      center: [876970.8463461736, 5859807.853963373],
      projection: "EPSG:3857",
      controls: [],
      zoom: 10,
    });

    const raster = new TileLayer2({
      source: new XYZ({
        url: "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ",
        maxZoom: 20,
      }),
    });

    // console.log(raster)
    const map = new Map({
      layers: [raster, vector],
      target: document.getElementById(`site`),
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

    if (currentSite?.kml?.[0]) {
      for (let i = 0; i < currentSite?.kml?.length; i++) {
        const vectorLayer = new VectorLayer({
          source: new VectorSource({
            url: currentSite.kml[i],
            format: new KML(),
          }),
        });

        await map.addLayer(vectorLayer);

        vectorLayer.getSource().on("change", () => {
          const vectorSource = vectorLayer.getSource();

          if (vectorSource.getState() === "ready") {
            const extent = vectorSource.getExtent();
            if (extent[0] === Infinity) {
              console.log(
                "Extent is invalid. KML data might not be loaded correctly."
              );
            } else {
              map.getView().fit(extent, {
                padding: [100, 100, 100, 100],
                zoom: 0,
                duration: 1500,
              });
              setCurrentMap(map);
            }
          }
        });
      }
    } else {
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          url: currentSite.kml,
          format: new KML(),
        }),
      });

      await map.addLayer(vectorLayer);

      vectorLayer.getSource().on("change", () => {
        const vectorSource = vectorLayer.getSource();

        if (vectorSource.getState() === "ready") {
          const extent = vectorSource.getExtent();
          if (extent[0] === Infinity) {
            console.log(
              "Extent is invalid. KML data might not be loaded correctly."
            );
          } else {
            map.getView().fit(extent, {
              padding: [100, 100, 100, 100],
              zoom: 0,
              duration: 1500,
            });
            setCurrentMap(map);
          }
        }
      });
    }
  };

  const fetchAllProjectTypeFunc = async (id) => {
    const flattenedIds = id.flat();
    const { data } = await axios.post(fetchAllProjectType, {
      id: flattenedIds,
    });
    if (data?.status) {
      console.log(data);
      setProjects(data?.project);
    }
  };

  const fetchProjectsBySiteIdFunc = async (id) => {
    const { data } = await axios.post(fetchProjectsBySiteId, {
      siteId: id,
    });
    if (data?.status) {
      setProjectsId(data?.project);
    }
  };

  // const fetchSiteById = async (id) => {
  //   const auth = cookies.get("auth");
  //   const { data } = await axios.post(
  //     getSiteById,
  //     { id },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${auth}`,
  //       },
  //       withCredentials: true,
  //     }
  //   );
  //   if (data?.status) {
  //     setCurrentSite(data?.site[0]);
  //     setLoading(false);
  //   }
  // };

  const fetchSiteById = async (id) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getSiteById,
      { id },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data?.status) {
      setCurrentSite(data.site);
      setProjects(data?.site?.projects);

      const ongoingProjects = data?.site?.projects?.filter(
        (project) => project.status === "Ongoing project"
      );

      setOngoingProjects(ongoingProjects);
      setLoading(false);
    } else {
      console.error("Failed to fetch site:", data?.message);
    }
  };

  useEffect(() => {
    if (currentKml && currentMap) {
      if (!kmlLoaded) {
        addSourceToMap(currentKml);
      } else {
        setKmlLoaded(false);
        setNewFile(true);
      }
    } else {
      // if(currentMap) removeSourceFromMap();
    }
  }, [currentKml]);

  useEffect(() => {
    if (!kmlLoaded && newFile) {
      addSourceToMap(currentKml);
      setNewFile(false);
    }
  }, [kmlLoaded]);

  useEffect(() => {
    if (params?.siteId) {
      setLoading(true);
      fetchSiteById(params?.siteId);
    }
  }, [params.siteId]);

  useEffect(() => {
    if (currentSite) {
      fetchProjectsBySiteIdFunc(currentSite?._id);
      initMap();
    }
  }, [currentSite]);

  useEffect(() => {
    if (projectsId?.length > 0 && projects?.length < 1) {
      fetchAllProjectTypeFunc(projectsId);
    }
  }, [projectsId]);

  const goToProject = (project) => {
    let ind = project?.industry?.toLowerCase();
    if (ind === "construction" || ind === "tower") {
      setCurrentProject(project);
      router.push(
        `/clientSpecial/${currentUser?.name?.replace(" ", "")}/inspection?id=${
          project._id
        }`
      );
    } else if (ind === "solar") {
      setCurrentProject(project);
      router.push(
        `/clientSpecial/${currentUser?.name?.replace(" ", "")}/thermal?id=${
          project._id
        }`
      );
    }
  };

  return (
    <main className="w-full bg-gray-50 overflow-y-auto">
      <ToastContainer />
      <ClientHeader />
      <div className="md:px-5 px-2 py-5">
        <div className="flex items-center mt-2 gap-5 justify-between w-full">
          <h1 className="text-lg font-semibold text-black">Site Details</h1>
          <Link href={`/clientSpecial/${currentUser?.name?.replace(" ", "")}`}>
            <button
              className="px-4 py-2 rounded-lg text-white bg-blue-600 
						hover:bg-blue-500 cursor-pointer transition-all duration-200 ease-in-out
						flex items-center gap-2"
            >
              <AiOutlinePlusCircle className="h-5 w-5" />
              Create Project
            </button>
          </Link>
        </div>
        <div className="w-full h-[1px] my-3 bg-gray-300" />
        <div className="w-full flex md:flex-row flex-col md:gap-0 gap-3">
          <div className="md:w-[55%] w-full flex flex-col gap-3">
            <h1 className="text-lg font-semibold text-black">
              Sitename :{" "}
              <span className="font-normal">{currentSite?.siteName}</span>
            </h1>
            <h1 className="text-lg font-semibold text-black">
              Location :{" "}
              <span className="font-normal">{currentSite?.location}</span>
            </h1>
            <h1 className="text-lg font-semibold text-black">
              Created at :{" "}
              <span className="font-normal">
                {currentSite?.createdAt?.split("T")?.[0]}
              </span>
            </h1>
            <h1 className="text-lg font-semibold text-black">
              Ongoing Projects :{" "}
              <span className="font-normal">{projectsId?.length}</span>
            </h1>
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-3 md:grid-cols-4 sm:grid-cols-3 grid-cols-1">
              {Array.isArray(currentSite?.kml) &&
                currentSite?.kml?.map((kml, o) => (
                  <SiteMapCard
                    kml={kml}
                    o={o}
                    key={o}
                    currentKmlFile={currentKml}
                    setCurrentKmlFile={setCurrentKml}
                  />
                ))}
            </div>
          </div>
          <div className="md:w-[45%] w-full md:px-4">
            <div
              className="w-full aspect-video border-[1px] border-gray-300 border-dashed 
						cursor-pointer overflow-hidden relative"
            >
              <div
                className={`h-full w-full ${
                  openLargeMap
                    ? "fixed top-0 left-0 z-50 bg-white"
                    : "relative "
                }
							transition-all duration-200 ease-in-out group`}
              >
                <div
                  onClick={() => setOpenLargeMap(false)}
                  className={`top-4 ${
                    openLargeMap ? "absolute" : "hidden"
                  } z-40 right-4 cursor-pointer rounded-full p-2 bg-black/50`}
                >
                  <RxCross2 className="h-5 w-5 text-gray-200" />
                </div>
                <div
                  id={`site`}
                  className="w-full h-full overflow-hidden rounded-md z-30"
                />
                <div
                  onClick={() => setOpenLargeMap(true)}
                  className={`${
                    openLargeMap ? "hidden" : "absolute"
                  } hover:scale-110  
								transition-all duration-200 ease-in-out z-40 right-3 bottom-3 rounded-full bg-black/50 
								cursor-pointer p-1`}
                >
                  <LuMaximize2 className="h-4 w-4 text-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-6 gap-5 justify-between w-full">
          <h1 className="text-lg font-semibold text-black">Site Projects</h1>
        </div>
        <div className="w-full h-[1px] my-3 bg-gray-300" />
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {projects?.map((project, k) => (
            <div
              key={k}
              className="rounded-lg border-[1px] 
							border-gray-300 flex flex-col mt-4 bg-gradient-to-r 
							from-white to-white hover:to-blue-300/40 px-3 py-2 relative transition-all duration-200 ease-in-out"
            >
              <div
                className="absolute border-[1px] border-gray-400 rounded-xl text-black text-sm 
								text-gray-800 left-3 -top-4 z-40 bg-white px-2 py-1"
              >
                {project?.type}
              </div>
              <div className="w-full mt-2">
                <h1 className="text-lg font-semibold text-sky-600 leading-sm">
                  {project?.name}
                </h1>
              </div>
              <div className="h-[1px] bg-gray-300 w-[100%]" />
              <div className="flex items-center gap-1 mt-1 text-xs">
                <div
                  className={`h-2 w-2 rounded-full ${
                    project?.status === "Ongoing project"
                      ? "bg-purple-500"
                      : "bg-sky-600"
                  }`}
                />
                {project.status}
              </div>
              <h1 className="text-sm font-normal mt-2 flex items-center gap-1 text-gray-800">
                <LiaIndustrySolid className="h-4 w-4 text-gray-500" />
                {project?.clientDetails?.organizationName}
              </h1>
              <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800">
                <HiLocationMarker className="h-4 w-4 text-gray-500" />
                {project?.projectLocation}
              </h1>
              <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800">
                <AiOutlineCalendar className="h-4 w-4 text-gray-500" />
                {project?.startDate} - {project?.deadline}
              </h1>
              <h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-blue-600">
                <FiCornerDownRight className="h-4 w-4" />
                <button
                  onClick={() => {
                    goToProject(project);
                  }}
                  className="hover:underline cursor-pointer"
                >
                  More details
                </button>
              </h1>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
