"use client";

import { RecoilRoot } from "recoil";

const RootRecoil = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RootRecoil;