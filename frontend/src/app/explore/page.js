// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ExploreMap from "@/components/ExploreComponents/ExploreMap";
// import * as toGeoJSON from "@tmcw/togeojson";

// export default function ExplorePage() {
//   const router = useRouter();

//   const [geojson, setGeojson] = useState(null);
//   const [polygon, setPolygon] = useState(null);
//   const [manualLocation, setManualLocation] = useState({
//     latitude: "",
//     longitude: "",
//   });
//   const [searchLocation, setSearchLocation] = useState("");
//   const [selectedData, setSelectedData] = useState([]);
//   const [kmlFileName, setKmlFileName] = useState("");
//   const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawnPolygon, setDrawnPolygon] = useState(null);

//   const dataOptions = [
//     "Orthomosaic",
//     "Digital Elevation Model",
//     "Digital Surface Model",
//     "Digital Terrain Model",
//     "Ground Control Point",
//     "Spot Levels",
//     "Contours",
//     "Cad Drawing",
//     "3D model",
//     "Point Cloud",
//     "Drawing file",
//     "Video",
//     "Raw Photo",
//     "Inspection Report",
//     "Processed Data with Analytics",
//     "Other",
//   ];

//   // Load saved KML and drawn polygon
//   useEffect(() => {
//     const saved = localStorage.getItem("exploreKML");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setGeojson(parsed.geojson || null);
//       setKmlFileName(parsed.name || "");
//     }

//     const savedData = localStorage.getItem("exploreData");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       if (parsed.drawnPolygon) {
//         setDrawnPolygon(parsed.drawnPolygon);
//       }
//       // Load manual location into input fields
//       if (
//         parsed.manualLocation &&
//         parsed.manualLocation.latitude &&
//         parsed.manualLocation.longitude
//       ) {
//         setManualLocation({
//           latitude: parsed.manualLocation.latitude,
//           longitude: parsed.manualLocation.longitude,
//         });
//       }
//       if (parsed.selectedData) {
//         setSelectedData(parsed.selectedData);
//       }
//     }
//   }, []);

//   // Upload KML
//   const handleKMLUpload = (file) => {
//     if (!file) return;

//     setKmlFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const parser = new DOMParser();
//       const kmlDoc = parser.parseFromString(e.target.result, "text/xml");
//       const converted = toGeoJSON.kml(kmlDoc);

//       setGeojson(converted);
//       localStorage.setItem(
//         "exploreKML",
//         JSON.stringify({ name: file.name, geojson: converted })
//       );
//     };
//     reader.readAsText(file);
//   };

//   const removeKML = () => {
//     setGeojson(null);
//     setKmlFileName("");
//     localStorage.removeItem("exploreKML");
//     setManualLocation({ latitude: 0, longitude: 20 });
//   };

//   // Search
//   const handleSearchLocation = async () => {
//     if (!searchLocation) return;

//     const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
//     const res = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         searchLocation
//       )}.json?access_token=${token}`
//     );
//     const data = await res.json();

//     if (data.features?.length) {
//       const [lng, lat] = data.features[0].center;
//       setManualLocation({ latitude: lat, longitude: lng });
//     }
//   };

//   // Lat/Lng
//   const handleLatLngSubmit = () => {
//     if (!manualLocation.latitude || !manualLocation.longitude) return;
//     setManualLocation({
//       latitude: parseFloat(manualLocation.latitude),
//       longitude: parseFloat(manualLocation.longitude),
//     });
//   };

//   // Checkbox
//   const handleCheckboxChange = (value) => {
//     setSelectedData((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   // Toggle drawing mode
//   const toggleDrawing = () => {
//     setIsDrawing(!isDrawing);
//   };

//   // Clear drawn polygon
//   const clearDrawnPolygon = () => {
//     setDrawnPolygon(null);
//   };

//   // Check if location is set
//   const isLocationSet = () => {
//     return (
//       geojson ||
//       (manualLocation.latitude && manualLocation.longitude) ||
//       searchLocation
//     );
//   };

//   // Submit with validation
//   const handleSubmit = () => {
//     const hasLocation = isLocationSet();
//     const hasData = selectedData.length > 0;

//     if (!hasLocation || !hasData) {
//       alert("Location and data selection are required");
//       return;
//     }

//     localStorage.setItem(
//       "exploreData",
//       JSON.stringify({
//         geojson,
//         polygon,
//         manualLocation,
//         selectedData,
//         kmlFileName,
//         drawnPolygon,
//       })
//     );

//     router.push("/");
//   };

//   return (
//     <div className="w-screen h-screen relative overflow-hidden">
//       {/* LEFT PANEL */}
//       <div className="absolute top-4 left-4 z-50 w-96 h-[90vh] bg-black/50 backdrop-blur-md rounded-xl flex flex-col text-white">
//         {/* SCROLL CONTENT */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
//           {/* Search */}
//           <div>
//             <h2 className="font-semibold mb-1">Search Location</h2>
//             <input
//               value={searchLocation}
//               onChange={(e) => setSearchLocation(e.target.value)}
//               placeholder="City, State"
//               disabled={!!geojson}
//               className="w-full p-2 rounded bg-white/20"
//             />
//             <button
//               onClick={handleSearchLocation}
//               disabled={!!geojson}
//               className="w-full mt-2 bg-blue-600 py-1 rounded"
//             >
//               Search
//             </button>
//           </div>

