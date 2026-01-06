"use client";

import { useState, useEffect, useRef } from "react";
import ClientHeader from "../../../components/ClientDashboardComponents/ClientHeader";
// import ImportantNotify from '../../../components/ClientDashboardComponents/ImportantNotify'
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SiteInputCard from "../../../components/ClientDashboardComponents/SiteInputCard";
import SiteCard from "../../../components/ClientDashboardComponents/SiteCard";
import { createSite, getSite } from "../../../utils/SiteApiRoutes";
import { updateUserSites } from "../../../utils/ApiRoutes";
import { currentUserState } from "../../../atoms/userAtom";
import { useRecoilState } from "recoil";
import axios from "axios";
import ImageKit from "imagekit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });

export default function Home() {
  const [openAddSite, setOpenAddSite] = useState(false);
  const [currentUploadingNum, setCurrentUploadingNum] = useState(1);
  const [currentUploadingSite, setCurrentUploadingSite] = useState(1);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [currentUserSites, setCurrentUserSites] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userSites, setUserSites] = useState([]);
  const [sites, setSites] = useState([
    {
      siteName: "",
      location: "",
      kml: [],
      kmlFileName: [],
    },
  ]);

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

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_ID,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
  });

  const uploadKmlFunc = async (sites, i, user) => {
    const uploadPromises = sites[i].kml.map(async (site, j) => {
      return new Promise((resolve, reject) => {
        let calculated = (j + 1 / site?.kml?.length) * 100;
        setCurrentUploadingNum(calculated);
        imagekit
          .upload({
            file: site, // required
            folder: "KMLKMZ",
            fileName: sites[i].kmlFileName[j], // required
            extensions: [
              {
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95,
              },
            ],
          })
          .then((response) => {
            console.log(
              `File uploaded: ${sites[i].kmlFileName[j]}, URL: ${response.url}`
            );
            resolve(response.url); // Resolve the promise with the URL
          })
          .catch((error) => {
            console.error(
              `Error uploading file: ${sites[i].kmlFileName[j]}`,
              error
            );
            reject(error); // Reject the promise with the error
          });
      });
    });

    try {
      setCurrentUploadingSite(sites[i]?.siteName);
      const kml = await Promise.all(uploadPromises);

      if (i + 1 >= sites?.length) {
        const auth = cookies.get("auth");
        const { data } = await axios.post(
          createSite,
          {
            ...sites[i],
            kml,
          },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
            withCredentials: true,
          }
        );
        if (data?.status) {
          if (user?.sites?.length > 0) {
            const data2 = await axios.post(updateUserSites, {
              id: currentUser?._id,
              sites: [...user?.sites, data?.site?._id],
            });
            if (data2?.data?.status) {
              setCurrentUser(data2?.data?.user);
            }
          } else {
            const data2 = await axios.post(updateUserSites, {
              id: currentUser?._id,
              sites: [...currentUser?.sites, data?.site?._id],
            });
            if (data2?.data?.status) {
              setCurrentUser(data2?.data?.user);
            }
          }
        }
        setUploading(false);
        setOpenAddSite(false);
        setSites([]);
        setTimeout(() => {
          setSites([
            {
              siteName: "",
              location: "",
              kml: [],
              kmlFileName: [],
            },
          ]);
        }, 200);
      } else {
        const auth = cookies.get("auth");
        const { data } = await axios.post(
          createSite,
          {
            ...sites[i],
            kml,
          },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
            withCredentials: true,
          }
        );
        if (data?.status) {
          if (user?.sites?.length > 0) {
            const data2 = await axios.post(updateUserSites, {
              id: currentUser?._id,
              sites: [...user?.sites, data?.site?._id],
            });
            if (data2?.data?.status) {
              setCurrentUser(data2?.data?.user);
              uploadKmlFunc(sites, i + 1, data2?.data?.user);
            }
          } else {
            const data2 = await axios.post(updateUserSites, {
              id: currentUser?._id,
              sites: [...currentUser?.sites, data?.site?._id],
            });
            if (data2?.data?.status) {
              setCurrentUser(data2?.data?.user);
              uploadKmlFunc(sites, i + 1, data2?.data?.user);
            }
          }
        }
      }
    } catch (ex) {
      console.log(error);
      toast.error("Something went wrong while uploading!", toastOptions);
      setUploading(false);
    }

    // imagekit.upload({
    // file : sites[i].kml, //required
    // folder: "KMLKMZ",
    // fileName : sites[i].kmlFileName,   //required
    // extensions: [
    //     {
    //         name: "google-auto-tagging",
    //         maxTags: 5,
    //         minConfidence: 95
    //     }
    // ]
    // }).then(async(response) => {
    // 	if(i+1 >= sites?.length){
    // 		setCurrentUploadingNum(i + 1);

    // 		const {data} = await axios.post(createSite,{
    // 			...sites[i],
    // 			kml:response?.url,
    // 		});
    // 		if(data?.status){
    // 			const data2 = await axios.post(updateUserSites,{
    // 				id:currentUser?._id,
    // 				sites:[...currentUser?.sites,data?.site?._id]
    // 			})
    // 			if(data2?.data?.status){
    // 				setCurrentUser(data2?.data?.user);
    // 			}
    // 		}
    // 		setUploading(false);
    // 		setOpenAddSite(false);
    // 		setSites([]);
    // 		setTimeout(()=>{
    // 			setSites([{
    // 				siteName:'',
    // 				location:'',
    // 				kml:[],
    // 				kmlFileName:[]
    // 			}])
    // 		},200)

    // 	}else{
    // 		setCurrentUploadingNum(i + 1);
    // 		const {data} = await axios.post(createSite,{
    // 			...sites[i],
    // 			kml:response?.url,
    // 		});
    // 		if(data?.status){
    // 			const data2 = await axios.post(updateUserSites,{
    // 				id:currentUser?._id,
    // 				sites:[...currentUser?.sites,data?.site?._id]
    // 			})
    // 			if(data2?.data?.status){
    // 				setCurrentUser(data2?.data?.user);
    // 				uploadKmlFunc(sites,i+1);
    // 			}
    // 		}

    // 	}
    // }).catch(error => {
    // 	console.log(error)
    // 	toast.error('Something went wrong while uploading!',toastOptions);
    // 	setUploading(false);
    // });
  };

  const isValidData = (dataArray) => {
    return dataArray.every((item) => {
      return (
        item.siteName &&
        item.kmlFileName &&
        item.kml?.length > 0 &&
        item.location
      );
    });
  };

  const uploadSites = async () => {
    try {
      const allValid = isValidData(sites);

      if (allValid && currentUser) {
        setUploading(true);
        await uploadKmlFunc(sites, 0);
      } else {
        toast.error("Some inputs are not provided!", toastOptions);
      }
    } catch (error) {
      console.error("Failed to upload sites:", error);
      toast.error("Failed to upload sites. Please try again.", toastOptions);
      throw error;
    } finally {
      setUploading(false);
    }
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
      setCurrentUserSites(currentUser?.sites);
    }
  }, [currentUser]);

  return (
    <div className="w-full bg-gray-50 overflow-y-auto">
      <ToastContainer />
      <ClientHeader />
      <div className="md:px-5 px-2 py-5">
        <div className="flex items-center mt-2 gap-5 justify-between w-full">
          <h1 className="text-lg font-semibold text-black">Your sites</h1>
          <button
            onClick={() => {
              setOpenAddSite(true);
            }}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 
					hover:bg-blue-500 cursor-pointer transition-all duration-200 ease-in-out
					flex items-center gap-2"
          >
            <AiOutlinePlusCircle className="h-5 w-5" />
            Add Sites
          </button>
        </div>
        <div className="w-full h-[1px] my-3 bg-gray-300" />

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-3 md:grid-cols-2 grid-cols-1">
          {userSites?.map((site, k) => (
            <SiteCard site={site} k={k} key={k} />
          ))}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 m-auto ${
          uploading ? "h-full w-full" : "h-0 w-0"
        } overflow-hidden
			flex items-center justify-center z-[60] bg-black/50 transition-all duration-200 ease-in-out`}
      >
        <div className="w-[450px] bg-white rounded-lg border-[1px] border-gray-400 py-3 px-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Uploading - {currentUploadingSite}
          </h1>
          <div className="h-2 mt-2 w-full bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full bg-blue-600 w-[${currentUploadingNum}%]`}
            />
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 ${
          openAddSite ? "left-0" : "-left-[100%]"
        } bg-black/50 
			flex items-center justify-center transition-all duration-200 ease-in-out z-50 h-full w-full`}
      >
        <div
          className="w-[700px] max-h-[90%] overflow-y-auto bg-white rounded-lg border-[1px] 
				border-gray-400 flex flex-col"
        >
          <div className="flex items-center gap-5 justify-between w-full border-gray-400 border-b-[1px] px-4 py-2">
            <div className="flex items-center flex-row-reverse gap-2">
              <h1 className="text-lg font-semibold text-black">Add Sites</h1>
              <div
                onClick={() => {
                  setOpenAddSite(false);
                  setSites([]);
                  setTimeout(() => {
                    setSites([
                      {
                        siteName: "",
                        location: "",
                        kml: [],
                        kmlFileName: [],
                      },
                    ]);
                  }, 200);
                }}
                className="hover:bg-gray-200 transition-all duration-200 ease-in-out p-1 
							rounded-full cursor-pointer"
              >
                <RxCross2 className="h-6 w-6 text-black" />
              </div>
            </div>
            <button
              onClick={uploadSites}
              className="text-white px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-500"
            >
              Upload
            </button>
          </div>
          {sites?.map((site, k) => (
            <SiteInputCard
              site={site}
              sites={sites}
              setSites={setSites}
              key={k}
              k={k}
              openAddSite={openAddSite}
            />
          ))}
          <div className="flex items-center justify-center py-1 gap-3 px-4">
            <button
              onClick={() => {
                let allSites = [...sites];
                allSites.pop();
                setSites(allSites);
              }}
              className="flex items-center px-4 py-2 hover:bg-gray-200 transition-all 
						duration-200 ease-in-out text-red-600 hover:text-red-500 rounded-lg gap-2"
            >
              <AiOutlineDelete className="h-4 w-4" />
              <p className="text-sm font-semibold">Remove Site</p>
            </button>

            <button
              onClick={() => {
                setSites([
                  ...sites,
                  {
                    siteName: "",
                    location: "",
                    kml: [],
                    kmlFileName: [],
                  },
                ]);
              }}
              className="flex items-center px-4 py-2 hover:bg-gray-200 transition-all 
						duration-200 ease-in-out rounded-lg gap-2"
            >
              <AiOutlinePlusCircle className="h-4 w-4 text-gray-800" />
              <p className="text-gray-800 text-sm font-semibold">Add Site</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
