"use client";

import ClientInfo from "../../../../components/ClientDashboardComponents/ClientInfo";
import { sideBarExtendState } from "../../../../atoms/userAtom";
import { useRecoilState } from "recoil";

export default function Home({ params }) {
  const [sideBarExtend, setSideBarExtend] = useRecoilState(sideBarExtendState);

  return (
    <main
      className={`h-full ${
        sideBarExtend ? "sm:w-[83%] xs:w-[86%] w-[100%]" : "w-[100%]"
      }  bg-gray-50 pb-5 overflow-y-auto`}
    >
      <ClientInfo clientId={params.clientId} />
    </main>
  );
}
