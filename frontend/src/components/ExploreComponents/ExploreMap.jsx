// "use client";

// import { useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// export default function ExploreMap({
//   geojson,
//   onPolygonChange,
//   manualLocation,
// }) {
//   const mapRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current) return;

//     const map = new mapboxgl.Map({
//       container: containerRef.current,
//       style: "mapbox://styles/mapbox/satellite-streets-v12",
//       center: [0, 20],
//       zoom: 1.5,
//     });

//     mapRef.current = map;

//     return () => map.remove();
//   }, []);

//   // Fly to manual location
//   useEffect(() => {
//     if (!manualLocation || !mapRef.current) return;

//     const { latitude, longitude } = manualLocation;
//     if (!latitude || !longitude) return;

//     const map = mapRef.current;
//     map.flyTo({
//       center: [longitude, latitude],
//       zoom: 15,
//     });
//   }, [manualLocation]);

//   // Render KML-converted GeoJSON
//   useEffect(() => {
//     if (!geojson || !mapRef.current) return;
//     const map = mapRef.current;

//     // Wait until the style is fully loaded
//     if (!map.isStyleLoaded()) {
//       map.once("load", () => renderGeoJSON(map, geojson));
//     } else {
//       renderGeoJSON(map, geojson);
//     }
//   }, [geojson]);

//   function renderGeoJSON(map, geojson) {
//     // If source exists, just update
//     if (map.getSource("kml-source")) {
//       map.getSource("kml-source").setData(geojson);
//     } else {
//       map.addSource("kml-source", {
//         type: "geojson",
//         data: geojson,
//       });

//       // Add layers
//       map.addLayer({
//         id: "kml-line-layer",
//         type: "line",
//         source: "kml-source",
//         paint: { "line-color": "#FF0000", "line-width": 2 },
//         filter: ["==", "$type", "LineString"],
//       });

//       map.addLayer({
//         id: "kml-fill-layer",
//         type: "fill",
//         source: "kml-source",
//         paint: { "fill-color": "#FF0000", "fill-opacity": 0.3 },
//         filter: ["==", "$type", "Polygon"],
//       });

//       map.addLayer({
//         id: "kml-point-layer",
//         type: "circle",
//         source: "kml-source",
//         paint: {
//           "circle-radius": 5,
//           "circle-color": "#00FF00",
//           "circle-stroke-color": "#000",
//           "circle-stroke-width": 1,
//         },
//         filter: ["==", "$type", "Point"],
//       });
//     }

//     // Fit map bounds safely
//     const bounds = new mapboxgl.LngLatBounds();
//     geojson.features.forEach((feature) => {
//       if (!feature.geometry || !feature.geometry.coordinates) return;

//       const coords = feature.geometry.coordinates;

//       if (feature.geometry.type === "Point") {
//         bounds.extend(coords);
//       } else if (feature.geometry.type === "LineString") {
//         coords.forEach((c) => bounds.extend(c));
//       } else if (feature.geometry.type === "Polygon") {
//         coords.flat().forEach((c) => bounds.extend(c));
//       }
//     });

//     if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 50 });
//   }

//   return <div ref={containerRef} className="w-full h-full" />;
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// export default function ExploreMap({
//   geojson,
//   onPolygonChange,
//   manualLocation,
//   isDrawing,
//   onDrawComplete,
//   drawnPolygon,
// }) {
//   const mapRef = useRef(null);
//   const containerRef = useRef(null);
//   const [drawingCoords, setDrawingCoords] = useState([]);
//   const drawingCoordsRef = useRef([]);
//   const markersRef = useRef([]);

//   // Keep ref in sync with state
//   useEffect(() => {
//     drawingCoordsRef.current = drawingCoords;
//   }, [drawingCoords]);

//   useEffect(() => {
//     if (mapRef.current) return;

//     const map = new mapboxgl.Map({
//       container: containerRef.current,
//       style: "mapbox://styles/mapbox/satellite-streets-v12",
//       center: [0, 20],
//       zoom: 1.5,
//     });

//     mapRef.current = map;

//     return () => map.remove();
//   }, []);

//   // Fly to manual location
//   useEffect(() => {
//     if (!manualLocation || !mapRef.current) return;

//     const { latitude, longitude } = manualLocation;
//     if (!latitude || !longitude) return;

//     const map = mapRef.current;
//     map.flyTo({
//       center: [longitude, latitude],
//       zoom: 15,
//     });
//   }, [manualLocation]);

//   // Render KML-converted GeoJSON
//   useEffect(() => {
//     if (!geojson || !mapRef.current) return;
//     const map = mapRef.current;

//     if (!map.isStyleLoaded()) {
//       map.once("load", () => renderGeoJSON(map, geojson));
//     } else {
//       renderGeoJSON(map, geojson);
//     }
//   }, [geojson]);

