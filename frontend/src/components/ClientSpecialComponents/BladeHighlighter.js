import React, { useState, useEffect } from 'react';
import SSsvg from './Blades/SS';
import LEsvg from './Blades/LE';
import TEsvg from './Blades/TE';
import PSsvg from './Blades/PS';

// demo blade data
const bladeDemoData = {
  blades: {
    'A': {
      sides: [
        { side: 'SS', numOfImg: 30 },
        { side: 'PS', numOfImg: 35 },
        { side: 'TE', numOfImg: 20 },
        { side: 'LE', numOfImg: 40 },
      ],
      size: 50,
      serial: 4141151
    },
    'B': {
      sides: [
        { side: 'SS', numOfImg: 20 },
        { side: 'PS', numOfImg: 34 },
        { side: 'TE', numOfImg: 22 },
        { side: 'LE', numOfImg: 10 },
      ],
      size: 53,
      serial: 1414231
    },
    'C': {
      sides: [
        { side: 'SS', numOfImg: 40 },
        { side: 'PS', numOfImg: 13 },
        { side: 'TE', numOfImg: 29 },
        { side: 'LE', numOfImg: 30 },
      ],
      size: 48,
      serial: 3134141
    },
  },
  model: 391,
  turbineName: 'My Tower',
  serial: 134141,
  make: 'MakTo'
};

const BladeHighlighter = ({ initialImgIdx = 0 }) => {
  const [selectedBlade, setSelectedBlade] = useState(Object.keys(bladeDemoData.blades)[0]);
  const [currImgIdx, setCurrImgIdx] = useState(initialImgIdx);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setCurrImgIdx((prevIdx) => prevIdx + 1);
      } else if (event.key === 'ArrowLeft') {
        setCurrImgIdx((prevIdx) => Math.max(prevIdx - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBladeSelect = (bladeKey) => {
    setSelectedBlade(bladeKey);
    setCurrImgIdx(0);
  };

  const blade = bladeDemoData.blades[selectedBlade];
  const height = blade.size;

  let cumulativeImgCount = 0;
  const sideWithImg = blade.sides.find((side) => {
    cumulativeImgCount += side.numOfImg;
    return currImgIdx < cumulativeImgCount;
  });

  return (
    <div className='flex h-full gap-2 '>
      <div className='bg-stone-800 rounded-xl h-fit text-sm text-white overflow-y-hidden pt-4 w-fit'>
        <h3 className='px-3 text-sm'>{bladeDemoData?.turbineName}</h3>
        <div className=' grid grid-cols-2 place-content-center gap-1 items-center justify-between my-2'>
          <div className='text-lg  text-center p-1'>
            {bladeDemoData?.model}
          </div>
          <div className='  text-sm items-center gap-3 mx-4 justify-evenly'>
            <div>
              <h4 className='text-gray-300 text-sm'>WTG Serial</h4>
              <p className='text-xs text-blue-400'>{bladeDemoData?.serial}</p>
            </div>
            <div>
              <h4 className='text-gray-300 text-sm'>Make</h4>
              <p className='text-xs text-blue-400'>{bladeDemoData?.make}</p>
            </div>
            <div>
              <h4 className='text-gray-300 text-sm'>Model</h4>
              <p className='text-xs text-blue-400'>{bladeDemoData?.model}</p>
            </div>
          </div>
        </div>
        {/* Blades SN */}
        <div className='p-2 text-sm flex my-3 justify-between items-center'>
          <div>
            <p className='text-gray-200 my-2'>Blade (SN: {blade.serial})</p>
            <div className='flex items-center mt-1 justify-center gap-2'>
              {Object.keys(bladeDemoData?.blades)?.map((bladeKey) => (
                <div key={bladeKey} onClick={() => handleBladeSelect(bladeKey)}>
                  <div className={`text-xl font-semibold cursor-pointer hover:bg-gray-900 w-10 h-10 shadow border-t border-l border-r flex items-center justify-center border-gray-500 ${selectedBlade === bladeKey ? 'bg-gray-900' : ''}`}>
                    <p className='pt-2'>{bladeKey}</p>
                  </div>
                  <div className={`h-1 ${selectedBlade === bladeKey ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blades SVG and Sides */}
      <div className='bg-stone-800 h-full flex-1 relative rounded-xl w-[270px] min-w-[260px] p-1 grid shadow-lg' style={{ gridTemplateColumns: 'auto 1fr' }}>
        <div className='flex flex-col mx-2 items-center relative text-gray-200'>
          {/* Scale */}
          <div className='flex flex-col mx-2 absolute top-5 justify-center h-full'>
            <div className='border-l text-xs border-t border-gray-400 border-b w-2 relative h-[400px]'>
              <div className='flex justify-center items-center absolute -top-5'>{height}m</div>
              <div className='flex justify-center items-center absolute top-[46%] h-1 w-2 border-gray-400 pt-2 pl-2 border-t '>{height / 2}m</div>
              <div className='flex justify-center items-center absolute -bottom-4'>0m</div>
            </div>
          </div>
        </div>

        <div className='grid ml-1 grid-cols-4 gap-4 p-2'>
          {blade.sides?.map((side, idx) => {
            const isActive = side.side === sideWithImg.side;
            const highlightPosition = (currImgIdx % side.numOfImg) * height / side.numOfImg;
            const svgComponent = side.side === 'SS' ? <SSsvg hidebox={!isActive} highlightPosition={highlightPosition} />
              : side.side === 'LE' ? <LEsvg hidebox={!isActive} highlightPosition={highlightPosition} />
              : side.side === 'PS' ? <PSsvg hidebox={!isActive} highlightPosition={highlightPosition} />
              : <TEsvg hidebox={!isActive} highlightPosition={highlightPosition} />;

            return (
              <div key={idx} className='flex flex-col gap-3 py-2 items-center'>
                <p className='text-center p-1 px-2 bg-stone-700 w-fit h-fit rounded-md font-semibold text-white'>
                  {side?.side}
                </p>
                <div className='h-full opacity-80'>
                  {svgComponent}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BladeHighlighter;
