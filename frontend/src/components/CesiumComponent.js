"use client";

import {
  Viewer,
  Entity,
  CameraFlyTo,
  ModelGraphics,
  CameraLookAt,
} from "resium";
import { Cartesian3, Ion } from "cesium";
import * as Cesium from "cesium";
import { useRef, useEffect, useMemo } from "react";
import { host } from "../utils/ApiRoutes";
// import Script from "next/script";
import "cesium/Build/Cesium/Widgets/widgets.css";

const DEFAULT_POSITION = {
  longitude: -74.0707383,
  latitude: 40.7117244,
  altitude: 0,
};

const DEFAULT_CAMERA_HEIGHT = 200;
const DEFAULT_SCALE = 1.0;

// import Head from "next/head";
// const kmlFile = 'https://ik.imagekit.io/d3kzbpbila/KML/lambo_5QcOqmhLk.glb?updatedAt=1719603333611'
// const kmlFile = 'http://192.168.1.7:3333/3dmodels/66770bee963361016bf4896f/gNUx7BrhD2-lambo.glb'
// const kmlFile = "/audi.glb";
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 0);
// const cameraPosition = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 200);
// const offset = Cartesian3.fromDegrees(0, 0, 0);

Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

export default function CesiumComponent({ currentStore, metadata }) {
  console.log("CesiumComponent - currentStore:", currentStore);
  console.log("CesiumComponent - metadata:", metadata);

  const viewerRef = useRef(null);

  const { position, cameraPosition, scale } = useMemo(() => {
    let longitude = DEFAULT_POSITION.longitude;
    let latitude = DEFAULT_POSITION.latitude;
    let altitude = DEFAULT_POSITION.altitude;
    let modelScale = DEFAULT_SCALE;

    // Use metadata if available and valid
    if (metadata) {
      const parsedLon = parseFloat(metadata.longitude);
      const parsedLat = parseFloat(metadata.latitude);
      const parsedAlt = parseFloat(metadata.altitude);
      const parsedScale = parseFloat(metadata.scale);

      if (!isNaN(parsedLon)) longitude = parsedLon;
      if (!isNaN(parsedLat)) latitude = parsedLat;
      if (!isNaN(parsedAlt)) altitude = parsedAlt;
      if (!isNaN(parsedScale) && parsedScale > 0) modelScale = parsedScale;
    }

    const modelPosition = Cartesian3.fromDegrees(longitude, latitude, altitude);
    const cameraPos = Cartesian3.fromDegrees(
      longitude,
      latitude,
      altitude + DEFAULT_CAMERA_HEIGHT
    );

    console.log("Calculated position:", {
      longitude,
      latitude,
      altitude,
      scale: modelScale,
    });

    return {
      position: modelPosition,
      cameraPosition: cameraPos,
      scale: modelScale,
    };
  }, [metadata]);

  return (
    <>
      <Viewer
        ref={viewerRef}
        full
        sceneModePicker={true}
        // selectionIndicator={false}
        navigationHelpButton={true}
        infoBox={false}
        animation={false}
        timeline={false}
        baseLayerPicker={true}
        geocoder={true}
        homeButton={true}
        fullscreenButton={true}
      >
        {currentStore && (
          <>
            <Entity position={position}>
              <ModelGraphics
                uri={currentStore}
                scale={scale}
                minimumPixelSize={64}
                show={true}
                maximumScale={1000}
                runAnimations={true}
                onReady={() =>
                  console.log("Model is ready at position : ", position)
                }
              />
            </Entity>

            <CameraFlyTo destination={cameraPosition} duration={2} />
          </>
        )}
      </Viewer>
    </>
  );
}