//   // Handle drawing mode
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     if (isDrawing) {
//       map.getCanvas().style.cursor = "crosshair";

//       const handleClick = (e) => {
//         const coords = [e.lngLat.lng, e.lngLat.lat];
//         setDrawingCoords((prev) => [...prev, coords]);

//         // Add marker
//         const marker = new mapboxgl.Marker({ color: "#00FF00" })
//           .setLngLat(coords)
//           .addTo(map);
//         markersRef.current.push(marker);
//       };

//       const handleDblClick = (e) => {
//         e.preventDefault();

//         const currentCoords = drawingCoordsRef.current;

//         if (currentCoords.length >= 3) {
//           // Complete the polygon
//           onDrawComplete([...currentCoords]);

//           // Clear markers and drawing state
//           markersRef.current.forEach((m) => m.remove());
//           markersRef.current = [];
//           setDrawingCoords([]);
//         }
//       };

//       map.on("click", handleClick);
//       map.on("dblclick", handleDblClick);

//       return () => {
//         map.off("click", handleClick);
//         map.off("dblclick", handleDblClick);
//         map.getCanvas().style.cursor = "";
//       };
//     } else {
//       // Clear drawing state when exiting draw mode
//       markersRef.current.forEach((m) => m.remove());
//       markersRef.current = [];
//       setDrawingCoords([]);
//       map.getCanvas().style.cursor = "";
//     }
//   }, [isDrawing, onDrawComplete]);

//   // Render drawing polygon in progress
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map || !map.isStyleLoaded()) return;

//     if (drawingCoords.length > 0) {
//       const geojsonData = {
//         type: "Feature",
//         geometry: {
//           type: drawingCoords.length > 2 ? "Polygon" : "LineString",
//           coordinates:
//             drawingCoords.length > 2
//               ? [[...drawingCoords, drawingCoords[0]]]
//               : drawingCoords,
//         },
//       };

//       if (map.getSource("drawing-source")) {
//         map.getSource("drawing-source").setData(geojsonData);
//       } else {
//         map.addSource("drawing-source", {
//           type: "geojson",
//           data: geojsonData,
//         });

//         map.addLayer({
//           id: "drawing-line",
//           type: "line",
//           source: "drawing-source",
//           paint: {
//             "line-color": "#00FF00",
//             "line-width": 2,
//             "line-dasharray": [2, 2],
//           },
//         });

//         map.addLayer({
//           id: "drawing-fill",
//           type: "fill",
//           source: "drawing-source",
//           paint: {
//             "fill-color": "#00FF00",
//             "fill-opacity": 0.2,
//           },
//         });
//       }
//     } else {
//       if (map.getSource("drawing-source")) {
//         if (map.getLayer("drawing-line")) map.removeLayer("drawing-line");
//         if (map.getLayer("drawing-fill")) map.removeLayer("drawing-fill");
//         map.removeSource("drawing-source");
//       }
//     }
//   }, [drawingCoords]);

//   // Render completed drawn polygon - FORCE UPDATE
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     // Wait a bit to ensure map is ready
//     const timeoutId = setTimeout(() => {
//       if (!map.isStyleLoaded()) return;

//       const updatePolygon = () => {
//         // Remove existing layers
//         try {
//           if (map.getLayer("drawn-polygon-fill"))
//             map.removeLayer("drawn-polygon-fill");
//         } catch (e) {}
//         try {
//           if (map.getLayer("drawn-polygon-line"))
//             map.removeLayer("drawn-polygon-line");
//         } catch (e) {}
//         try {
//           if (map.getSource("drawn-polygon-source"))
//             map.removeSource("drawn-polygon-source");
//         } catch (e) {}

//         // If no polygon, we're done
//         if (!drawnPolygon || drawnPolygon.length === 0) {
//           return;
//         }

//         // Add the polygon
//         const geojsonData = {
//           type: "Feature",
//           geometry: {
//             type: "Polygon",
//             coordinates: [[...drawnPolygon, drawnPolygon[0]]],
//           },
//         };

//         try {
//           map.addSource("drawn-polygon-source", {
//             type: "geojson",
//             data: geojsonData,
//           });

//           map.addLayer({
//             id: "drawn-polygon-fill",
//             type: "fill",
//             source: "drawn-polygon-source",
//             paint: {
//               "fill-color": "#0080FF",
//               "fill-opacity": 0.5,
//             },
//           });

//           map.addLayer({
//             id: "drawn-polygon-line",
//             type: "line",
//             source: "drawn-polygon-source",
//             paint: {
//               "line-color": "#0080FF",
//               "line-width": 4,
//             },
//           });

//           console.log("Polygon rendered with", drawnPolygon.length, "points");
//         } catch (e) {
//           console.error("Error adding polygon:", e);
//         }
//       };

