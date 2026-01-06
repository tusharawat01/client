"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import Script from "next/script";
import JSZip from "jszip";

const Wrapper = styled.div`
  background-color: black;
  height: 100%;
  width: 100%;
  position: absolute;
`;

const PointcloudNavigator = ({ url }) => {
  const potreeContainerDiv = useRef(null);
  let viewer = useRef(null);
  const fetchOverrideRef = useRef(null);

  useEffect(() => {
    const initializeViewer = async (url) => {
      try {
        const Potree = window.Potree;
        if (!Potree) {
          console.error("❌ Potree is not loaded yet");
          return;
        }

        console.log("🚀 Starting pointcloud initialization...");

        // Step 1: Fetch & unzip Cloudinary .zip
        console.log("📦 Fetching pointcloud zip:", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch zip: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob();
        console.log("📦 Zip blob size:", blob.size, "bytes");

        const zip = await JSZip.loadAsync(blob);
        const fileNames = Object.keys(zip.files);
        console.log("✅ Unzipped files:", fileNames);

        // Check for required files
        const hasMetadata = fileNames.some((f) =>
          f.toLowerCase().endsWith("metadata.json")
        );
        const hasHierarchy = fileNames.some(
          (f) => f.toLowerCase().includes("hierarchy") || f.endsWith(".hrc")
        );
        const hasOctree = fileNames.some((f) => f.includes("octree"));

        console.log("📋 File analysis:", {
          hasMetadata,
          hasHierarchy,
          hasOctree,
          totalFiles: fileNames.length,
        });

        // Step 2: Build file map in memory
        const fileMap = {};
        let totalSize = 0;

        for (const filename of fileNames) {
          const file = zip.file(filename);
          if (file && !file.dir) {
            // Skip directories
            try {
              const buffer = await file.async("arraybuffer");
              fileMap[filename] = buffer;
              totalSize += buffer.byteLength;
              console.log(
                `📄 Loaded: ${filename} (${buffer.byteLength} bytes)`
              );
            } catch (error) {
              console.error(`❌ Failed to load file ${filename}:`, error);
            }
          }
        }

        console.log(
          `💾 Total files loaded: ${
            Object.keys(fileMap).length
          }, Total size: ${totalSize} bytes`
        );

        // Step 3: Override window.fetch with better error handling
        if (fetchOverrideRef.current) {
          window.fetch = fetchOverrideRef.current; // Restore original if exists
        }

        const originalFetch = window.fetch;
        fetchOverrideRef.current = originalFetch;

        window.fetch = async function (path, options) {
          // Handle different path formats
          let cleanPath = path;
          if (path.startsWith("http://") || path.startsWith("https://")) {
            // External URL, use original fetch
            return originalFetch(path, options);
          }

          // Clean local path and resolve relative paths
          cleanPath = path.startsWith("/") ? path.slice(1) : path;
          cleanPath = cleanPath.replace(/^\.\//, ""); // Remove ./

          // Handle relative paths like "metadata.json/../hierarchy.bin"
          if (cleanPath.includes("../")) {
            const parts = cleanPath.split("/");
            const resolved = [];
            for (const part of parts) {
              if (part === "..") {
                resolved.pop(); // Go up one directory
              } else if (part !== ".") {
                resolved.push(part);
              }
            }
            cleanPath = resolved.join("/");
          }

          console.log("🔍 Potree requested:", cleanPath, "from path:", path);

          if (fileMap[cleanPath]) {
            const buffer = fileMap[cleanPath];
            console.log(
              `✅ Serving from memory: ${cleanPath} (${buffer.byteLength} bytes)`
            );

            // Determine content type
            let contentType = "application/octet-stream";
            if (cleanPath.endsWith(".json")) {
              contentType = "application/json";
            } else if (
              cleanPath.endsWith(".las") ||
              cleanPath.endsWith(".laz")
            ) {
              contentType = "application/octet-stream";
            }

            // For JSON files, decode and return as text
            if (cleanPath.endsWith(".json")) {
              const text = new TextDecoder().decode(buffer);
              console.log(
                `📝 JSON content preview:`,
                text.substring(0, 200) + "..."
              );
              return new Response(text, {
                status: 200,
                headers: {
                  "Content-Type": contentType,
                  "Content-Length": buffer.byteLength.toString(),
                },
              });
            }

            // For binary files, return as ArrayBuffer
            return new Response(buffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Content-Length": buffer.byteLength.toString(),
              },
            });
          }

          console.log(
            `⚠️ File not found in memory: ${cleanPath}, trying original fetch`
          );
          // Fallback to real fetch
          return originalFetch(path, options);
        };

        // Step 4: Setup Potree Viewer
        console.log("🖥️ Setting up Potree viewer...");

        const renderArea = document.getElementById("potree_render_area");
        if (!renderArea) {
          console.error("❌ Render area not found!");
          return;
        }

        if (viewer.current) {
          console.log("🔄 Cleaning up existing viewer...");
          // Clean up existing viewer
          if (viewer.current.scene && viewer.current.scene.pointclouds) {
            viewer.current.scene.pointclouds.forEach((pc) => {
              viewer.current.scene.removePointCloud(pc);
            });
          }
          viewer.current = null;
        }

        // Create new viewer
        viewer.current = new Potree.Viewer(renderArea);
        console.log("✅ Viewer created");

        // Configure viewer
        viewer.current.setEDLEnabled(true);
        viewer.current.setFOV(60);
        viewer.current.setPointBudget(1 * 1000 * 1000);
        viewer.current.setClipTask(Potree.ClipTask.SHOW_INSIDE);
        viewer.current.loadSettingsFromURL();

        viewer.current.setControls(viewer.current.orbitControls);

        // Don't set initial view - let fitToScreen handle it automatically

        // Load GUI
        viewer.current.loadGUI(() => {
          viewer.current.setLanguage("en");
          const appearanceMenu = document.getElementById("menu_appearance");
          if (appearanceMenu && appearanceMenu.next) {
            appearanceMenu.next().show();
          }
          viewer.current.toggleSidebar();
        });

        // Step 5: Find and load point cloud
        console.log("🔍 Looking for metadata file...");
        console.log("Available files:", Object.keys(fileMap));

        const metadataPath = Object.keys(fileMap).find(
          (f) =>
            f.toLowerCase().includes("metadata") &&
            f.toLowerCase().endsWith(".json")
        );

        if (!metadataPath) {
          console.error("❌ No metadata.json found in zip!");
          console.log("Available files:", Object.keys(fileMap));
          return;
        }

        console.log(`📋 Found metadata file: ${metadataPath}`);

        // Log metadata content for debugging
        const metadataBuffer = fileMap[metadataPath];
        const metadataText = new TextDecoder().decode(metadataBuffer);
        console.log("📋 Metadata content:", metadataText);

        // Load point cloud
        console.log("🌟 Loading point cloud...");

        Potree.loadPointCloud(metadataPath)
          .then((e) => {
            console.log("✅ Point cloud loaded successfully!", e);

            const pointcloud = e.pointcloud;
            const material = pointcloud.material;

            // Configure material for better visibility
            material.activeAttributeName = "rgba";
            material.minSize = 3; // Increased point size
            material.maxSize = 10;
            material.pointSizeType = Potree.PointSizeType.ADAPTIVE; // Changed to adaptive
            material.shape = Potree.PointShape.CIRCLE;

            // Add to scene
            viewer.current.scene.addPointCloud(pointcloud);

            console.log("✅ Point cloud added to scene");
            console.log("Point cloud boundingBox:", pointcloud.boundingBox);
            console.log("Point cloud pcoGeometry:", pointcloud.pcoGeometry);

            // Multiple attempts to fit the view properly
            setTimeout(() => {
              console.log("🎯 First fit attempt...");
              viewer.current.fitToScreen();

              // Try to zoom out a bit more to see everything
              setTimeout(() => {
                console.log("🎯 Zooming out for better view...");
                const camera = viewer.current.scene.getActiveCamera();
                const currentPos = camera.position.clone();
                const center = pointcloud.boundingBox.getCenter(
                  new THREE.Vector3()
                );
                const direction = currentPos.sub(center).normalize();
                const distance =
                  pointcloud.boundingBox.getSize(new THREE.Vector3()).length() *
                  1.5;

                camera.position.copy(
                  center.clone().add(direction.multiplyScalar(distance))
                );
                camera.lookAt(center);

                console.log("📍 Camera position:", camera.position);
                console.log("📍 Looking at:", center);
                console.log(
                  "📏 Bounding box size:",
                  pointcloud.boundingBox.getSize(new THREE.Vector3())
                );
              }, 500);
            }, 1000);
          })
          .catch((error) => {
            console.error("❌ ERROR loading point cloud:", error);
            console.error("Error stack:", error.stack);
          });
      } catch (error) {
        console.error("❌ Fatal error in initializeViewer:", error);
        console.error("Error stack:", error.stack);
      }
    };

    // Wait for Potree to be available
    if (window.Potree) {
      console.log("✅ Potree already loaded, initializing...");
      initializeViewer(url);
    } else {
      console.log("⏳ Waiting for Potree to load...");
      const handlePotreeLoad = () => {
        console.log("✅ Potree loaded event received");
        initializeViewer(url);
      };

      window.addEventListener("potree-loaded", handlePotreeLoad);

      // Cleanup event listener
      return () => {
        window.removeEventListener("potree-loaded", handlePotreeLoad);
      };
    }

    // Cleanup on unmount
    return () => {
      if (fetchOverrideRef.current) {
        window.fetch = fetchOverrideRef.current;
        fetchOverrideRef.current = null;
      }

      if (viewer.current) {
        if (viewer.current.scene && viewer.current.scene.pointclouds) {
          viewer.current.scene.pointclouds.forEach((pc) => {
            viewer.current.scene.removePointCloud(pc);
          });
        }
        viewer.current = null;
      }
    };
  }, [url]);

  return (
    <>
      {/* Potree CSS */}
      <link
        rel="stylesheet"
        type="text/css"
        href="/potree/build/potree/potree.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="/potree/libs/jquery-ui/jquery-ui.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="/potree/libs/openlayers3/ol.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="/potree/libs/spectrum/spectrum.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="/potree/libs/jstree/themes/mixed/style.css"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/cesium/Build/Cesium/Widgets/widgets.css"
      />

      {/* Load scripts in correct order */}
      <Script
        src="/potree/libs/jquery/jquery-3.1.1.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ jQuery loaded")}
      />
      <Script
        src="/potree/libs/jquery-ui/jquery-ui.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ jQuery UI loaded")}
      />
      <Script
        src="/potree/libs/spectrum/spectrum.js"
        strategy="afterInteractive"
      />
      <Script
        src="/potree/libs/other/BinaryHeap.js"
        strategy="afterInteractive"
      />
      <Script
        src="/potree/libs/tween/tween.min.js"
        strategy="afterInteractive"
      />
      <Script src="/potree/libs/d3/d3.js" strategy="afterInteractive" />
      <Script
        src="/potree/libs/three.js/build/three.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Three.js loaded")}
      />
      <Script src="/potree/libs/proj4/proj4.js" strategy="afterInteractive" />
      <Script
        src="/potree/libs/openlayers3/ol.js"
        strategy="afterInteractive"
      />
      <Script
        src="/potree/libs/i18next/i18next.js"
        strategy="afterInteractive"
      />
      <Script src="/potree/libs/jstree/jstree.js" strategy="afterInteractive" />
      <Script
        src="/potree/build/potree/potree.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Potree loaded");
          window.dispatchEvent(new Event("potree-loaded"));
        }}
      />
      <Script
        src="/potree/libs/plasio/js/laslaz.js"
        strategy="afterInteractive"
      />

      <div id="potree-root">
        <Wrapper
          ref={potreeContainerDiv}
          className="potree_container h-full relative flex-grow"
        >
          <div className="p-3 absolute z-50 bottom-4 right-4 text-gray-300">
            Tap anywhere on the object to zoom
          </div>
          <div id="potree_render_area"></div>
        </Wrapper>
      </div>
    </>
  );
};

export default PointcloudNavigator;