//           {/* Lat Lng */}
//           <div>
//             <h2 className="font-semibold mb-1">Manual Lat / Lng</h2>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Latitude"
//                 value={manualLocation.latitude}
//                 onChange={(e) =>
//                   setManualLocation({
//                     ...manualLocation,
//                     latitude: e.target.value,
//                   })
//                 }
//                 disabled={!!geojson}
//                 className="w-1/2 p-2 rounded bg-white/20"
//               />
//               <input
//                 type="number"
//                 placeholder="Longitude"
//                 value={manualLocation.longitude}
//                 onChange={(e) =>
//                   setManualLocation({
//                     ...manualLocation,
//                     longitude: e.target.value,
//                   })
//                 }
//                 disabled={!!geojson}
//                 className="w-1/2 p-2 rounded bg-white/20"
//               />
//             </div>
//             <button
//               onClick={handleLatLngSubmit}
//               disabled={!!geojson}
//               className="w-full mt-2 bg-blue-600 py-1 rounded"
//             >
//               Set Location
//             </button>
//           </div>

//           {/* Draw Polygon - Only show if location is set */}
//           {isLocationSet() && (
//             <div>
//               <h2 className="font-semibold mb-1">Draw Area</h2>
//               <button
//                 onClick={toggleDrawing}
//                 className={`w-full py-2 rounded font-semibold ${
//                   isDrawing ? "bg-red-600" : "bg-purple-600"
//                 }`}
//               >
//                 {isDrawing ? "Cancel Drawing" : "Draw Polygon"}
//               </button>

//               {drawnPolygon && (
//                 <div className="mt-2 bg-green-600/30 border border-green-500 p-2 rounded">
//                   <span className="text-sm font-semibold">
//                     ✓ Polygon drawn ({drawnPolygon.length} points)
//                   </span>
//                   <button
//                     onClick={clearDrawnPolygon}
//                     className="ml-2 text-red-400 text-sm underline"
//                   >
//                     Clear
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* KML */}

//           <div>
//             <h2 className="font-semibold mb-1">Upload KML</h2>
//             <input
//               type="file"
//               accept=".kml"
//               onChange={(e) => handleKMLUpload(e.target.files[0])}
//               disabled={searchLocation || manualLocation}
//             />

//             {kmlFileName && (
//               <div className="mt-2 flex justify-between bg-white/10 p-2 rounded">
//                 <span className="text-sm truncate">{kmlFileName}</span>
//                 <button onClick={removeKML} className="text-red-400 text-sm">
//                   Remove
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Data Needed */}
//           <div>
//             <button
//               onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
//               className="w-full flex justify-between bg-white/10 px-3 py-2 rounded font-semibold"
//             >
//               Data Needed
//               <span>{dataDropdownOpen ? "▲" : "▼"}</span>
//             </button>

//             {dataDropdownOpen && (
//               <div className="mt-2 space-y-1">
//                 {dataOptions.map((opt) => (
//                   <label key={opt} className="flex gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={selectedData.includes(opt)}
//                       onChange={() => handleCheckboxChange(opt)}
//                     />
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* FIXED SUBMIT */}
//         <div className="p-4 border-t border-white/20">
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-green-600 py-2 rounded font-semibold"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       {/* MAP */}
//       <ExploreMap
//         geojson={geojson}
//         onPolygonChange={setPolygon}
//         manualLocation={manualLocation}
//         isDrawing={isDrawing}
//         onDrawComplete={(coords) => {
//           setDrawnPolygon(coords);
//           setIsDrawing(false);
//         }}
//         drawnPolygon={drawnPolygon}
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ExploreMap from "@/components/ExploreComponents/ExploreMap";
// import * as toGeoJSON from "@tmcw/togeojson";

// export default function ExplorePage() {
//   const router = useRouter();

//   const [geojson, setGeojson] = useState(null);
//   const [polygon, setPolygon] = useState(null);
//   const [manualLocation, setManualLocation] = useState({
//     latitude: "",
//     longitude: "",
//   });
//   const [searchLocation, setSearchLocation] = useState("");
//   const [selectedData, setSelectedData] = useState([]);
//   const [kmlFileName, setKmlFileName] = useState("");
//   const [manualDropdownOpen, setManualDropdownOpen] = useState(false);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawnPolygon, setDrawnPolygon] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1); // 1 = location, 2 = data

//   const dataOptions = [
//     "Orthomosaic",
//     "Digital Elevation Model",
//     "Digital Surface Model",
//     "Digital Terrain Model",
//     "Ground Control Point",
//     "Spot Levels",
//     "Contours",
//     "Cad Drawing",
//     "3D model",
//     "Point Cloud",
//     "Drawing file",
//     "Video",
//     "Raw Photo",
//     "Inspection Report",
//     "Processed Data with Analytics",
//     "Other",
//   ];

//   // Check if manual location or search location is set
//   const isManualOrSearchSet = () => {
//     return (
//       (manualLocation.latitude && manualLocation.longitude) || searchLocation
//     );
//   };

//   // Check if location step is complete
//   const isLocationStepComplete = () => {
//     return isManualOrSearchSet() || !!geojson;
//   };

//   // Check if form is valid for submission
//   const isFormValid = () => {
//     const hasLocation = isManualOrSearchSet() || !!geojson;
//     const hasData = selectedData.length > 0;
//     return hasLocation && hasData;
//   };

//   // Load saved KML and drawn polygon
//   useEffect(() => {
//     const saved = localStorage.getItem("exploreKML");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setGeojson(parsed.geojson || null);
//       setKmlFileName(parsed.name || "");
//     }

