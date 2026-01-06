"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowRight } from "react-icons/hi";
import React from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geodesy";
import L from "leaflet";

const customMarker = new L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [30, 46],
  iconAnchor: [14, 46],
});

export default function YourProjectLocations({
  currentProjects,
  setCurrentProjects,
}) {
  const mapRef = useRef(null);
  const [projectCoords, setProjectCoords] = useState([]);

  const getCoordinatesByPlaceName = async (placeName) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=1&appid=cf259dc5444ca0c3f9ef2676b45aff6d`
    );

    if (!response.ok) {
      return {
        latitude: 0,
        longitude: 0,
      };
    }

    const data = await response.json();

    if (data.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
      };
    }

    return {
      latitude: data[0]?.lat,
      longitude: data[0]?.lon,
    };
  };

  const fetchCoordsOfProjects = async (
    currentProject,
    i,
    projectCoordsTemp
  ) => {
    if (currentProject?.coordinates?.latitude) {
      projectCoordsTemp = [
        ...projectCoordsTemp,
        {
          projectName: currentProject?.name,
          type: currentProject?.type,
          latitude: currentProject?.coordinates?.latitude,
          longitude: currentProject?.coordinates?.longitude,
        },
      ];
      if (i + 1 >= currentProjects?.length) {
        setProjectCoords(projectCoordsTemp);
      } else {
        fetchCoordsOfProjects(currentProjects[i + 1], i + 1, projectCoordsTemp);
      }
    } else {
      const { latitude, longitude } = await getCoordinatesByPlaceName(
        currentProject?.projectArea || currentProject?.projectLocation
      );
      projectCoordsTemp = [
        ...projectCoordsTemp,
        {
          projectName: currentProject?.name,
          type: currentProject?.type,
          latitude,
          longitude,
        },
      ];
      if (i + 1 >= currentProjects?.length) {
        setProjectCoords(projectCoordsTemp);
      } else {
        fetchCoordsOfProjects(currentProjects[i + 1], i + 1, projectCoordsTemp);
      }
    }
  };

  // console.log(projectCoords);

  useEffect(() => {
    if (projectCoords?.length > 0) {
      mapRef.current.flyTo([
        projectCoords?.[0].latitude,
        projectCoords?.[0].longitude,
      ]);
    }
  }, [projectCoords]);

  useEffect(() => {
    if (currentProjects?.length > 0) {
      let projectCoordsTemp = [];
      fetchCoordsOfProjects(currentProjects[0], 0, projectCoordsTemp);
    }
  }, [currentProjects]);

  return (
    <div className="bg-white md:p-4 p-2 flex flex-col rounded-lg shadow-md">
      <div className="w-full h-[200px]">
        <MapContainer
          center={[12.977496613847645, 79.85122475069794]}
          zoom={15}
          ref={mapRef}
          className="h-full z-10 w-full"
          maxZoom={30}
        >
          {projectCoords?.map((projectCoord, k) => (
            <Marker
              key={k}
              position={[projectCoord?.latitude, projectCoord?.longitude]}
              icon={customMarker}
            >
              <Popup>{projectCoord?.projectName}</Popup>
              <Tooltip>{projectCoord?.type}</Tooltip>
            </Marker>
          ))}

          <LayersControl position="bottomleft">
            <LayersControl.Overlay checked name="Vector Map">
              <TileLayer
                url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                maxZoom={20}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Mapbox Map">
              <TileLayer
                url={`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbGViNGxneGIxNXk4M3FtZXN2bmlybnZ2In0.xH_17wx1jpV5Kfw7ntyAbQ`}
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                maxZoom={20}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Satellite Map">
              <TileLayer
                url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`}
                attribution='&copy; <a href="Esri &mdash">GIS User Community</a> contributors'
                maxZoom={20}
              />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}