//       updatePolygon();
//     }, 100);

//     return () => clearTimeout(timeoutId);
//   }, [drawnPolygon]);

//   function renderGeoJSON(map, geojson) {
//     if (map.getSource("kml-source")) {
//       map.getSource("kml-source").setData(geojson);
//     } else {
//       map.addSource("kml-source", {
//         type: "geojson",
//         data: geojson,
//       });

//       map.addLayer({
//         id: "kml-line-layer",
//         type: "line",
//         source: "kml-source",
//         paint: { "line-color": "#FF0000", "line-width": 2 },
//         filter: ["==", "$type", "LineString"],
//       });

//       map.addLayer({
//         id: "kml-fill-layer",
//         type: "fill",
//         source: "kml-source",
//         paint: { "fill-color": "#FF0000", "fill-opacity": 0.3 },
//         filter: ["==", "$type", "Polygon"],
//       });

//       map.addLayer({
//         id: "kml-point-layer",
//         type: "circle",
//         source: "kml-source",
//         paint: {
//           "circle-radius": 5,
//           "circle-color": "#00FF00",
//           "circle-stroke-color": "#000",
//           "circle-stroke-width": 1,
//         },
//         filter: ["==", "$type", "Point"],
//       });
//     }

//     const bounds = new mapboxgl.LngLatBounds();
//     geojson.features.forEach((feature) => {
//       if (!feature.geometry || !feature.geometry.coordinates) return;

//       const coords = feature.geometry.coordinates;

//       if (feature.geometry.type === "Point") {
//         bounds.extend(coords);
//       } else if (feature.geometry.type === "LineString") {
//         coords.forEach((c) => bounds.extend(c));
//       } else if (feature.geometry.type === "Polygon") {
//         coords.flat().forEach((c) => bounds.extend(c));
//       }
//     });

//     if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 50 });
//   }

