const TEsvg = ({ highlightPosition, hidebox }) => {
  return (
    <svg
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 65.74 597.01"
    >
      <defs>
        <style>{`.cls-1 { fill: #eff2f5; }`}</style>
      </defs>
      <path
        id="side"
        d="M.02,597H52.66s-.3-73.8-6.69-137.74C39.57,395.31,29.56,16.19,29.45,12.34s-.68-10.98-1.36-11.66c-.63-.78-1.77-.91-2.55-.28-.1,.08-.2,.18-.28,.28-.79,1.13-14.81,398.9-17.66,424.48S-.32,553.71,.02,560.86,.02,597,.02,597Z"
        className="cls-1"
      />
      <rect
        x="0"
        y={highlightPosition || "0"}
        fill="#2196f3"
        className={`${hidebox ? "hidden" : ""}`}
        width="65.73999786376953"
        height="32.020411135584396"
        opacity="0.2"
        style={{ zIndex: 1 }}
      />
      <circle
        cx="27.662224981307983"
        cy="25.313224414062496"
        r="5"
        fill="#ff441d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143640"
        annotationId="27143640"
      />
      <circle
        cx="26.75634782409668"
        cy="112.40504463867188"
        r="5"
        fill="#ff441d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143641"
        annotationId="27143641"
      />
      <circle
        cx="31.55767454147339"
        cy="142.51822953125003"
        r="5"
        fill="#ff5b1d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143642"
        annotationId="27143642"
      />
      <circle
        cx="24.854541429519653"
        cy="253.55015114746092"
        r="5"
        fill="#ff5b1d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143643"
        annotationId="27143643"
      />
      <circle
        cx="29.22914891433716"
        cy="285.2245172155762"
        r="5"
        fill="#ff5b1d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143644"
        annotationId="27143644"
      />
      <circle
        cx="28.935113002225755"
        cy="569.5654596166993"
        r="5"
        fill="#ff5b1d"
        stroke="white"
        strokeWidth="2"
        id="annotation-27143645"
        annotationId="27143645"
      />
    </svg>
  );
};

export default TEsvg;
