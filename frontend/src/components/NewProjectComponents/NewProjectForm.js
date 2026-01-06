"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlinePlusCircle,
  AiFillWarning,
  AiOutlineDelete,
} from "react-icons/ai";
import { HiArrowRight } from "react-icons/hi";
import { TbPdf } from "react-icons/tb";
import { BsImages, BsFileEarmarkRuled } from "react-icons/bs";
import { BiSolidVideos } from "react-icons/bi";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { Document, Page } from "react-pdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ImageKit from "imagekit";
import { useRecoilState } from "recoil";
import { currentUserState, sideBarExtendState } from "../../atoms/userAtom";
import { createSite, getSite } from "../../utils/SiteApiRoutes";
import {
  createProjectAccessRequest,
  updateProjectRequests,
  getClientFromOrganisation,
} from "../../utils/ApiRoutes";
import { useRouter } from "next/navigation";
import UserCard from "./UserCard";
import KML from "ol/format/KML.js";
import Map from "ol/Map.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { Tile as TileLayer2, Vector as VectorLayer } from "ol/layer.js";
import { add } from "ol/coordinate.js";
import * as olCoordinate from "ol/coordinate";
import NewProjectMapCard from "./NewProjectMapCard";
import SiteCardProjectAdd from "./SiteCardProjectAdd";
import { LuMaximize2 } from "react-icons/lu";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { geosearch } from "esri-leaflet-geocoder";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import L from "leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import ReactLeafletKml from "react-leaflet-kml";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });

const key = "yCsqOwmerwTFcuIuugTQ";
const attributions = " ";
let map;

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

let vector = new VectorLayer({
  source: new VectorSource(),
});

let view = new View({
  center: [876970.8463461736, 5859807.853963373],
  projection: "EPSG:3857",
  controls: [],
  zoom: 10,
});

let generatedResponse = [];
let generatedKMLResponse = [];
// var deliverablesRequired = [];

