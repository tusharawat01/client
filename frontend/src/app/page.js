"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  registerUserRoute,
  clientLogin,
  checkForUserExist,
  createEmailVerify,
  verifySessionRoute,
} from "../utils/ApiRoutes";
import { HiOutlineMail } from "react-icons/hi";
import { LuLock } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsFillPersonFill, BsBuildingFill } from "react-icons/bs";
import { IoMdCall } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { currentUserState } from "../atoms/userAtom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LiaIndustrySolid } from "react-icons/lia";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: "lax" });

let industryList = [];
export default function Home() {
  const [registerUser, setRegisterUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [organizationType, setOrganizationType] = useState("Individual");
  const [organizationName, setOrganizationName] = useState("");
  const [emailVerifySent, setEmailVerifySent] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState("");
  const router = useRouter();

  const toastOption = {
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

  useEffect(() => {
    const verifySession = async () => {
      try {
        const auth = cookies.get("auth");
        if (!auth) {
          return;
        }
        const response = await axios.get(verifySessionRoute, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          withCredentials: true,
        });

        const { status, user } = response.data;

        if (status === true) {
          setCurrentUser(user);
          router.push("/clientDashboard/dashboard");
          toast.success(`Welcome back, ${user.name}`);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    };
    verifySession();
  }, [router]);

  const preRegistrationData = async () => {
    try {
      const data = localStorage.getItem("exploreData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  };

  const loginNGAandRedirect = async () => {
    toast.dismiss();

    if (!/@gmail\.com$/.test(email)) {
      setEmail("");
      toast.error("Please enter a valid email.", toastOption);
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error("Please enter a password", toastOption);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        clientLogin,
        {
          email,
          password,
        },
        { withCredentials: true, validateStatus: () => true }
      );
      const { token, user, message, status } = response.data;

      if (response.status !== 200 || status === false || !token) {
        toast.error(message || "Incorrect email or password", toastOption);
        setLoading(false);
      } else {
        let tempdata = { email, password };
        sessionStorage.setItem("a2a", JSON.stringify(tempdata));
        cookies.set("auth", token, {
          path: "/",
          secure: true,
          sameSite: "None",
          maxAge: 86400,
        });
        setCurrentUser(user);

        router.push("/clientDashboard/dashboard");
        toast.success(`Welcome ${user.name}`, toastOption);

        localStorage.setItem("currentTab", "Dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "An error occurred while logging in. Please try again.",
        toastOption
      );
    } finally {
      setLoading(false);
    }
  };

  const generateId = async (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    return token;
  };

  // const sendEmailVerification = async () => {
  //   setLoading(true);
  //   const { data } = await axios.post(checkForUserExist, {
  //     email,
  //   });
  //   const organizationId = await generateId(12);
  //   if (data?.status) {
  //     try {
  //       const data2 = await axios.post(createEmailVerify, {
  //         name,
  //         email,
  //         number,
  //         organizationType,
  //         clientIndustry: industryList,
  //         organizationName,
  //         organizationId,
  //         preRegistrationData : preRegistrationData(),
  //       });
  //       if (data2?.data?.status) {
  //         setEmailVerifySent(true);
  //         setLoading(false);
  //         toast("Verification email sent successfully!");
  //       } else {
  //         toast(data2?.data?.msg, toastOption);
  //         setLoading(false);
  //       }
  //     } catch (Ex) {
  //       toast("Something went wrong!", toastOption);
  //       setLoading(false);
  //     }
  //   } else {
  //     toast("Account already exists!", toastOption);
  //     setLoading(false);
  //   }
  // };

  const sendEmailVerification = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post(checkForUserExist, { email });

      if (!data?.status) {
        toast("Account already exists!", toastOption);
        setLoading(false);
        return;
      }
      const organizationId = await generateId(12);

      let preRegData = null;
      try {
        preRegData = await preRegistrationData();
      } catch (err) {
        console.warn("preRegistrationData failed", err);
      }
      console.log("preRegData :  ", preRegData);

      const response = await axios.post(createEmailVerify, {
        name,
        email,
        number,
        organizationType,
        clientIndustry: industryList,
        organizationName,
        organizationId,
        preRegistrationData: preRegData,
      });

      if (response?.data?.status) {
        setEmailVerifySent(true);
        toast("Verification email sent successfully!");
      } else {
        toast(response?.data?.msg || "Verification failed", toastOption);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      toast("Something went wrong!", toastOption);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = (e) => {
    e.preventDefault();
    if (registerUser) {
      if (
        email.length > 3 &&
        /@gmail\.com$/.test(email) &&
        name.length > 2 &&
        number.length > 5 &&
        industryList.length > 0 &&
        organizationName.length > 2
      ) {
        sendEmailVerification();
      } else {
        toast("Please Enter the required fields", toastOption);
      }
    } else {
      if (email.length > 3) {
        loginNGAandRedirect();
      } else {
        toast("Please Enter a valid mail id", toastOption);
      }
    }
  };

  const addIndustryToList = (industry) => {
    industryList.unshift(industry);
  };

  const removeIndustryFromList = (industry) => {
    const idx = industryList.indexOf(industry);
    if (idx > -1) {
      industryList.splice(idx, 1);
    }
  };

  const handleOtherCheckbox = (checked) => {
    setShowOtherInput(checked);
    if (!checked) {
      // Remove "other" industry from list when unchecked
      if (otherIndustry) {
        removeIndustryFromList(otherIndustry);
      }
      setOtherIndustry("");
    }
  };

  const handleOtherIndustryChange = (value) => {
    // Remove previous "other" value from list
    if (otherIndustry) {
      removeIndustryFromList(otherIndustry);
    }

    // Add new value to list if not empty
    if (value.trim()) {
      addIndustryToList(value.trim());
    }

    setOtherIndustry(value);
  };

  return (
    <main className="h-screen px-4 py-2 w-full flex items-center justify-center bg-[url('https://ik.imagekit.io/d3kzbpbila/thejashari_F0oWtIUL-')] bg-cover">
      <div
        className={`${
          registerUser ? "w-[700px]" : "w-[500px]"
        }  max-h-[95%] overflow-y-auto scrollbar-none px-7 py-3 rounded-lg
			bg-white/50 backdrop-blur-md m-auto`}
      >
        <Image
          src="https://ik.imagekit.io/d3kzbpbila/thejashari_JxPo9zToO"
          alt="Logo"
          width="150"
          height="200"
          aspect="2 2"
          className="mx-auto"
          priority
        />
        <div className="my-3 h-[1px] w-[100%] mx-auto bg-gray-600/50" />

        <form className="mt-4 flex flex-col gap-3">
          {registerUser && !emailVerifySent && (
            <>
              <div className="flex items-center gap-3">
                <div
                  className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
							flex items-center gap-2"
                >
                  <BsFillPersonFill className="h-6 w-6 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
								placeholder:text-gray-500 placeholder:font-normal font-semibold"
                  />
                </div>
                <div
                  className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
							flex items-center gap-2"
                >
                  <IoMdCall className="h-6 w-6 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
								placeholder:text-gray-500 placeholder:font-normal font-semibold"
                  />
                </div>
              </div>
            </>
          )}
          <div
            className={`w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2
					rounded-lg items-center gap-2 ${emailVerifySent ? "hidden" : "flex"} `}
          >
            <HiOutlineMail className="h-6 w-6 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
						placeholder:text-gray-500 placeholder:font-normal font-semibold"
            />
          </div>
          {!registerUser && !emailVerifySent && (
            <div
              className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
						 flex items-center gap-2"
            >
              <LuLock className="h-6 w-6 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
							placeholder:text-gray-500 placeholder:font-normal font-semibold"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </div>
          )}
          {registerUser && !emailVerifySent && (
            <div
              className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
						 flex items-center gap-2"
            >
              <LiaIndustrySolid className="h-6 w-6 text-gray-600" />
              <input
                type="text"
                placeholder="Organization name"
                value={organizationName}
                onChange={(e) => {
                  setOrganizationName(e.target.value);
                }}
                className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
							placeholder:text-gray-500 placeholder:font-normal font-semibold"
              />
            </div>
          )}
          {registerUser && !emailVerifySent && (
            <>
              <div
                className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
						 flex items-center gap-2"
              >
                <BsBuildingFill className="h-6 w-6 text-gray-500" />
                <select
                  value={organizationType}
                  onChange={(e) => {
                    setOrganizationType(e.target.value);
                  }}
                  className="w-full bg-transparent outline-none ring-none text-lg text-gray-900
							placeholder:text-gray-500 placeholder:font-normal font-semibold"
                >
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div
                className="w-full bg-gray-200/50 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
						 flex flex-col gap-2"
              >
                <h1 className="text-md text-gray-800">Select the industry</h1>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 ">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Drone Service Provider");
                        } else {
                          removeIndustryFromList("Drone Service Provider");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">
                      Drone Service Provider
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Construction");
                        } else {
                          removeIndustryFromList("Construction");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Construction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Mining");
                        } else {
                          removeIndustryFromList("Mining");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Mining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Railway");
                        } else {
                          removeIndustryFromList("Railway");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Railway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Tower");
                        } else {
                          removeIndustryFromList("Tower");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Tower</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Windmill");
                        } else {
                          removeIndustryFromList("Windmill");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Windmill</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addIndustryToList("Solar");
                        } else {
                          removeIndustryFromList("Solar");
                        }
                      }}
                    />{" "}
                    <span className="text-md text-gray-900">Solar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-pink-300 focus:accent-pink-500"
                      onChange={(e) => handleOtherCheckbox(e.target.checked)}
                    />{" "}
                    <span className="text-md text-gray-900">Other</span>
                  </div>
                </div>

                {showOtherInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter industry name"
                      value={otherIndustry}
                      onChange={(e) =>
                        handleOtherIndustryChange(e.target.value)
                      }
                      className="w-full bg-white/70 border-[1px] border-gray-700/50 px-3 py-2 rounded-lg
                        outline-none ring-none text-md text-gray-900
                        placeholder:text-gray-500 placeholder:font-normal"
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {!emailVerifySent && (
            <button
              type="submit"
              onClick={(e) => handleValidation(e)}
              className="text-white bg-blue-600 font-mono px-5 py-2 mt-3 text-lg rounded-md"
            >
              {loading ? (
                <span className="loader1" />
              ) : registerUser ? (
                "Request access"
              ) : (
                "Login"
              )}
            </button>
          )}
        </form>

        <div
          className={`flex items-center mt-4 gap-2 ${
            emailVerifySent ? "hidden" : "flex"
          }`}
        >
          <p className="text-md font-normal text-gray-900">
            {registerUser ? "Already have an account ?" : "New user ?"}
          </p>
          <span
            onClick={() => {
              setRegisterUser(!registerUser);
            }}
            className="text-md font-normal cursor-pointer text-blue-500"
          >
            {registerUser ? "Sign in" : "Request access"}
          </span>
        </div>

        {emailVerifySent && (
          <div className="w-full flex flex-col gap-3">
            <img
              src="https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-512.png"
              alt=""
              className="h-[60px] w-[60px] mx-auto"
            />

            <h1 className="text-lg font-semibold text-black text-center">
              Thank you! We&apos;ve sent a{" "}
              <span className="text-blue-600">verification email</span> to your
              inbox. If it doesn&apos;t arrive in 20-30 minutes, or if you
              encounter any issues, please contact our support team.
            </h1>
          </div>
        )}
      </div>

      <ToastContainer />
    </main>
  );
}
