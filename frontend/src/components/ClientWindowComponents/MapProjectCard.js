"use client";

import { useState } from "react";
import { LiaIndustrySolid } from "react-icons/lia";
import { TbMapPin2 } from "react-icons/tb";

export default function MapProjectCard({
  project,
  k,
  showProject,
  removeProject,
}) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className="w-full flex items-center rounded-lg px-3 py-2 border-[1px] border-gray-600
		hover:bg-gray-900 transition-all duration-100 ease-in-out bg-gray-950
		"
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2 justify-between">
          <div className="w-full flex flex-col gap-1">
            <h1 className="text-md font-semibold text-gray-100 leading-none">
              {project?.name}
            </h1>
            <span className="text-sm leading-none font-mono mt-1 text-gray-300">
              {project?.type}{" "}
              <span
                onClick={() => setExpand(!expand)}
                className="text-blue-500 leading-none cursor-pointer"
              >
                {expand ? "Less" : "More"} info
              </span>
            </span>
          </div>
          <div className="p-2 flex items-center justify-center">
            <label className="container">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    showProject(project);
                  } else {
                    removeProject(project);
                  }
                }}
              />
              <div className="checkmark"></div>
            </label>
          </div>
        </div>
        <div
          className={`w-full flex flex-col ${
            expand ? "pt-2 gap-2 h-auto" : "h-[0px]"
          } overflow-hidden transition-all
				duration-200 ease-in-out`}
        >
          <h1 className="text-xs leading-none flex items-center gap-1 text-gray-200">
            <LiaIndustrySolid className="h-4 w-4" />
            {project?.industry}
          </h1>
          <h1 className="text-xs leading-none flex items-center gap-1 text-gray-200">
            <TbMapPin2 className="h-4 w-4" />
            {project?.projectLocation}
          </h1>
          <div className="flex flex-col gap-2 py-1">
            <div className="w-full flex items-center justify-between">
              <h1 className="leading-none text-sm font-mono text-gray-200">
                Status
              </h1>
              <h1 className="leading-none text-sm font-mono text-gray-200">
                Progress {project?.progress}%
              </h1>
            </div>

            <div className="w-full h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                style={{
                  width: `${project?.progress}%`,
                }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
