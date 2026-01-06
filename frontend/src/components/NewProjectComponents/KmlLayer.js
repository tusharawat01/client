// KmlLayer.js
"use client";
import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "react-leaflet-kml";

const KmlLayer = ({ kmlBase64 }) => {
  const map = useMap();
  const layerRef = useRef(null);

  if (layerRef.current) {
    map.removeLayer(layerRef.current);
  }
  // const [kmlLayer, setKmlLayer] = useState(null);

  useEffect(() => {
    if (kmlBase64) {
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmlBase64, "text/xml");
      const layer = new L.KML(kml);
      layer.addTo(map);
      // setKmlLayer(layer);

      layerRef.current = layer;
      console.log(layer);

      // return () => {
      //   if (kmlLayer) {
      //     map.removeLayer(kmlLayer);
      //   }
      // };

      return () => {
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }
      };
    }
  }, [kmlBase64, map]);

  return null;
};

export default KmlLayer;
