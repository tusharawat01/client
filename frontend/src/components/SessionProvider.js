"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { currentUserState } from "@/atoms/userAtom";
import { verifySessionRoute } from "@/utils/ApiRoutes";
import { MdExplore } from "react-icons/md";

const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const cookies = new Cookies();

  useEffect(() => {
    if (pathname.startsWith("/explore")) {
      setLoading(false);
      return;
    }
    if (pathname.startsWith("/submitRequest")) {
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const auth = cookies.get("auth");

        if (!auth) {
          if (pathname !== "/") {
            router.push("/");
          }
          setLoading(false);
          return;
        }

        const response = await axios.get(verifySessionRoute, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          withCredentials: true,
        });

        const { status, user } = response.data;

        if (status) {
          setCurrentUser(user);
          console.log("Auth present");

          if (pathname === "/") {
            localStorage.setItem("currentTab", "Dashboard");
            router.push("/clientDashboard/dashboard");
          }
        } else {
          toast.error("Session Expired, Login Again!!");
          cookies.remove("auth");

          if (pathname !== "/" || pathname !== "/explore") {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Session verification error:", error);
        cookies.remove("auth");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router, pathname]);

  if (loading && pathname !== "/") {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default SessionProvider;
