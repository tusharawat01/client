"use-client";

import "./globals.css";
import RootRecoil from "../atoms/recoilWrapper";
import "cesium/Build/Cesium/Widgets/widgets.css";
import SessionProvider from "@/components/SessionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CesiumBaseUrlSetter from "@/components/CesiumBaseUrlSetter";

export const metadata = {
  title: "User Side",
  description: "This is for users",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CesiumBaseUrlSetter />
        <RootRecoil>
          <SessionProvider>{children}</SessionProvider>
          <ToastContainer />
        </RootRecoil>
      </body>
    </html>
  );
}