//     const savedData = localStorage.getItem("exploreData");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       if (parsed.drawnPolygon) {
//         setDrawnPolygon(parsed.drawnPolygon);
//       }
//       if (
//         parsed.manualLocation &&
//         parsed.manualLocation.latitude &&
//         parsed.manualLocation.longitude
//       ) {
//         setManualLocation({
//           latitude: parsed.manualLocation.latitude,
//           longitude: parsed.manualLocation.longitude,
//         });
//       }
//       if (parsed.selectedData) {
//         setSelectedData(parsed.selectedData);
//       }
//     }
//   }, []);

//   // Upload KML
//   const handleKMLUpload = (file) => {
//     if (!file) return;

//     setKmlFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const parser = new DOMParser();
//       const kmlDoc = parser.parseFromString(e.target.result, "text/xml");
//       const converted = toGeoJSON.kml(kmlDoc);

//       setGeojson(converted);
//       localStorage.setItem(
//         "exploreKML",
//         JSON.stringify({ name: file.name, geojson: converted })
//       );
//     };
//     reader.readAsText(file);
//   };

//   const removeKML = () => {
//     setGeojson(null);
//     setKmlFileName("");
//     localStorage.removeItem("exploreKML");
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   // Search
//   const handleSearchLocation = async () => {
//     if (!searchLocation) return;

//     const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
//     const res = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         searchLocation
//       )}.json?access_token=${token}`
//     );
//     const data = await res.json();

//     if (data.features?.length) {
//       const [lng, lat] = data.features[0].center;
//       setManualLocation({ latitude: lat, longitude: lng });
//     }
//   };

//   // Lat/Lng
//   const handleLatLngSubmit = () => {
//     if (!manualLocation.latitude || !manualLocation.longitude) return;
//     setManualLocation({
//       latitude: parseFloat(manualLocation.latitude),
//       longitude: parseFloat(manualLocation.longitude),
//     });
//   };

//   // Clear manual/search location
//   const clearManualSearch = () => {
//     setManualLocation({ latitude: "", longitude: "" });
//     setSearchLocation("");
//   };

//   // Checkbox
//   const handleCheckboxChange = (value) => {
//     setSelectedData((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   // Toggle drawing mode
//   const toggleDrawing = () => {
//     setIsDrawing(!isDrawing);
//   };

//   // Clear drawn polygon
//   const clearDrawnPolygon = () => {
//     setDrawnPolygon(null);
//   };

//   // Navigate to next step
//   const handleNext = () => {
//     if (isLocationStepComplete()) {
//       setCurrentStep(2);
//     } else {
//       alert("Please select a location method first");
//     }
//   };

//   // Navigate back
//   const handleBack = () => {
//     setCurrentStep(1);
//   };

//   // Submit with validation
//   const handleSubmit = () => {
//     if (!isFormValid()) {
//       alert("Location and data selection are required");
//       return;
//     }

//     localStorage.setItem(
//       "exploreData",
//       JSON.stringify({
//         geojson,
//         polygon,
//         manualLocation,
//         selectedData,
//         kmlFileName,
//         drawnPolygon,
//       })
//     );

//     router.push("/");
//   };

//   return (
//     <div className="w-screen h-screen relative overflow-hidden">
//       {/* LEFT PANEL */}
//       <div className="absolute top-4 left-4 z-50 w-96 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col text-white">
//         {/* STEP 1: LOCATION */}
//         {currentStep === 1 && (
//           <>
//             <div className="p-6 space-y-4 flex-1 overflow-y-auto">
//               <h1 className="text-2xl font-bold mb-4">Select Location</h1>

//               {/* Manual Location Dropdown */}
//               <div>
//                 <button
//                   onClick={() => setManualDropdownOpen(!manualDropdownOpen)}
//                   className={`w-full flex justify-between items-center px-4 py-3 rounded-xl font-semibold transition-all ${
//                     geojson
//                       ? "bg-white/5 cursor-not-allowed"
//                       : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10"
//                   }`}
//                   disabled={!!geojson}
//                 >
//                   <span>📍 Manual Location</span>
//                   <span className="text-xl">
//                     {manualDropdownOpen ? "−" : "+"}
//                   </span>
//                 </button>

//                 {manualDropdownOpen && !geojson && (
//                   <div className="mt-3 space-y-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
//                     {/* Search Location */}
//                     <div>
//                       <label className="text-sm font-semibold mb-2 block text-gray-300">
//                         Search Location
//                       </label>
//                       <input
//                         value={searchLocation}
//                         onChange={(e) => setSearchLocation(e.target.value)}
//                         placeholder="Enter city, state..."
//                         className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                       />
//                       <button
//                         onClick={handleSearchLocation}
//                         className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Search
//                       </button>
//                     </div>

//                     {/* Lat/Lng */}
//                     <div>
//                       <label className="text-sm font-semibold mb-2 block text-gray-300">
//                         Latitude / Longitude
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="number"
//                           placeholder="Latitude"
//                           value={manualLocation.latitude}
//                           onChange={(e) =>
//                             setManualLocation({
//                               ...manualLocation,
//                               latitude: e.target.value,
//                             })
//                           }
//                           className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                         />
//                         <input
//                           type="number"
//                           placeholder="Longitude"
//                           value={manualLocation.longitude}
//                           onChange={(e) =>
//                             setManualLocation({
//                               ...manualLocation,
//                               longitude: e.target.value,
//                             })
//                           }
//                           className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                         />
//                       </div>
//                       <button
//                         onClick={handleLatLngSubmit}
//                         className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Set Location
//                       </button>
//                     </div>