//   return (
//     <div className="relative w-full h-full">
//       <div ref={containerRef} className="w-full h-full" />
//       {isDrawing && (
//         <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
//           Click to add points ({drawingCoords.length}) • Double-click to finish
//           (min 3 points)
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function ExploreMap({
  geojson,
  onPolygonChange,
  manualLocation,
  isDrawing,
  onDrawComplete,
  drawnPolygon,
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [drawingCoords, setDrawingCoords] = useState([]);
  const drawingCoordsRef = useRef([]);
  const markersRef = useRef([]);

  // Keep ref in sync with state
  useEffect(() => {
    drawingCoordsRef.current = drawingCoords;
  }, [drawingCoords]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Fly to manual location
  useEffect(() => {
    if (!manualLocation || !mapRef.current) return;

    const { latitude, longitude } = manualLocation;
    if (!latitude || !longitude) return;

    const map = mapRef.current;
    map.flyTo({
      center: [longitude, latitude],
      zoom: 15,
    });
  }, [manualLocation]);

  // Render KML-converted GeoJSON
  useEffect(() => {
    if (!geojson || !mapRef.current) return;
    const map = mapRef.current;

    if (!map.isStyleLoaded()) {
      map.once("load", () => renderGeoJSON(map, geojson));
    } else {
      renderGeoJSON(map, geojson);
    }
  }, [geojson]);

  // Handle drawing mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (isDrawing) {
      map.getCanvas().style.cursor = "crosshair";

      const handleClick = (e) => {
        const coords = [e.lngLat.lng, e.lngLat.lat];
        setDrawingCoords((prev) => [...prev, coords]);

        // Add marker
        const marker = new mapboxgl.Marker({ color: "#00FF00" })
          .setLngLat(coords)
          .addTo(map);
        markersRef.current.push(marker);
      };

      const handleDblClick = (e) => {
        e.preventDefault();

        const currentCoords = drawingCoordsRef.current;

        if (currentCoords.length >= 3) {
          // Complete the polygon
          onDrawComplete([...currentCoords]);

          // Clear markers and drawing state
          markersRef.current.forEach((m) => m.remove());
          markersRef.current = [];
          setDrawingCoords([]);
        }
      };

      map.on("click", handleClick);
      map.on("dblclick", handleDblClick);

      return () => {
        map.off("click", handleClick);
        map.off("dblclick", handleDblClick);
        map.getCanvas().style.cursor = "";
      };
    } else {
      // Clear drawing state when exiting draw mode
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setDrawingCoords([]);
      map.getCanvas().style.cursor = "";
    }
  }, [isDrawing, onDrawComplete]);

  // Render drawing polygon in progress
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (drawingCoords.length > 0) {
      const geojsonData = {
        type: "Feature",
        geometry: {
          type: drawingCoords.length > 2 ? "Polygon" : "LineString",
          coordinates:
            drawingCoords.length > 2
              ? [[...drawingCoords, drawingCoords[0]]]
              : drawingCoords,
        },
      };

      if (map.getSource("drawing-source")) {
        map.getSource("drawing-source").setData(geojsonData);
      } else {
        map.addSource("drawing-source", {
          type: "geojson",
          data: geojsonData,
        });

        map.addLayer({
          id: "drawing-line",
          type: "line",
          source: "drawing-source",
          paint: {
            "line-color": "#00FF00",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });

        map.addLayer({
          id: "drawing-fill",
          type: "fill",
          source: "drawing-source",
          paint: {
            "fill-color": "#00FF00",
            "fill-opacity": 0.2,
          },
        });
      }
    } else {
      if (map.getSource("drawing-source")) {
        if (map.getLayer("drawing-line")) map.removeLayer("drawing-line");
        if (map.getLayer("drawing-fill")) map.removeLayer("drawing-fill");
        map.removeSource("drawing-source");
      }
    }
  }, [drawingCoords]);

  // Render completed drawn polygon - FORCE UPDATE
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const renderPolygon = () => {
      if (!map.isStyleLoaded()) {
        setTimeout(renderPolygon, 100);
        return;
      }
      renderDrawnPolygon(map);
    };

    // Initial delay to let map settle
    const timeoutId = setTimeout(renderPolygon, 200);

    return () => clearTimeout(timeoutId);
  }, [drawnPolygon]);

  const renderDrawnPolygon = (map) => {
    // Remove existing layers
    try {
      if (map.getLayer("drawn-polygon-fill"))
        map.removeLayer("drawn-polygon-fill");
    } catch (e) {}
    try {
      if (map.getLayer("drawn-polygon-line"))
        map.removeLayer("drawn-polygon-line");
    } catch (e) {}
    try {
      if (map.getSource("drawn-polygon-source"))
        map.removeSource("drawn-polygon-source");
    } catch (e) {}

    // If no polygon, we're done
    if (!drawnPolygon || drawnPolygon.length === 0) {
      console.log("No polygon to render");
      return;
    }

    console.log("Rendering polygon with coordinates:", drawnPolygon);

    // Add the polygon
    const geojsonData = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[...drawnPolygon, drawnPolygon[0]]],
      },
    };

    try {
      map.addSource("drawn-polygon-source", {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: "drawn-polygon-fill",
        type: "fill",
        source: "drawn-polygon-source",
        paint: {
          "fill-color": "#0080FF",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "drawn-polygon-line",
        type: "line",
        source: "drawn-polygon-source",
        paint: {
          "line-color": "#0080FF",
          "line-width": 4,
        },
      });

      console.log("✓ Polygon layers added successfully");

      // Fit map to polygon bounds AFTER layers are added
      setTimeout(() => {
        const bounds = new mapboxgl.LngLatBounds();
        drawnPolygon.forEach((coord) => {
          bounds.extend(coord);
        });

        if (!bounds.isEmpty()) {
          console.log("Fitting bounds to polygon");
          map.fitBounds(bounds, { padding: 100, maxZoom: 16 });
        }
      }, 300);
    } catch (e) {
      console.error("Error adding polygon:", e);
    }
  };

  function renderGeoJSON(map, geojson) {
    if (map.getSource("kml-source")) {
      map.getSource("kml-source").setData(geojson);
    } else {
      map.addSource("kml-source", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "kml-line-layer",
        type: "line",
        source: "kml-source",
        paint: { "line-color": "#FF0000", "line-width": 2 },
        filter: ["==", "$type", "LineString"],
      });

      map.addLayer({
        id: "kml-fill-layer",
        type: "fill",
        source: "kml-source",
        paint: { "fill-color": "#FF0000", "fill-opacity": 0.3 },
        filter: ["==", "$type", "Polygon"],
      });

      map.addLayer({
        id: "kml-point-layer",
        type: "circle",
        source: "kml-source",
        paint: {
          "circle-radius": 5,
          "circle-color": "#00FF00",
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1,
        },
        filter: ["==", "$type", "Point"],
      });
    }

    const bounds = new mapboxgl.LngLatBounds();
    geojson.features.forEach((feature) => {
      if (!feature.geometry || !feature.geometry.coordinates) return;

      const coords = feature.geometry.coordinates;

      if (feature.geometry.type === "Point") {
        bounds.extend(coords);
      } else if (feature.geometry.type === "LineString") {
        coords.forEach((c) => bounds.extend(c));
      } else if (feature.geometry.type === "Polygon") {
        coords.flat().forEach((c) => bounds.extend(c));
      }
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 50 });
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isDrawing && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          Click to add points ({drawingCoords.length}) • Double-click to finish
          (min 3 points)
        </div>
      )}
    </div>
  );
}
