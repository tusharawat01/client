
const LEsvg = ({ highlightPosition, hidebox }) => {
  return (


    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65.74 597.01">
      <defs>
        <style>
          {`.cls-1 { fill: #eff2f5; }`}
        </style>
      </defs>
      <path id="side" className="cls-1" d="M0.02,597H52.66s-.3-73.8-6.69-137.74C39.57,395.31,29.56,16.19,29.45,12.34s-.68-10.98-1.36-11.66c-.63-.78-1.77-.91-2.55-.28-.1,.08-.2,.18-.28,.28-.79,1.13-14.81,398.9-17.66,424.48S-0.32,553.71,0.02,560.86,0.02,597,0.02,597Z" />
      <rect x="0"
        className={`${hidebox ? 'hidden' : ''}`}
        y={highlightPosition} fill="#2196f3" width="65.73999786376953" height="62.70855440660759" opacity="0.2" style={{ zIndex: 1 }} />
      {/* <circle cx="26.585967746734617" cy="11.176027382812476" r="5" fill="#ff5b1d" stroke="white" strokeWidth="2" id="annotation-27143650" annotation-id="27143650" />
<circle cx="24.871762418746947" cy="234.19508663085935" r="5" fill="#ff5b1d" stroke="white" strokeWidth="2" id="annotation-27143651" annotation-id="27143651" />
<circle cx="25.45390060043335" cy="344.7135796386719" r="5" fill="#ff441d" stroke="white" strokeWidth="2" id="annotation-27143652" annotation-id="27143652" />
<circle cx="14.36591550064087" cy="423.6771085803223" r="5" fill="#ff5b1d" stroke="white" strokeWidth="2" id="annotation-27143653" annotation-id="27143653" />
<circle cx="19.363682357311248" cy="465.9215368713378" r="5" fill="#ff5b1d" stroke="white" strokeWidth="2" id="annotation-27143654" annotation-id="27143654" />
<circle cx="25.65650683194399" cy="529.9747408190918" r="5" fill="#ff441d" stroke="white" strokeWidth="2" id="annotation-27143655" annotation-id="27143655" />
<circle cx="14.431250136584044" cy="578.7295632666015" r="5" fill="#ff441d" stroke="white" strokeWidth="2" id="annotation-27143656" annotation-id="27143656" />
<circle cx="24.85685394692421" cy="591.1443864196777" r="5" fill="#ff441d" stroke="white" strokeWidth="2" id="annotation-27143657" annotation-id="27143657" /> */}
    </svg>

  );
}

export default LEsvg;