export default function NewProjectForm({ clientCreating }) {
  const mapboxRef = useRef(null);
  const [path2, setPath2] = useState("");
  const [uploadFileName, setUploadFileName] = useState([]);
  const [uploadArray, setUploadArray] = useState([]);
  const [name, setName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [scope, setScope] = useState("");
  const [flexibleScheduling, setFlexibleScheduling] = useState(true);
  const [clientInfo, setClientInfo] = useState({
    clientName: "",
    companyName: "",
    primaryContact: "",
    email: "",
    phone: "",
    preferredCommunication: "",
  });
  const [siteRequirement, setSiteRequirement] = useState({
    gsd: 3.5,
    areaSize: 100,
    areaUnit: "acres",
    sitePermission: "",
    localAuthority: "",
  });
  const [sites, setSites] = useState([
    {
      siteName: "",
      location: "",
      kml: [],
      kmlFileName: [],
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [budget, setBudget] = useState("");
  const [industry, setIndustry] = useState("Construction");
  const [customIndustry, setCustomIndustry] = useState("");
  const [type, setType] = useState("Survey");
  const [viewPdfFile, setViewPdfFile] = useState("");
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [viewImageFile, setViewImageFile] = useState("");
  const [openVideoViewer, setOpenVideoViewer] = useState(false);
  const [viewVideoFile, setViewVideoFile] = useState("");
  const [alerTheUser, setAlertTheUser] = useState("");
  const [showAlertTheUser, setShowAlertTheUser] = useState(false);
  const [kmlkmzFiles, setKmlkmzFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState(
    "Uploading KML/KMZ files"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // const [generatedResponse,setGeneratedResponse] = useState([]);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [deliverablesRequired, setDeliverablesRequired] = useState([]);
  const [currentUploadingNum, setCurrentUploadingNum] = useState(1);
  const [otherDeliverables, setOtherDeliverables] = useState("");
  const [sideBarExtend, setSideBarExtend] = useRecoilState(sideBarExtendState);
  const [teamMembers, setTeamMembers] = useState([]);
  const [openTeamMembersList, setOpenTeamMembersList] = useState(false);
  const [allClients, setAllClients] = useState([]);
  const [kmlLoaded, setKmlLoaded] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [currentKmlFile, setCurrentKmlFile] = useState("");
  const [path3, setPath3] = useState("");
  const [uploadKMLFileName, setUploadKMLFileName] = useState([]);
  const [uploadKMLArray, setUploadKMLArray] = useState([]);
  const [openLargeMap, setOpenLargeMap] = useState(false);
  const [userSites, setUserSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [openSitesTab, setOpenSitesTab] = useState(false);
  const router = useRouter();
  const mapRef = useRef();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState(["0", "0"]);
  const [mapCenter, setMapCenter] = useState([
    18.941842351894458, 73.02567770787,
  ]);
  const [searchBarAdded, serSearchBarAdded] = useState(false);
  const [dataCollection, setDataCollection] = useState("Required");
  const [dgps, setDgps] = useState([]);

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_ID,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5800,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      fontSize: "16px",
      fontWeight: "500",
      padding: "10px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  const insepctionTemplate = [
    "Visual Inspection",
    "Thermal Inspection",
    "Visual & Thermal Inspection",
    "Inspection Report",
  ];

  const deliverablesTemplate = [
    "Orthomosaic",
    "Digital Elevation Model",
    "Digital Surface Model",
    "Digital Terrain Model",
    "Ground Control Point",
    "Spot Levels",
    "Contours",
    "Cad Drawing",
    "3D model",
    "Point Cloud",
    "Drawing file",
    "Video",
    "Raw Photo",
    "Inspection Report",
    "Processed Data with Analytics",
    "Other",
  ];

  const realEstateDeliverables = [
    "Location AV",
    "Project AV",
    "Concept AV",
    "Interior 360",
    "Exterior 360",
  ];

  const fetchProjectLocation = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const { data } = await axios.get(url);
    console.log(data);
    if (data?.address) {
      const city =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.state;
      setProjectLocation(city);
    }
  };

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        let pos = [e?.latlng?.lat];
        pos = [...pos, e?.latlng?.lng];
        setLatitude(e?.latlng?.lat);
        setLongitude(e?.latlng?.lng);
        fetchProjectLocation(e?.latlng?.lat, e?.latlng?.lng);
        setPosition(pos);
      },
      locationfound: (location) => {
        console.log("location found:", location);
      },
    });
    return null;
  }

  useEffect(() => {
    setDeliverablesRequired([]);
    const elements = document.getElementsByClassName("deliverable-checkbox");
    for (let i = 0; i < elements.length; i++) {
      elements[i].checked = false;
    }
  }, [industry, type]);

  const addSourceToMap = async (kmlFile) => {
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
          // console.log(map.getView())
          map.getView().fit(extent, {
            padding: [100, 100, 100, 100],
            zoom: 20,
            duration: 1500,
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (searchBarAdded) return;

    const mapCurrent = mapRef.current;

    const control = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "button",
      showMarker: false,
      autoClose: true,
    });

    mapCurrent.addControl(control);
    serSearchBarAdded(true);
    // control.on("results", handleOnSearchResuts);

    return () => {
      // control.off("results", handleOnSearchResuts);
    };
  }, [mapRef?.current]);

  const handleOnSearchResuts = (data) => {
    setMapCenter([data.latlng.lat, data.latlng.lng]);
  };

  useEffect(() => {
    if (currentKmlFile && map) {
      if (!kmlLoaded) {
        addSourceToMap(currentKmlFile);
      } else {
        setKmlLoaded(false);
        setNewFile(true);
      }
    }
  }, [currentKmlFile]);

  useEffect(() => {
    if (!kmlLoaded && newFile) {
      addSourceToMap(currentKmlFile);
      setNewFile(false);
    }
  }, [kmlLoaded]);

  useEffect(() => {
    const raster = new TileLayer2({
      source: new XYZ({
        url: "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ",
        maxZoom: 20,
      }),
    });

    // console.log(raster)
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
    });

    map.on("click", function (evt) {
      console.log(evt);
      const pixel = map.getEventPixel(evt.originalEvent);
      // const feature = map.getFeaturesAtPixel(evt.pixel_)[0];
      // if (!feature) {
      //   return;
      // }
      // const coordinate = feature.getGeometry().getCoordinates();
      // console.log(coordinate);
      // displayFeatureInfo(evt.pixel);
    });

    // setTimeout(()=>{changeTheView()},500)
  }, []);

  const imagePathCheck = (path) => {
    if (path) {
      if (path.split("/").includes("data:image")) {
        return true;
      }
    }
  };

  const pdfPathCheck = (path) => {
    if (path) {
      if (path.split(";").includes("data:application/pdf")) {
        return true;
      }
    }
  };

  const videoPathCheck = (path) => {
    if (path) {
      if (path.split("/").includes("data:video")) {
        return true;
      }
    }
  };

  useEffect(() => {
    fetchAllClients();
  }, []);

  const fetchAllClients = async () => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getClientFromOrganisation,
      {
        organizationId: currentUser?.organizationId,
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data.status) {
      setAllClients(data?.clients);
    }
  };

  const openKmlFile = async () => {};

  const uploadImage = (url, i) => {
    imagekit
      .upload({
        file: url,
        folder: "Images",
        fileName: uploadFileName[i],
      })
      .then((response) => {
        if (i + 1 >= uploadArray.length) {
          generatedResponse = [...generatedResponse, response.url];
          setCurrentUploadingNum(i + 1);
          submitForm(generatedResponse);
        } else {
          checkAndUpload(i + 1);
          setCurrentUploadingNum(i + 1);
          generatedResponse = [...generatedResponse, response.url];
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertTheUser("Something went wrong while uploading!");
        setUploading(false);
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      });
  };

  const uploadVideo = async (url, i) => {
    imagekit
      .upload({
        file: url,
        folder: "Video",
        fileName: uploadFileName[i],
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      })
      .then((response) => {
        if (i + 1 >= uploadArray.length) {
          generatedResponse = [...generatedResponse, response.url];
          setCurrentUploadingNum(i + 1);
          submitForm(generatedResponse);
        } else {
          setCurrentUploadingNum(i + 1);
          checkAndUpload(i + 1);
          generatedResponse = [...generatedResponse, response.url];
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertTheUser("Something went wrong while uploading!");
        setUploading(false);
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      });
  };

  const uploadPdf = async (url, i) => {
    imagekit
      .upload({
        file: url,
        folder: "PDF",
        fileName: uploadFileName[i],
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      })
      .then((response) => {
        if (i + 1 >= uploadArray.length) {
          setCurrentUploadingNum(i + 1);
          generatedResponse = [...generatedResponse, response.url];
          submitForm(generatedResponse);
        } else {
          setCurrentUploadingNum(i + 1);
          checkAndUpload(i + 1);
          generatedResponse = [...generatedResponse, response.url];
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertTheUser("Something went wrong while uploading!");
        setUploading(false);
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      });
  };

  const uploadAny = async (url, i) => {
    imagekit
      .upload({
        file: url,
        folder: "Code",
        fileName: uploadFileName[i],
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      })
      .then((response) => {
        if (i + 1 >= uploadArray.length) {
          setCurrentUploadingNum(i + 1);
          generatedResponse = [...generatedResponse, response.url];
          submitForm(generatedResponse);
        } else {
          setCurrentUploadingNum(i + 1);
          checkAndUpload(i + 1);
          generatedResponse = [...generatedResponse, response.url];
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertTheUser("Something went wrong while uploading!");
        setUploading(false);
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      });
  };

  const uploadKmlFunc = async (url, i) => {
    imagekit
      .upload({
        file: url,
        folder: "KMLKMZ",
        fileName: uploadKMLFileName[i],
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      })
      .then((response) => {
        if (i + 1 >= uploadKMLArray?.length) {
          setCurrentUploadingNum(i + 1);
          generatedKMLResponse = [...generatedKMLResponse, response?.url];

          if (uploadArray?.length > 0) {
            setUploadingStatus("Uploading assets/documents");
            setCurrentUploadingNum(1);
            checkAndUpload(0);
          } else {
            submitForm([]);
          }
        } else {
          setCurrentUploadingNum(i + 1);
          uploadKmlFunc(uploadKMLArray[i + 1], i + 1);
          generatedKMLResponse = [...generatedKMLResponse, response.url];
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertTheUser("Something went wrong while uploading!");
        setUploading(false);
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      });
  };

  const url1Setter = () => {
    const file_input = document.getElementById("file_input");
    const files = file_input.files;
    Object.keys(files).forEach((i) => {
      const file = files[i];
      if (
        file.type.includes("image") ||
        file.type.includes("video") ||
        file.type.includes("pdf") ||
        file.type.includes("shp") ||
        file.type.includes("dwg")
      ) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          let uploaded_file = reader.result;
          setUploadFileName((uploadFileName) => [...uploadFileName, file.name]);
          setUploadArray((uploadArray) => [...uploadArray, uploaded_file]);
        });
        reader.readAsDataURL(file);
      }
    });
    setPath2("");
  };

  const url2Setter = () => {
    const file_input = document.getElementById("kml-input");
    const files = file_input.files;
    Object.keys(files).forEach((i) => {
      const file = files[i];
      if (file?.name?.includes(".kml")) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          let uploaded_file = reader.result;
          setUploadKMLFileName((uploadKMLFileName) => [
            ...uploadKMLFileName,
            file.name,
          ]);
          setUploadKMLArray((uploadKMLArray) => [
            ...uploadKMLArray,
            uploaded_file,
          ]);
        });
        reader.readAsDataURL(file);
      }
    });
    setPath3("");
  };

  const openSite = (site) => {
    setSelectedSites([...selectedSites, site]);
    if (Array.isArray(site?.kml)) {
      let tempFileName = [...uploadKMLFileName];
      let tempKmlArray = [...uploadKMLArray];
      for (let i = 0; i < site?.kml?.length; i++) {
        tempFileName = [...tempFileName, site?.siteName];
        tempKmlArray = [...tempKmlArray, site?.kml?.[i]];
      }
      setUploadKMLFileName(tempFileName);
      setUploadKMLArray(tempKmlArray);
    } else {
      setUploadKMLFileName((uploadKMLFileName) => [
        ...uploadKMLFileName,
        site.siteName,
      ]);
      setUploadKMLArray((uploadKMLArray) => [...uploadKMLArray, site?.kml]);
    }
  };

  const openInput = () => {
    document.getElementById("file_input").click();
  };

  const removeAttachment = (j) => {
    let nameArray = [...uploadFileName];
    nameArray.splice(j, 1);
    setUploadFileName(nameArray);
    let newUploadArray = [...uploadArray];
    newUploadArray.splice(j, 1);
    setUploadArray(newUploadArray);
  };

  const updateUserRequests = async (id) => {
    try {
      const auth = cookies.get("auth");
      let currIds = [...currentUser?.projectRequestsId, id];
      const { data } = await axios.post(
        updateProjectRequests,
        {
          projectRequestsId: currIds,
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
        if (clientCreating) {
          alert(
            "Your Request has been submitted! you will receive an mail once your project request has been accepted"
          );
          router.push(`/clientDashboard/projectrequests`);
        } else {
          router.push("/Projects");
        }
      }
    } catch (error) {
      console.error("Error updating user requests:", error);
      toast.error("Failed to update user requests.", toastOptions);
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  };

  const submitForm = async (attachments) => {
    const auth = cookies.get("auth");
    try {
      let newDeliverablesRequiredList = [...deliverablesRequired];

      if (deliverablesRequired?.includes("Other")) {
        newDeliverablesRequiredList = [
          ...newDeliverablesRequiredList,
          otherDeliverables,
        ];
      }

      const sites =
        selectedSites?.length > 0
          ? []
          : selectedSites?.map((site) => site?._id);

      const coordinates = {
        latitude: latitude,
        longitude: longitude,
      };

      const clientDetails = {
        name: currentUser?.name,
        _id: currentUser?._id,
        image: currentUser?.image,
        organizationName: currentUser?.organizationName,
        organizationRole: currentUser?.organizationRole,
        organizationId: currentUser?.organizationId,
        organizationDescription: currentUser?.organizationDescription,
        organizationType: currentUser?.organizationType,
        clientIndustry: currentUser?.clientIndustry,
        email: currentUser?.email,
        number: currentUser?.number,
      };

      const { data } = await axios.post(
        createProjectAccessRequest,
        {
          name,
          projectLocation,
          startDate,
          deadline,
          flexibleScheduling,
          scope,
          industry,
          type,
          kmlkmzFiles: generatedKMLResponse,
          attachments,
          clientDetails,
          deliverablesRequired: newDeliverablesRequiredList,
          teamMembers,
          coordinates,
          dataCollection,
          dgps,
          siteRequirement,
          clientInfo,
          paymentMethod,
          budget,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          withCredentials: true,
        }
      );

      generatedKMLResponse = [];
      generatedResponse = [];

      if (data.status) {
        updateUserRequests(data?.request?._id);
      } else {
        setUploading(false);
        setIsSubmitting(false);
        console.log("Something went wrong! cannot submit the request");
      }
    } catch (error) {
      console.error("Error in submitForm:", error);
      setUploading(false);
      setIsSubmitting(false);
      toast.error("Failed to submit form. Please try again.", toastOptions);
    }
  };

  const checkAndUpload = (j) => {
    if (imagePathCheck(uploadArray[j])) {
      uploadImage(uploadArray[j], j);
    } else if (videoPathCheck(uploadArray[j])) {
      uploadVideo(uploadArray[j], j);
    } else if (pdfPathCheck(uploadArray[j])) {
      uploadPdf(uploadArray[j], j);
    } else {
      uploadAny(uploadArray[j], j);
    }
  };

  const uploadFilesThenSubmit = async () => {
    if (isSubmitting) {
      console.log("Already submitting, please wait...");
      return;
    }

    setIsSubmitting(true);

    try {
      if (uploadKMLArray?.length > 0) {
        setUploading(true);
        uploadKmlFunc(uploadKMLArray[0], 0);
        setUploadingStatus("Uploading KML/KMZ files");
      } else if (uploadArray?.length > 0) {
        setUploading(true);
        setUploadingStatus("Uploading documents");
        generatedResponse = [];
        setCurrentUploadingNum(1);
        checkAndUpload(0);
      } else {
        submitForm([]);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitting(false);
      setUploading(false);
      toast.error("Submission failed. Please try again.", toastOptions);
    }
  };

  const validateInputs = () => {
    if (
      name.length > 0 &&
      projectLocation.length > 0 &&
      startDate.length > 0 &&
      deadline.length > 0 &&
      scope.length > 0 &&
      industry.length > 0 &&
      type.length > 0 &&
      latitude &&
      longitude &&
      clientInfo.clientName.length > 0 &&
      clientInfo.companyName.length > 0 &&
      clientInfo.primaryContact &&
      clientInfo.email &&
      clientInfo.phone &&
      clientInfo.preferredCommunication &&
      paymentMethod &&
      budget &&
      siteRequirement.sitePermission &&
      siteRequirement.localAuthority &&
      (deliverablesRequired.length > 0 ||
        deliverablesRequired.includes("Other"))
    ) {
      if (uploadKMLArray?.length > 0) {
        if (currentUser) {
          uploadFilesThenSubmit();
        } else {
          setAlertTheUser("Please login before submitting the project!");
          setShowAlertTheUser(true);
          setTimeout(() => {
            setShowAlertTheUser(false);
          }, 5000);
        }
      } else {
        setAlertTheUser("Please provide kml/kmz files!");
        setShowAlertTheUser(true);
        setTimeout(() => {
          setShowAlertTheUser(false);
        }, 5000);
      }
    } else {
      setAlertTheUser("Enter all the required fields!");
      setShowAlertTheUser(true);
      setTimeout(() => {
        setShowAlertTheUser(false);
      }, 5000);
    }
  };

  const addDgps = (dgp) => {
    let newList = [...dgps];
    newList.unshift(dgp);
    setDgps(newList);
  };

  const removeDgps = (dgp) => {
    let newList = [...dgps];
    const idx = newList.indexOf(dgp);
    if (idx > -1) {
      newList.splice(idx, 1);
    }
    setDgps(newList);
  };

  const addDeliverables = (deliverables) => {
    let newList = [...deliverablesRequired];
    newList.unshift(deliverables);
    setDeliverablesRequired(newList);
  };

  const removeDeliverables = (deliverables) => {
    let newList = [...deliverablesRequired];
    const idx = newList.indexOf(deliverables);
    if (idx > -1) {
      newList.splice(idx, 1);
    }
    setDeliverablesRequired(newList);
  };

  const addToTeam = (member) => {
    let newList = [...teamMembers];
    newList.unshift(member);
    setTeamMembers(newList);
  };

  const removeFromTeam = (member) => {
    let newList = [...teamMembers];
    const idx = newList.findIndex((mem) => {
      if (mem._id === member._id) {
        return true;
      }
      return false;
    });
    if (idx > -1) {
      newList.splice(idx, 1);
    }
    setTeamMembers(newList);
  };

  const fetchSites = async (id) => {
    const auth = cookies.get("auth");
    const { data } = await axios.post(
      getSite,
      { id },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        withCredentials: true,
      }
    );
    if (data?.status) {
      setUserSites(data?.sites);
    }
  };

  useEffect(() => {
    if (currentUser?.sites?.length > 0) {
      fetchSites(currentUser?.sites);
    }
  }, [currentUser]);

  const redirectToSitePage = () => {
    if (
      confirm(
        "Are you sure you want to leave this page? Your changes will be discarded"
      )
    ) {
      router.push(`/clientDashboard/sites`);
    }
  };

  return (
    <main className="w-full mt-5 md:px-8 px-4">
      <div
        className={`fixed top-0 ${
          showPreview ? "left-0" : "-left-[100%]"
        } h-full w-full z-50 flex 
  items-center p-2 justify-center bg-black/60 transition-all duration-200 ease-in-out`}
      >
        <div
          className="bg-white rounded-lg w-[800px] max-h-[90%] overflow-y-auto 
    border-[1px] border-gray-300 flex flex-col"
        >
          <div className="flex items-center justify-between gap-5 px-4 py-3 border-b-[1px] border-gray-300 sticky top-0 bg-white">
            <h1 className="text-xl font-semibold text-black">
              Project Summary
            </h1>
            <div
              onClick={() => {
                setShowPreview(false);
                setAgreedToTerms(false);
              }}
              className="p-2 rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out cursor-pointer"
            >
              <RxCross1 className="h-5 w-5 text-gray-800" />
            </div>
          </div>

          <div className="px-4 py-4 flex flex-col gap-4">
            {/* Basic Information */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="text-md font-medium text-blue-700">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-md font-medium text-blue-700">
                    {projectLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-md font-medium text-blue-700">
                    {industry === "Other" ? customIndustry : industry}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="text-md font-medium text-blue-700">{type}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Timeline
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-md font-medium text-blue-700">
                    {startDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="text-md font-medium text-blue-700">
                    {deadline}
                  </p>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Coordinates
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Latitude</p>
                  <p className="text-md font-medium text-blue-700">
                    {latitude}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Longitude</p>
                  <p className="text-md font-medium text-blue-700">
                    {longitude}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Contact And Communication
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.clientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Contact</p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.primaryContact}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Preferred Communication
                  </p>
                  <p className="text-md font-medium text-blue-700">
                    {clientInfo.preferredCommunication}
                  </p>
                </div>
              </div>
            </div>

            {/* Site Requirement */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Site Requirement
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">GSD</p>
                  <p className="text-md font-medium text-blue-700">
                    {siteRequirement.gsd}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="text-md font-medium text-blue-700">
                    {siteRequirement.areaSize} {siteRequirement.areaUnit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Local Authority Permissions Needed
                  </p>
                  <p className="text-md font-medium text-blue-700">
                    {siteRequirement.localAuthority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NOC Availble</p>
                  <p className="text-md font-medium text-blue-700">
                    {siteRequirement.sitePermission}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Collection & DGPS */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Data Collection
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Data Collection</p>
                  <p className="text-md font-medium text-blue-700">
                    {dataCollection}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DGPS</p>
                  <p className="text-md font-medium text-blue-700">
                    {dgps.length > 0 ? dgps.join(", ") : "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Deliverables Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {deliverablesRequired.map((deliverable, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {deliverable === "Other" ? otherDeliverables : deliverable}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Project Description
              </h2>
              <p className="text-md text-blue-700">{scope}</p>
            </div>

            {/* Files */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">Files</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">KML/KMZ Files</p>
                  <p className="text-md font-medium text-blue-700">
                    {uploadKMLArray.length} file(s)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attachments</p>
                  <p className="text-md font-medium text-blue-700">
                    {uploadArray.length} file(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {teamMembers.length > 0 && (
              <div className="border-[1px] border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-black mb-3">
                  Team Members
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <img
                        src={member.image}
                        className="h-6 w-6 rounded-full object-cover"
                        alt={member.name}
                      />
                      <span className="text-sm text-blue-700">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget And Payment Method */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-black mb-3">
                Budget And Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-md font-medium text-blue-700">{budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-md font-medium text-blue-700">
                    {paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-[1px] border-gray-300 rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-black mb-3">
                Terms and Conditions
              </h2>
              <div className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto mb-3">
                <p>
                  1. All information provided must be accurate and complete.
                </p>
                <p>
                  2. Project timelines are tentative and subject to
                  confirmation.
                </p>
                <p>3. Payment terms will be discussed upon project approval.</p>
                <p>
                  4. Any changes to the project scope must be communicated in
                  writing.
                </p>
                <p>5. Confidentiality of project data will be maintained.</p>
                <p>
                  6. Deliverables will be provided as per agreed specifications.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-sm text-gray-800">
                  I agree to the terms and conditions{" "}
                  <span className="text-red-600">*</span>
                </span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t-[1px] border-gray-300 sticky bottom-0 bg-white">
            <button
              onClick={() => {
                setShowPreview(false);
                setAgreedToTerms(false);
              }}
              className="px-5 py-2 rounded-lg border-[1px] border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Back to Edit
            </button>
            {/* <button
              onClick={() => {
                if (agreedToTerms && !isSubmitting) {
                  setShowPreview(false);
                  uploadFilesThenSubmit();
                } else if (isSubmitting) {
                  toast.error(
                    "Submission in progress, please wait...",
                    toastOptions
                  );
                } else {
                  toast.error(
                    "Please agree to terms and conditions",
                    toastOptions
                  );
                }
              }}
              disabled={!agreedToTerms || isSubmitting}
              className={`px-5 py-2 rounded-lg text-white ${
                agreedToTerms && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button> */}
            <button
              onClick={() => {
                if (isSubmitting) {
                  toast.error(
                    "Submission in progress, please wait...",
                    toastOptions
                  );
                  return;
                }

                if (!agreedToTerms) {
                  toast.error(
                    "Please agree to terms and conditions",
                    toastOptions
                  );
                  return;
                }

                // ✅ Call validateInputs here instead of directly calling uploadFilesThenSubmit
                validateInputs();
              }}
              disabled={!agreedToTerms || isSubmitting}
              className={`px-5 py-2 rounded-lg text-white ${
                agreedToTerms && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </div>
      </div>
      {/*<div className={`fixed ${openLargeMap ? 'left-0' : '-left-[100%]'} top-0 transition-all duration-200
			ease-in-out h-full w-full flex bg-black/60 z-50 items-center justify-center`}>
				<div className="w-[95%] relative h-[95%] p-[2px] bg-white border-[1px] border-gray-200 rounded-lg overflow-hidden">
					<div 
					onClick={()=>setOpenLargeMap(false)}
					className="absolute top-4 z-40 right-4 cursor-pointer rounded-full p-2 bg-black/50">
						<RxCross1 className="h-5 w-5 text-gray-200"/>
					</div>
					<div className="h-full w-full rounded-md overflow-hidden" id="temp-map"/>
				</div>
			</div>*/}
      <div
        className={`z-50 fixed  bottom-5 ${
          showAlertTheUser ? "right-5" : "-right-[100%]"
        } 
			px-3 py-2 rounded-lg border-[1px] border-gray-400 bg-white transition-all
			duration-200 ease-in-out flex items-center gap-1`}
      >
        <AiFillWarning className="h-6 w-6 text-red-600" />
        <h1 className="text-red-600 text-md font-normal">{alerTheUser}</h1>
      </div>
      <div
        className={`fixed transition-all duration-300 ease-in-out overflow-hidden
			${
        uploading ? "h-full w-full" : "h-0 w-0"
      } bottom-0 left-0 right-0 mx-auto z-50 bg-white/70 flex 
			items-center justify-center`}
      >
        <div className="flex flex-col items-center">
          {" "}
          <span className="loader" />
          <p className="text-lg mt-4 font-semibold text-blue-700">
            {uploadingStatus}
          </p>
          <p className="text-lg font-semibold text-blue-700">
            {currentUploadingNum}/{" "}
            {uploadingStatus === "Uploading KML/KMZ files"
              ? uploadKMLArray?.length
              : uploadArray?.length}
          </p>
        </div>
      </div>
      <div
        className={`${
          openTeamMembersList ? "left-0" : "-left-[100%]"
        } top-0 fixed flex items-center 
			justify-center h-full w-full z-50 bg-black/30 top-0 transition-all duration-200 ease-in-out`}
      >
        <div
          className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
				border-[1px] border-gray-200/50 bg-white pt-3 pb-1 flex flex-col overflow-hidden"
        >
          <div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
            <div className="flex gap-5 justify-between w-full items-center">
              <h1 className="text-xl select-none text-black font-semibold">
                Add Team Members
              </h1>
              <div
                onClick={() => {
                  setOpenTeamMembersList(false);
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out rounded-full"
              >
                <IoMdClose className="h-5 w-5 cursor-pointer text-black" />
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-300 mt-2" />
          <div className="flex flex-col gap-2 px-2 py-2">
            {allClients?.map((client, j) => (
              <UserCard
                client={client}
                j={j}
                key={j}
                addToTeam={addToTeam}
                removeFromTeam={removeFromTeam}
                teamMembers={teamMembers}
                setTeamMembers={setTeamMembers}
              />
            ))}
          </div>
        </div>
      </div>
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
      <h1 className="text-xl font-semibold text-black">Project request form</h1>
      <div className="w-full gap-5 grid md:grid-cols-2 grid-cols-1">
        <div>
          <div
            className="bg-white mt-3 p-2 px-3 rounded-xl border-[1px] flex flex-col
				gap-3 border-gray-300"
          >
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Project name <span className="text-red-600">*</span>
              </h1>
              <div
                className="bg-gray-50 rounded-lg border-[1px] p-2 
						hover:border-gray-400 focus-within:border-gray-500  border-gray-300"
              >
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-md font-normal text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-300 "
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Project location <span className="text-red-600">*</span>
              </h1>
              <div
                className="bg-gray-50 rounded-lg border-[1px] p-2 
						hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
              >
                <input
                  type="text"
                  placeholder="Enter project location"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  className="text-md font-normal text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-300 "
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-md text-black">
                Coordinates <span className="text-red-500">*</span>{" "}
                <span className="text-gray-500/70 ml-1">
                  (Place marker on map)
                </span>{" "}
              </h1>
              <div className="flex items-center gap-5 w-full md:flex-row flex-col">
                <div
                  className="bg-gray-50 md:w-[50%] w-full rounded-lg border-[1px] p-2 
							hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                >
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                  />
                </div>
                <div
                  className="bg-gray-50 md:w-[50%] w-full rounded-lg border-[1px] p-2 
							hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                >
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap w-full items-center lg:flex-row flex-col gap-3">
              <div className="flex flex-col gap-1 w-full">
                <h1 className="text-md text-black">
                  Tentative start date <span className="text-red-600">*</span>
                </h1>
                <div
                  className="bg-gray-50 rounded-lg border-[1px] p-2 
							hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                >
                  <input
                    type="date"
                    placeholder="Enter start date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <h1 className="text-md text-black">
                  Tentative deadline <span className="text-red-600">*</span>
                </h1>
                <div
                  className="bg-gray-50 rounded-lg border-[1px] p-2 
							hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                >
                  <input
                    type="date"
                    placeholder="Enter deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full lg:max-w-[250px]">
                <h1 className="text-md text-black">
                  Flexible Schedule <span className="text-red-600">*</span>
                </h1>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400">
                  <span className="text-gray-700 font-medium">
                    {flexibleScheduling ? "Yes" : "No"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFlexibleScheduling((prev) => !prev)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                      flexibleScheduling ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        flexibleScheduling ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Industry of work <span className="text-red-600">*</span>
              </h1>
              <div
                className="w-full bg-gray-50 rounded-lg border-[1px] hover:border-gray-400 
						border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="text-md font-normal text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-300 "
                >
                  <option value="Construction">Construction</option>
                  <option value="Tower">Tower</option>
                  <option value="Railway">Railway</option>
                  <option value="Windmill">Windmill</option>
                  <option value="Solar">Solar</option>
                  <option value="Mining">Mining</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {industry === "Other" && (
                <div
                  className="bg-gray-50 mt-2 rounded-lg border-[1px] p-2 
							hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                >
                  <input
                    type="text"
                    placeholder="Enter Industry of work"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    className="text-md font-normal text-gray-800 w-full 
								bg-transparent outline-none 
								placeholder:text-gray-300 "
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Type of project <span className="text-red-600">*</span>
              </h1>
              <div
                className="w-full bg-gray-50 rounded-lg border-[1px] hover:border-gray-400 
						border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="text-md font-normal text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-300 "
                >
                  <option value="Maping">Mapping</option>
                  <option value="Survey">Survey</option>
                  <option value="Surveileance">Surveileance</option>
                  <option value="Aerial">Aerial Photography/Videography</option>
                  <option value="Agriculture Mapping">
                    Agriculture Mapping
                  </option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Custom">Custom Request</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Data Collection <span className="text-red-600">*</span>
              </h1>
              <div
                className="w-full bg-gray-50 rounded-lg border-[1px] hover:border-gray-400 
						border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <select
                  value={dataCollection}
                  onChange={(e) => {
                    setDataCollection(e.target.value);
                  }}
                  className="text-md font-normal text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-300 "
                >
                  <option value="Required">Required</option>
                  <option value="Not Required">Not Required</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                DGPS <span className="text-red-600">*</span>
              </h1>
              <div
                className="bg-gray-50 rounded-lg border-[1px] p-2 
						hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
              >
                <span className="flex items-center text-gray-900 gap-1">
                  <input
                    onClick={() => {
                      if (dgps?.includes("Static")) {
                        removeDgps("Static");
                      } else {
                        addDgps("Static");
                      }
                    }}
                    className="dgps-checkbox"
                    type="checkbox"
                  />
                  Static
                </span>
                <span className="flex items-center text-gray-900 gap-1">
                  <input
                    onClick={() => {
                      if (dgps?.includes("Ground Control Point")) {
                        removeDgps("Ground Control Point");
                      } else {
                        addDgps("Ground Control Point");
                      }
                    }}
                    className="dgps-checkbox"
                    type="checkbox"
                  />
                  Ground Control Point
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Processed data requried <span className="text-red-600">*</span>
              </h1>
              <div
                className="bg-gray-50 rounded-lg border-[1px] p-2 
						hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
              >
                {industry === "Real estate" &&
                  realEstateDeliverables.map((deliverable, k) => {
                    return (
                      <span
                        key={k}
                        className="flex items-center text-gray-900 gap-1"
                      >
                        <input
                          className="deliverable-checkbox"
                          type="checkbox"
                          onClick={() => {
                            if (deliverablesRequired?.includes(deliverable)) {
                              removeDeliverables(deliverable);
                            } else {
                              addDeliverables(deliverable);
                            }
                          }}
                        />
                        {deliverable}
                      </span>
                    );
                  })}
                {type === "Inspection" &&
                  insepctionTemplate.map((deliverable, k) => {
                    return (
                      <span
                        className="flex items-center text-gray-900 gap-1"
                        key={k}
                      >
                        <input
                          className="deliverable-checkbox"
                          type="checkbox"
                          onClick={() => {
                            if (deliverablesRequired?.includes(deliverable)) {
                              removeDeliverables(deliverable);
                            } else {
                              addDeliverables(deliverable);
                            }
                          }}
                        />
                        {deliverable}
                      </span>
                    );
                  })}
                {industry !== "Real estate" &&
                  deliverablesTemplate.map((deliverable, k) => {
                    return (
                      <span
                        key={k}
                        className="flex items-center text-gray-900 gap-1"
                      >
                        <input
                          className="deliverable-checkbox"
                          type="checkbox"
                          onClick={() => {
                            if (deliverablesRequired?.includes(deliverable)) {
                              removeDeliverables(deliverable);
                            } else {
                              addDeliverables(deliverable);
                            }
                          }}
                        />
                        {deliverable}
                      </span>
                    );
                  })}
                {deliverablesRequired?.includes("Other") && (
                  <div
                    className="bg-white text-sm mt-2 rounded-lg border-[1px] p-2 
								hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
                  >
                    <input
                      type="text"
                      placeholder="Enter deliverables"
                      value={otherDeliverables}
                      onChange={(e) => setOtherDeliverables(e.target.value)}
                      className="text-md font-normal text-gray-800 w-full 
									bg-transparent outline-none 
									placeholder:text-gray-300 "
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">
                Project Description <span className="text-red-600">*</span>
              </h1>
              <div
                className="bg-gray-50 rounded-lg border-[1px] p-2 
						hover:border-gray-400 focus-within:border-gray-500 border-gray-300"
              >
                <textarea
                  type="text"
                  placeholder="Briefly describe the goal or problem to be solved. (e.g. “Need topographic mapping for 50 acres for layout planning.”)"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="text-sm font-normal h-[100px] resize-none text-gray-800 w-full 
							bg-transparent outline-none 
							placeholder:text-gray-400 "
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-lg text-black">Team members</h1>
              <div
                onClick={() => setOpenTeamMembersList(true)}
                className="w-full flex items-center gap-1"
              >
                {teamMembers?.map((member, j) => (
                  <img
                    onClick={() => setOpenTeamMembersList(true)}
                    src={member?.image}
                    key={j}
                    className="rounded-full hover:scale-110 transition-all duration 
									ease-in-out cursor-pointer h-10 w-10 object-cover"
                  />
                ))}
                <div
                  onClick={() => setOpenTeamMembersList(true)}
                  className="h-10 w-10 p-2 bg-gray-100 hover:scale-110 cursor-pointer rounded-full flex items-center justify-center"
                >
                  <AiOutlinePlus className="h-full w-full text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className="w-full rounded-lg flex flex-col bg-white border-[1px] 
					border-gray-300 px-3 py-3 gap-3 "
          >
            <h1 className="text-gray-800 text-md">Place Marker in map</h1>
            <div className="w-full h-[300px] z-10 rounded-lg overflow-hidden border-[1px] border-gray-500">
              <MapContainer
                center={mapCenter}
                zoom={13}
                maxZoom={20}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
                whenCreated={(map) => (mapRef.current = map)}
              >
                <LayersControl position="topright">
                  <LayersControl.Overlay name="Vector Map">
                    <TileLayer
                      maxZoom={20}
                      url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                      attribution=""
                    />
                  </LayersControl.Overlay>

                  <LayersControl.Overlay name="Mapbox Map">
                    <TileLayer
                      maxZoom={20}
                      url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=sk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbG4wazg4c3YxMDMwMmpuemp2eDl6bzh0In0.sUZFHTO5dLZjZDdqINFOwA`}
                      attribution=""
                    />
                  </LayersControl.Overlay>

                  <LayersControl.Overlay checked name="Satellite Map">
                    <TileLayer
                      maxZoom={20}
                      url={`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ`}
                      attribution=""
                    />
                  </LayersControl.Overlay>
                </LayersControl>
                <Marker position={position}>
                  <Popup>{position}</Popup>
                </Marker>

                <MyComponent />
              </MapContainer>
            </div>
          </div>
          <div
            className="bg-white mt-3 p-3 h-auto rounded-xl border-[1px] flex flex-col
					gap-2 border-gray-300"
          >
            <h1 className="text-lg text-black">
              Upload KML/KMZ file <span className="text-red-600">*</span>
            </h1>
            <div
              className={` border-sky-400 hover:border-sky-600 transition-all duration-200 
						ease-in-out border-dashed ${
              currentKmlFile ? "aspect-video border-2" : "w-[0%] h-[0%]"
            } rounded-lg flex items-center 
						justify-center cursor-pointer overflow-hidden relative z-10`}
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
                  <RxCross1 className="h-5 w-5 text-gray-200" />
                </div>
                <div
                  ref={mapboxRef}
                  id="map"
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
            <div className="mt-0 grid grid-cols-6 gap-3 w-full">
              {uploadKMLArray?.map((kml, j) => (
                <NewProjectMapCard
                  key={j}
                  kml={kml}
                  j={j}
                  setCurrentKmlFile={setCurrentKmlFile}
                  currentKmlFile={currentKmlFile}
                />
              ))}
              {/*<div className="bg-gray-200 cursor-pointer hover:scale-[105%] 
							transition-all duration-100 ease-in-out rounded-lg aspect-square w-full border-[1px] border-gray-300"/>
							*/}
              <input
                id="kml-input"
                onChange={(e) => {
                  setPath3(e.target.value);
                  url2Setter();
                }}
                hidden
                multiple="multiple"
                type="file"
                accept=".kml,.kmz"
                value={path3}
              />
              <div
                onClick={() => {
                  if (
                    currentUser?.clientIndustry?.includes(
                      "Drone Service Provider"
                    )
                  ) {
                    document.getElementById("kml-input").click();
                  } else {
                    setOpenSitesTab(true);
                  }
                }}
                className="bg-gray-200 cursor-pointer hover:scale-[105%] 
							transition-all duration-100 ease-in-out rounded-lg aspect-square flex items-center justify-center w-full border-[1px] border-gray-300"
              >
                <AiOutlinePlus className="h-7 w-7 text-gray-500" />
              </div>
            </div>
            <h1 className="text-lg mt-2 text-black">Attachments</h1>
            <div className="flex flex-col gap-2">
              {uploadFileName.map((name, j) => {
                return (
                  <div
                    key={j}
                    className="w-full px-2 py-[6px] text-sm flex items-center justify-between gap-2 bg-gray-100 rounded-md border-[1px] border-gray-400"
                  >
                    <div className="flex items-center gap-1">
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
                      {name}
                    </div>
                    <div className="gap-2 flex items-center">
                      <span
                        onClick={() => {
                          if (name.includes("pdf")) {
                            setViewPdfFile(uploadArray[j]);
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
                            setViewImageFile(uploadArray[j]);
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
                            setViewVideoFile(uploadArray[j]);
                          } else {
                          }
                        }}
                        className="text-sky-600 cursor-pointer hover:text-blue-700"
                      >
                        View
                      </span>
                      <span
                        onClick={() => removeAttachment(j)}
                        className="text-red-600 cursor-pointer hover:text-red-500"
                      >
                        <RxCross1 className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <input
              id="file_input"
              type="file"
              value={path2}
              onChange={(e) => {
                setPath2(e.target.value);
                url1Setter();
              }}
              hidden
              multiple="multiple"
              accept="image/*, video/*, .pdf, .shp, .dwg"
            />
            <div
              onClick={openInput}
              className=" rounded-full p-[2px] cursor-pointer h-7 
						flex items-center justify-center w-7 hover:scale-[105%] transition-all
						duration-100 ease-in-out"
            >
              <AiOutlinePlusCircle className="h-full w-full text-gray-500" />
            </div>
          </div>
          {/* Site Requirement Section */}
          <div className="bg-white p-3 rounded-2xl border-[1px] border-gray-300 shadow-sm mt-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Site Requirement
            </h2>

            {/* GSD Slider */}
            <div className="mb-3 w-full">
              <label
                htmlFor="gsd"
                className="block text-sm font-medium text-black mb-2"
              >
                GSD<span className="text-red-500">*</span>
                <span className="text-gray-700">
                  {siteRequirement.gsd.toFixed(1)} cm/px
                </span>
              </label>
              <div className="flex items-center gap-4 w-full">
                {/* Minus Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSiteRequirement((prev) => ({
                      ...prev,
                      gsd: Math.max(0.5, prev.gsd - 0.1),
                    }))
                  }
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-full"
                >
                  −
                </button>

                {/* Slider */}
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={siteRequirement.gsd}
                  onChange={(e) =>
                    setSiteRequirement({
                      ...siteRequirement,
                      gsd: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-0.5  bg-gray-200 rounded-lg outline-none accent-blue-500"
                />

                {/* Plus Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSiteRequirement((prev) => ({
                      ...prev,
                      gsd: Math.min(10, prev.gsd + 0.1),
                    }))
                  }
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-full"
                >
                  +
                </button>
              </div>
            </div>

            {/* Area Size */}
            <div>
              <label
                htmlFor="areaSize"
                className="block text-sm font-medium text-black mb-2"
              >
                Area Size<span className="text-red-500">*</span>
                <span className="text-gray-700">
                  {" "}
                  {siteRequirement.areaSize} {siteRequirement.areaUnit}
                </span>
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={siteRequirement.areaSize}
                  onChange={(e) =>
                    setSiteRequirement({
                      ...siteRequirement,
                      areaSize: e.target.value,
                    })
                  }
                />
                <select
                  value={siteRequirement.areaUnit}
                  onChange={(e) =>
                    setSiteRequirement({
                      ...siteRequirement,
                      areaUnit: e.target.value,
                    })
                  }
                >
                  <option value="acres">Acres</option>
                  <option value="sq.km">Sq. Km</option>
                  <option value="hectare">Hectare</option>
                </select>
              </div>
            </div>
          </div>

          {/* Compliance & Permissions */}
          <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-sm mt-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Compliance & Permissions
            </h2>

            {/* Site Permission */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 mb-2">
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Site Permission or NOC availble{" "}
                <span className="text-red-600">*</span>
              </h3>
              <div className="flex flex-col sm:flex-row sm:gap-6 gap-1.5">
                {["Yes", "No", "Need Support"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-gray-900"
                  >
                    <span
                      onClick={() =>
                        setSiteRequirement({
                          ...siteRequirement,
                          sitePermission: option,
                        })
                      }
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        siteRequirement.sitePermission === option
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {siteRequirement.sitePermission === option && (
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span
                      onClick={() =>
                        setSiteRequirement({
                          ...siteRequirement,
                          sitePermission: option,
                        })
                      }
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Local Authority Permission */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Local Authority Permissions Needed{" "}
                <span className="text-red-600">*</span>
              </h3>
              <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
                {["Yes", "No", "Not Sure"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-gray-900"
                  >
                    <span
                      onClick={() =>
                        setSiteRequirement({
                          ...siteRequirement,
                          localAuthority: option,
                        })
                      }
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        siteRequirement.localAuthority === option
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {siteRequirement.localAuthority === option && (
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span
                      onClick={() =>
                        setSiteRequirement({
                          ...siteRequirement,
                          localAuthority: option,
                        })
                      }
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Communication information */}
          <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-sm mt-3 w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Contact & Communication
            </h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">
              {/* Name */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={clientInfo.clientName}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, clientName: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Company Name */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={clientInfo.companyName}
                  onChange={(e) =>
                    setClientInfo({
                      ...clientInfo,
                      companyName: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Primary Contact */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800">
                  Primary Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter contact"
                  value={clientInfo.primaryContact}
                  onChange={(e) =>
                    setClientInfo({
                      ...clientInfo,
                      primaryContact: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={clientInfo.email}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, email: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={clientInfo.phone}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, phone: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Preferred Communication */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-800 mb-1">
                  Preferred Communication{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex. Call, WhatsApp, Email, Platform Chat, etc."
                  value={clientInfo.preferredCommunication}
                  onChange={(e) =>
                    setClientInfo({
                      ...clientInfo,
                      preferredCommunication: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white p-2 rounded-2xl border-[1px] border-gray-300 shadow-sm mt-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Budget And Payment
            </h2>
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-black mb-2"
              >
                Budget<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="block  border border-gray-400 rounded-lg px-2 py-1 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <label
                htmlFor="payment"
                className="block text-sm font-medium text-black mt-2 mb-2"
              >
                Payment Method<span className="text-red-500">*</span>
              </label>
              <select
                id="payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block  border border-gray-400 rounded-lg px-2 py-1 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select payment method</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 ${
          openSitesTab ? "left-0" : "-left-[100%]"
        } h-full w-full z-50 flex 
			items-center p-2 justify-center bg-black/40 transition-all duration-200 ease-in-out`}
      >
        <div
          className="bg-white rounded-lg w-[720px] max-h-[90%] overflow-y-auto 
				border-[1px] border-gray-300 flex flex-col transition-all duration-200 ease-in-out"
        >
          <div className="flex items-center justify-between gap-5 px-4 py-2 border-b-[1px] border-gray-300">
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  setOpenSitesTab(false);
                }}
                className="p-2 rounded-full hover:bg-gray-200/70 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <RxCross1 className="h-4 w-4 text-gray-800" />
              </div>
              <h1 className="text-lg font-semibold text-black">Select Site</h1>
            </div>
            <h1
              onClick={() => {
                redirectToSitePage();
              }}
              className="text-md cursor-pointer bg-blue-600 hover:bg-blue-500 px-4 py-1 ml-2 rounded-lg text-white"
            >
              Add More
            </h1>
          </div>
          <div className="grid px-2 py-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
            {userSites?.map((site, k) => (
              <SiteCardProjectAdd
                site={site}
                key={k}
                k={k}
                openSite={openSite}
                setOpenSitesTab={setOpenSitesTab}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowPreview(true)}
        disabled={isSubmitting}
        className={`mt-1 bg-blue-600 text-white w-full px-5 py-2 text-lg
					rounded-lg border-[1px] border-gray-500 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {isSubmitting ? "Processing..." : "Preview"}
      </button>
    </main>
  );
}