//                     {/* Clear button */}
//                     {isManualOrSearchSet() && (
//                       <button
//                         onClick={clearManualSearch}
//                         className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Clear Location
//                       </button>
//                     )}

//                     {/* Draw Polygon */}
//                     {isManualOrSearchSet() && (
//                       <div className="pt-3 border-t border-white/20">
//                         <label className="text-sm font-semibold mb-2 block text-gray-300">
//                           Draw Area (Optional)
//                         </label>
//                         <button
//                           onClick={toggleDrawing}
//                           className={`w-full py-3 rounded-lg font-semibold text-sm transition-all shadow-lg ${
//                             isDrawing
//                               ? "bg-gradient-to-r from-red-500 to-red-600"
//                               : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
//                           }`}
//                         >
//                           {isDrawing ? "✕ Cancel Drawing" : "✏️ Draw Polygon"}
//                         </button>

//                         {drawnPolygon && (
//                           <div className="mt-3 bg-green-500/20 border border-green-400/50 p-3 rounded-lg backdrop-blur-sm">
//                             <div className="flex justify-between items-center">
//                               <span className="text-sm font-semibold text-green-300">
//                                 ✓ Polygon drawn ({drawnPolygon.length} points)
//                               </span>
//                               <button
//                                 onClick={clearDrawnPolygon}
//                                 className="text-red-400 text-sm underline hover:text-red-300 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {geojson && (
//                   <p className="text-xs text-yellow-300/80 mt-2 px-1">
//                     ⚠️ Clear KML to use manual location
//                   </p>
//                 )}
//               </div>

//               {/* Upload KML */}
//               <div>
//                 <div
//                   className={`p-4 rounded-xl border transition-all ${
//                     isManualOrSearchSet()
//                       ? "bg-white/5 border-white/10 opacity-50"
//                       : "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-white/10 hover:from-emerald-500/30 hover:to-teal-500/30"
//                   }`}
//                 >
//                   <label className="text-sm font-semibold mb-2 block text-gray-300 flex items-center gap-2">
//                     <span>📁</span> Upload KML File
//                   </label>
//                   <input
//                     type="file"
//                     accept=".kml"
//                     onChange={(e) => handleKMLUpload(e.target.files[0])}
//                     disabled={isManualOrSearchSet()}
//                     className={`text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer transition-all ${
//                       isManualOrSearchSet() ? "cursor-not-allowed" : ""
//                     }`}
//                   />

//                   {kmlFileName && (
//                     <div className="mt-3 flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
//                       <span className="text-xs truncate text-gray-300">
//                         {kmlFileName}
//                       </span>
//                       <button
//                         onClick={removeKML}
//                         className="text-red-400 text-xs ml-2 hover:text-red-300 font-semibold transition-colors"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   )}

//                   {isManualOrSearchSet() && (
//                     <p className="text-xs text-yellow-300/80 mt-2">
//                       ⚠️ Clear manual location to upload KML
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* NEXT BUTTON */}
//             <div className="p-6 border-t border-white/10 bg-black/20">
//               <button
//                 onClick={handleNext}
//                 disabled={!isLocationStepComplete()}
//                 className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-xl ${
//                   isLocationStepComplete()
//                     ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                     : "bg-gray-600 cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 Next →
//               </button>
//             </div>
//           </>
//         )}

//         {/* STEP 2: DATA NEEDED */}
//         {currentStep === 2 && (
//           <>
//             <div className="p-6 space-y-4 flex-1 overflow-y-auto">
//               <h1 className="text-2xl font-bold mb-4">Select Data Needed</h1>

//               <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
//                 <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
//                   {dataOptions.map((opt) => (
//                     <label
//                       key={opt}
//                       className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedData.includes(opt)}
//                         onChange={() => handleCheckboxChange(opt)}
//                         className="w-5 h-5 rounded border-white/30 text-blue-500 focus:ring-2 focus:ring-blue-400 cursor-pointer"
//                       />
//                       <span className="text-sm font-medium">{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {selectedData.length > 0 && (
//                 <div className="bg-blue-500/20 border border-blue-400/50 p-3 rounded-lg backdrop-blur-sm">
//                   <p className="text-sm text-blue-200">
//                     ✓ {selectedData.length} item
//                     {selectedData.length !== 1 ? "s" : ""} selected
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* BACK AND SUBMIT BUTTONS */}
//             <div className="p-6 border-t border-white/10 bg-black/20 space-y-3">
//               <button
//                 onClick={handleSubmit}
//                 disabled={!isFormValid()}
//                 className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-xl ${
//                   isFormValid()
//                     ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                     : "bg-gray-600 cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="w-full py-2 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20"
//               >
//                 ← Back
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* MAP */}
//       <ExploreMap
//         geojson={geojson}
//         onPolygonChange={setPolygon}
//         manualLocation={manualLocation}
//         isDrawing={isDrawing}
//         onDrawComplete={(coords) => {
//           setDrawnPolygon(coords);
//           setIsDrawing(false);
//         }}
//         drawnPolygon={drawnPolygon}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExploreMap from "@/components/ExploreComponents/ExploreMap";
import * as toGeoJSON from "@tmcw/togeojson";

