"use client";

import { useEffect } from "react";

export default function CesiumBaseUrlSetter() {
  useEffect(() => {
    window.CESIUM_BASE_URL = "/cesium";
  }, []);

  return null;
}