export default function ExplorePage() {
  const router = useRouter();

  const [geojson, setGeojson] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [manualLocation, setManualLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [kmlFileName, setKmlFileName] = useState("");
  const [manualDropdownOpen, setManualDropdownOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = location, 2 = data

  const dataOptions = [
    "Orthomosaic",
    "Digital Elevation Model",
    "Digital Surface Model",
    "Digital Terrain Model",
    "Ground Control Point",
    "Spot Levels",
    "Contours",
    "Cad Drawing",
    "3D model",
    "Point Cloud",
    "Drawing file",
    "Video",
    "Raw Photo",
    "Inspection Report",
    "Processed Data with Analytics",
    "Other",
  ];

  // Check if manual location or search location is set
  const isManualOrSearchSet = () => {
    return manualLocation.latitude && manualLocation.longitude;
  };

  // Check if location step is complete
  const isLocationStepComplete = () => {
    return isManualOrSearchSet() || !!geojson;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasLocation = isManualOrSearchSet() || !!geojson;
    const hasData = selectedData.length > 0;
    return hasLocation && hasData;
  };

  // Load saved KML and drawn polygon
  useEffect(() => {
    const saved = localStorage.getItem("exploreKML");
    if (saved) {
      const parsed = JSON.parse(saved);
      setGeojson(parsed.geojson || null);
      setKmlFileName(parsed.name || "");
    }

    const savedData = localStorage.getItem("exploreData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.drawnPolygon) {
        setDrawnPolygon(parsed.drawnPolygon);
      }
      if (
        parsed.manualLocation &&
        parsed.manualLocation.latitude &&
        parsed.manualLocation.longitude
      ) {
        setManualLocation({
          latitude: parsed.manualLocation.latitude,
          longitude: parsed.manualLocation.longitude,
        });
      }
      if (parsed.selectedData) {
        setSelectedData(parsed.selectedData);
      }
    }
  }, []);

  // Upload KML
  const handleKMLUpload = (file) => {
    if (!file) return;

    setKmlFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(e.target.result, "text/xml");
      const converted = toGeoJSON.kml(kmlDoc);

      setGeojson(converted);
      localStorage.setItem(
        "exploreKML",
        JSON.stringify({ name: file.name, geojson: converted })
      );
    };
    reader.readAsText(file);
  };

  const removeKML = () => {
    setGeojson(null);
    setKmlFileName("");
    localStorage.removeItem("exploreKML");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Search
  const handleSearchLocation = async () => {
    if (!searchLocation) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchLocation
      )}.json?access_token=${token}`
    );
    const data = await res.json();

    if (data.features?.length) {
      const [lng, lat] = data.features[0].center;
      setManualLocation({ latitude: lat, longitude: lng });
    }
  };

  // Lat/Lng
  const handleLatLngSubmit = () => {
    if (!manualLocation.latitude || !manualLocation.longitude) return;
    setManualLocation({
      latitude: parseFloat(manualLocation.latitude),
      longitude: parseFloat(manualLocation.longitude),
    });
  };

  // Clear manual/search location
  const clearManualSearch = () => {
    setManualLocation({ latitude: "", longitude: "" });
    setSearchLocation("");
  };

  // Checkbox
  const handleCheckboxChange = (value) => {
    setSelectedData((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Toggle drawing mode
  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  // Clear drawn polygon
  const clearDrawnPolygon = () => {
    setDrawnPolygon(null);
  };

  // Navigate to next step
  const handleNext = () => {
    if (isLocationStepComplete()) {
      setCurrentStep(2);
    } else {
      alert("Please select a location method first");
    }
  };

  // Navigate back
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Submit with validation
  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Location and data selection are required");
      return;
    }

    localStorage.setItem(
      "exploreData",
      JSON.stringify({
        geojson,
        polygon,
        manualLocation,
        selectedData,
        kmlFileName,
        drawnPolygon,
      })
    );

    router.push("/");
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="absolute top-4 left-4 z-50 w-96 max-h-[calc(100vh-2rem)] bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col text-white overflow-hidden">
        {/* STEP 1: LOCATION */}
        {currentStep === 1 && (
          <>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
              <h1 className="text-2xl font-bold mb-4">Select Location</h1>

              {/* Manual Location Dropdown */}
              <div>
                <button
                  onClick={() => setManualDropdownOpen(!manualDropdownOpen)}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl font-semibold transition-all ${
                    geojson
                      ? "bg-white/5 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10"
                  }`}
                  disabled={!!geojson}
                >
                  <span>📍 Manual Location</span>
                  <span className="text-xl">
                    {manualDropdownOpen ? "−" : "+"}
                  </span>
                </button>

                {manualDropdownOpen && !geojson && (
                  <div className="mt-3 space-y-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                    {/* Search Location */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-gray-300">
                        Search Location
                      </label>
                      <input
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Enter city, state..."
                        className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
                      />
                      <button
                        onClick={handleSearchLocation}
                        className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                      >
                        Search
                      </button>
                    </div>

                    {/* Lat/Lng */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-gray-300">
                        Latitude / Longitude
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Latitude"
                          value={manualLocation.latitude}
                          onChange={(e) =>
                            setManualLocation({
                              ...manualLocation,
                              latitude: e.target.value,
                            })
                          }
                          className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Longitude"
                          value={manualLocation.longitude}
                          onChange={(e) =>
                            setManualLocation({
                              ...manualLocation,
                              longitude: e.target.value,
                            })
                          }
                          className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={handleLatLngSubmit}
                        className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                      >
                        Set Location
                      </button>
                    </div>

                    {/* Clear button */}
                    {isManualOrSearchSet() && (
                      <button
                        onClick={clearManualSearch}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                      >
                        Clear Location
                      </button>
                    )}

                    {/* Draw Polygon - Only shows when location is set */}
                    {isManualOrSearchSet() && (
                      <div className="pt-3 border-t border-white/20">
                        <label className="text-sm font-semibold mb-2 block text-gray-300">
                          Draw Area (Optional)
                        </label>
                        <button
                          onClick={toggleDrawing}
                          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                            isDrawing
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                          }`}
                        >
                          {isDrawing ? "✕ Cancel Drawing" : "✏️ Draw Polygon"}
                        </button>

                        {drawnPolygon && (
                          <div className="mt-3 bg-green-500/20 border border-green-400/50 p-3 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-green-300">
                                ✓ Polygon drawn ({drawnPolygon.length} points)
                              </span>
                              <button
                                onClick={clearDrawnPolygon}
                                className="text-red-400 text-sm underline hover:text-red-300 transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {geojson && (
                  <p className="text-xs text-yellow-300/80 mt-2 px-1">
                    ⚠️ Clear KML to use manual location
                  </p>
                )}
              </div>

              {/* Upload KML */}
              <div>
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isManualOrSearchSet()
                      ? "bg-white/5 border-white/10 opacity-50"
                      : "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-white/10 hover:from-emerald-500/30 hover:to-teal-500/30"
                  }`}
                >
                  <label className="text-sm font-semibold mb-2 block text-gray-300 flex items-center gap-2">
                    <span>📁</span> Upload KML File
                  </label>
                  <input
                    type="file"
                    accept=".kml"
                    onChange={(e) => handleKMLUpload(e.target.files[0])}
                    disabled={isManualOrSearchSet()}
                    className={`text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer transition-all ${
                      isManualOrSearchSet() ? "cursor-not-allowed" : ""
                    }`}
                  />

                  {kmlFileName && (
                    <div className="mt-3 flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                      <span className="text-xs truncate text-gray-300">
                        {kmlFileName}
                      </span>
                      <button
                        onClick={removeKML}
                        className="text-red-400 text-xs ml-2 hover:text-red-300 font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {isManualOrSearchSet() && (
                    <p className="text-xs text-yellow-300/80 mt-2">
                      ⚠️ Clear manual location to upload KML
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* NEXT BUTTON */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <button
                onClick={handleNext}
                disabled={!isLocationStepComplete()}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-xl ${
                  isLocationStepComplete()
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 2: DATA NEEDED */}
        {currentStep === 2 && (
          <>
            <div className="p-6 flex-1 flex flex-col overflow-hidden">
              <h1 className="text-xl font-bold mb-4">Select Data Needed</h1>

              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex-1 overflow-y-auto scrollbar-hide">
                <div className="space-y-2">
                  {dataOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={selectedData.includes(opt)}
                        onChange={() => handleCheckboxChange(opt)}
                        className="w-4 h-3 rounded-xl border-white/30 text-blue-500 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                      />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedData.length > 0 && (
                <div className="bg-blue-500/20 border border-blue-400/50 p-3 rounded-lg backdrop-blur-sm mt-4">
                  <p className="text-sm text-blue-200">
                    ✓ {selectedData.length} item
                    {selectedData.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>

            {/* BACK AND SUBMIT BUTTONS */}
            <div className="p-6 border-t border-white/10 bg-black/10 space-y-2">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-xl ${
                  isFormValid()
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                Submit
              </button>
              <button
                onClick={handleBack}
                className="w-full py-2 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20"
              >
                ← Back
              </button>
            </div>
          </>
        )}
      </div>

      {/* MAP */}
      <ExploreMap
        geojson={geojson}
        onPolygonChange={setPolygon}
        manualLocation={manualLocation}
        isDrawing={isDrawing}
        onDrawComplete={(coords) => {
          setDrawnPolygon(coords);
          setIsDrawing(false);
        }}
        drawnPolygon={drawnPolygon}
      />
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ExploreMap from "@/components/ExploreComponents/ExploreMap";
// import * as toGeoJSON from "@tmcw/togeojson";

// export default function ExplorePage() {
//   const router = useRouter();

//   const [geojson, setGeojson] = useState(null);
//   const [polygon, setPolygon] = useState(null);
//   const [manualLocation, setManualLocation] = useState({
//     latitude: "",
//     longitude: "",
//   });
//   const [searchLocation, setSearchLocation] = useState("");
//   const [selectedData, setSelectedData] = useState([]);
//   const [kmlFileName, setKmlFileName] = useState("");
//   const [manualDropdownOpen, setManualDropdownOpen] = useState(false);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawnPolygon, setDrawnPolygon] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1); // 1 = location, 2 = data

//   const dataOptions = [
//     "Orthomosaic",
//     "Digital Elevation Model",
//     "Digital Surface Model",
//     "Digital Terrain Model",
//     "Ground Control Point",
//     "Spot Levels",
//     "Contours",
//     "Cad Drawing",
//     "3D model",
//     "Point Cloud",
//     "Drawing file",
//     "Video",
//     "Raw Photo",
//     "Inspection Report",
//     "Processed Data with Analytics",
//     "Other",
//   ];

//   // Check if manual location or search location is set
//   const isManualOrSearchSet = () => {
//     return (
//       (manualLocation.latitude && manualLocation.longitude) || searchLocation
//     );
//   };

//   // Check if location step is complete
//   const isLocationStepComplete = () => {
//     return isManualOrSearchSet() || !!geojson;
//   };

//   // Check if form is valid for submission
//   const isFormValid = () => {
//     const hasLocation = isManualOrSearchSet() || !!geojson;
//     const hasData = selectedData.length > 0;
//     return hasLocation && hasData;
//   };

//   // Load saved KML and drawn polygon
//   useEffect(() => {
//     const saved = localStorage.getItem("exploreKML");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setGeojson(parsed.geojson || null);
//       setKmlFileName(parsed.name || "");
//     }

//     const savedData = localStorage.getItem("exploreData");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       if (parsed.drawnPolygon) {
//         setDrawnPolygon(parsed.drawnPolygon);
//       }
//       if (
//         parsed.manualLocation &&
//         parsed.manualLocation.latitude &&
//         parsed.manualLocation.longitude
//       ) {
//         setManualLocation({
//           latitude: parsed.manualLocation.latitude,
//           longitude: parsed.manualLocation.longitude,
//         });
//       }
//       if (parsed.selectedData) {
//         setSelectedData(parsed.selectedData);
//       }
//     }
//   }, []);

//   // Upload KML
//   const handleKMLUpload = (file) => {
//     if (!file) return;

//     setKmlFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const parser = new DOMParser();
//       const kmlDoc = parser.parseFromString(e.target.result, "text/xml");
//       const converted = toGeoJSON.kml(kmlDoc);

//       setGeojson(converted);
//       localStorage.setItem(
//         "exploreKML",
//         JSON.stringify({ name: file.name, geojson: converted })
//       );
//     };
//     reader.readAsText(file);
//   };

//   const removeKML = () => {
//     setGeojson(null);
//     setKmlFileName("");
//     localStorage.removeItem("exploreKML");
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   // Search
//   const handleSearchLocation = async () => {
//     if (!searchLocation) return;

//     const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
//     const res = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         searchLocation
//       )}.json?access_token=${token}`
//     );
//     const data = await res.json();

//     if (data.features?.length) {
//       const [lng, lat] = data.features[0].center;
//       setManualLocation({ latitude: lat, longitude: lng });
//     }
//   };

//   // Lat/Lng
//   const handleLatLngSubmit = () => {
//     if (!manualLocation.latitude || !manualLocation.longitude) return;
//     setManualLocation({
//       latitude: parseFloat(manualLocation.latitude),
//       longitude: parseFloat(manualLocation.longitude),
//     });
//   };

//   // Clear manual/search location
//   const clearManualSearch = () => {
//     setManualLocation({ latitude: "", longitude: "" });
//     setSearchLocation("");
//   };

//   // Checkbox
//   const handleCheckboxChange = (value) => {
//     setSelectedData((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   // Toggle drawing mode
//   const toggleDrawing = () => {
//     setIsDrawing(!isDrawing);
//   };

//   // Clear drawn polygon
//   const clearDrawnPolygon = () => {
//     setDrawnPolygon(null);
//   };

//   // Navigate to next step
//   const handleNext = () => {
//     if (isLocationStepComplete()) {
//       setCurrentStep(2);
//     } else {
//       alert("Please select a location method first");
//     }
//   };

//   // Navigate back
//   const handleBack = () => {
//     setCurrentStep(1);
//   };

//   // Submit with validation
//   const handleSubmit = () => {
//     if (!isFormValid()) {
//       alert("Location and data selection are required");
//       return;
//     }

//     localStorage.setItem(
//       "exploreData",
//       JSON.stringify({
//         geojson,
//         polygon,
//         manualLocation,
//         selectedData,
//         kmlFileName,
//         drawnPolygon,
//       })
//     );

//     router.push("/");
//   };

//   return (
//     <div className="w-screen h-screen relative overflow-hidden">
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>

//       {/* LEFT PANEL */}
//       <div className="absolute top-4 left-4 z-50 w-full sm:w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col text-white overflow-hidden">
//         {/* STEP 1: LOCATION */}
//         {currentStep === 1 && (
//           <>
//             <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
//               <h1 className="text-xl sm:text-2xl font-bold mb-4">
//                 Select Location
//               </h1>

//               {/* Manual Location Dropdown */}
//               <div>
//                 <button
//                   onClick={() => setManualDropdownOpen(!manualDropdownOpen)}
//                   className={`w-full flex justify-between items-center px-3 sm:px-4 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
//                     geojson
//                       ? "bg-white/5 cursor-not-allowed"
//                       : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10"
//                   }`}
//                   disabled={!!geojson}
//                 >
//                   <span>📍 Manual Location</span>
//                   <span className="text-lg sm:text-xl">
//                     {manualDropdownOpen ? "−" : "+"}
//                   </span>
//                 </button>

//                 {manualDropdownOpen && !geojson && (
//                   <div className="mt-3 space-y-3 sm:space-y-4 bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10">
//                     {/* Search Location */}
//                     <div>
//                       <label className="text-sm font-semibold mb-2 block text-gray-300">
//                         Search Location
//                       </label>
//                       <input
//                         value={searchLocation}
//                         onChange={(e) => setSearchLocation(e.target.value)}
//                         placeholder="Enter city, state..."
//                         className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                       />
//                       <button
//                         onClick={handleSearchLocation}
//                         className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Search
//                       </button>
//                     </div>

//                     {/* Lat/Lng */}
//                     <div>
//                       <label className="text-sm font-semibold mb-2 block text-gray-300">
//                         Latitude / Longitude
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="number"
//                           placeholder="Latitude"
//                           value={manualLocation.latitude}
//                           onChange={(e) =>
//                             setManualLocation({
//                               ...manualLocation,
//                               latitude: e.target.value,
//                             })
//                           }
//                           className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                         />
//                         <input
//                           type="number"
//                           placeholder="Longitude"
//                           value={manualLocation.longitude}
//                           onChange={(e) =>
//                             setManualLocation({
//                               ...manualLocation,
//                               longitude: e.target.value,
//                             })
//                           }
//                           className="w-1/2 p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-sm border border-white/20 focus:border-blue-400 focus:outline-none transition-all"
//                         />
//                       </div>
//                       <button
//                         onClick={handleLatLngSubmit}
//                         className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Set Location
//                       </button>
//                     </div>

//                     {/* Clear button */}
//                     {isManualOrSearchSet() && (
//                       <button
//                         onClick={clearManualSearch}
//                         className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
//                       >
//                         Clear Location
//                       </button>
//                     )}

//                     {/* Draw Polygon - Only shows when location is set */}
//                     {isManualOrSearchSet() && (
//                       <div className="pt-3 border-t border-white/20">
//                         <label className="text-sm font-semibold mb-2 block text-gray-300">
//                           Draw Area (Optional)
//                         </label>
//                         <button
//                           onClick={toggleDrawing}
//                           className={`w-full py-3 rounded-lg font-semibold text-sm transition-all shadow-lg ${
//                             isDrawing
//                               ? "bg-gradient-to-r from-red-500 to-red-600"
//                               : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
//                           }`}
//                         >
//                           {isDrawing ? "✕ Cancel Drawing" : "✏️ Draw Polygon"}
//                         </button>

//                         {drawnPolygon && (
//                           <div className="mt-3 bg-green-500/20 border border-green-400/50 p-3 rounded-lg backdrop-blur-sm">
//                             <div className="flex justify-between items-center">
//                               <span className="text-sm font-semibold text-green-300">
//                                 ✓ Polygon drawn ({drawnPolygon.length} points)
//                               </span>
//                               <button
//                                 onClick={clearDrawnPolygon}
//                                 className="text-red-400 text-sm underline hover:text-red-300 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {geojson && (
//                   <p className="text-xs text-yellow-300/80 mt-2 px-1">
//                     ⚠️ Clear KML to use manual location
//                   </p>
//                 )}
//               </div>

//               {/* Upload KML */}
//               <div>
//                 <div
//                   className={`p-3 sm:p-4 rounded-xl border transition-all ${
//                     isManualOrSearchSet()
//                       ? "bg-white/5 border-white/10 opacity-50"
//                       : "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-white/10 hover:from-emerald-500/30 hover:to-teal-500/30"
//                   }`}
//                 >
//                   <label className="text-sm font-semibold mb-2 block text-gray-300 flex items-center gap-2">
//                     <span>📁</span> Upload KML File
//                   </label>
//                   <input
//                     type="file"
//                     accept=".kml"
//                     onChange={(e) => handleKMLUpload(e.target.files[0])}
//                     disabled={isManualOrSearchSet()}
//                     className={`text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer transition-all ${
//                       isManualOrSearchSet() ? "cursor-not-allowed" : ""
//                     }`}
//                   />

//                   {kmlFileName && (
//                     <div className="mt-3 flex justify-between items-center bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
//                       <span className="text-xs truncate text-gray-300">
//                         {kmlFileName}
//                       </span>
//                       <button
//                         onClick={removeKML}
//                         className="text-red-400 text-xs ml-2 hover:text-red-300 font-semibold transition-colors"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   )}

//                   {isManualOrSearchSet() && (
//                     <p className="text-xs text-yellow-300/80 mt-2">
//                       ⚠️ Clear manual location to upload KML
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* NEXT BUTTON */}
//             <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20">
//               <button
//                 onClick={handleNext}
//                 disabled={!isLocationStepComplete()}
//                 className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl ${
//                   isLocationStepComplete()
//                     ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                     : "bg-gray-600 cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 Next →
//               </button>
//             </div>
//           </>
//         )}

//         {/* STEP 2: DATA NEEDED */}
//         {currentStep === 2 && (
//           <>
//             <div className="p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
//               <h1 className="text-xl sm:text-2xl font-bold mb-4">
//                 Select Data Needed
//               </h1>

//               <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 flex-1 overflow-y-auto scrollbar-hide">
//                 <div className="space-y-2">
//                   {dataOptions.map((opt) => (
//                     <label
//                       key={opt}
//                       className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedData.includes(opt)}
//                         onChange={() => handleCheckboxChange(opt)}
//                         className="w-4 h-4 sm:w-5 sm:h-5 rounded border-white/30 text-blue-500 focus:ring-2 focus:ring-blue-400 cursor-pointer flex-shrink-0"
//                       />
//                       <span className="text-xs sm:text-sm font-medium">
//                         {opt}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {selectedData.length > 0 && (
//                 <div className="bg-blue-500/20 border border-blue-400/50 p-2 sm:p-3 rounded-lg backdrop-blur-sm mt-4">
//                   <p className="text-xs sm:text-sm text-blue-200">
//                     ✓ {selectedData.length} item
//                     {selectedData.length !== 1 ? "s" : ""} selected
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* BACK AND SUBMIT BUTTONS */}
//             <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 space-y-2 sm:space-y-3">
//               <button
//                 onClick={handleSubmit}
//                 disabled={!isFormValid()}
//                 className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl ${
//                   isFormValid()
//                     ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                     : "bg-gray-600 cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="w-full py-2 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20"
//               >
//                 ← Back
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* MAP */}
//       <ExploreMap
//         geojson={geojson}
//         onPolygonChange={setPolygon}
//         manualLocation={manualLocation}
//         isDrawing={isDrawing}
//         onDrawComplete={(coords) => {
//           setDrawnPolygon(coords);
//           setIsDrawing(false);
//         }}
//         drawnPolygon={drawnPolygon}
//       />
//     </div>
//   );
// }
