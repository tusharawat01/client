"use client"
import {useState,useEffect,useRef} from 'react'
import {RiSearch2Line} from 'react-icons/ri';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {useRecoilState} from 'recoil';
import {currentUserState,currentProjectState,dataState,
	refreshData} from '../atoms/userAtom';
import { useMapEvents } from 'react-leaflet/hooks'
import {MdPerson} from 'react-icons/md';
import {HiOutlineLogout} from 'react-icons/hi';
import { MapContainer, TileLayer,Marker,Popup, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import {IoIosArrowUp} from 'react-icons/io';
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';
import '@annotorious/react/annotorious-react.css';
import Toolbar from '@recogito/annotorious-toolbar/src';
import SelectorPack from '@recogito/annotorious-selector-pack/src';
import AnnotoriousTFSuggestions from '@recogito/annotorious-tensorflow-tag-suggestions';
import AnnotoriousHover from '@recogito/annotorious-hover-tooltip';
import TiltedBox from '@recogito/annotorious-tilted-box'
import panzoom from 'panzoom';
import Zoom from 'react-medium-image-zoom'
import {MdOutlineChevronLeft} from 'react-icons/md';
import {MdOutlineZoomIn} from 'react-icons/md';
import 'react-medium-image-zoom/dist/styles.css';
import {RxCross2} from 'react-icons/rx'
// import MapComponent from './ClientSpecialComponents/MapComponent';
import ImageTagTab from './ClientThermalComponents/ImageTagTab';
import AnalyseTab from './ClientThermalComponents/AnalyseTab';
import UploadTab from './ClientThermalComponents/UploadTab';
import DetailsTab from './ClientThermalComponents/DetailsTab';
import SiteTab from './ClientThermalComponents/SiteTab';
import ProcessedDataViewer from './ClientThermalComponents/ProcessedDataViewer';
import exifr from 'exifr';
import {updateAnnotations} from '../utils/ApiRoutes';
import axios from 'axios';

function MyComponent() {
  const map = useMapEvents({
    click: (e) => {
      console.log(e)
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })
  return null
}

const data = [
	'/100_0125/PANO0001.JPG',
	'/100_0125/PANO0002.JPG',
	'/100_0125/PANO0003.JPG',
	'/100_0125/PANO0004.JPG',
	'/100_0125/PANO0005.JPG',
	'/100_0125/PANO0006.JPG',
	'/100_0125/PANO0007.JPG',
	'/100_0125/PANO0008.JPG',
	'/100_0125/PANO0009.JPG',
	'/100_0125/PANO0010.JPG',
	'/100_0125/PANO0011.JPG',
	'/100_0125/PANO0012.JPG',
	'/100_0125/PANO0013.JPG',
	'/100_0125/PANO0014.JPG',
	'/100_0125/PANO0015.JPG',
	'/100_0125/PANO0016.JPG',
]

var zoomInstance;
var anno;
var annoData = {};

export default function ClientThermalComponent() {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState);
	const [currentTab,setCurrentTab] = useState('processedData');
	const [searchValue,setSearchValue] = useState('');
	const [openProfileOptions,setOpenProfileOptions] = useState(false);
	const [openImageSelector,setOpenImageSelector] = useState(false);
	const [currentImage,setCurrentImage] = useState('');
	const [zoomEnable,setZoomEnable] = useState(false);
	const [openMap,setOpenMap] = useState(true);
	const [currentSelection,setCurrentSelection] = useState(false);
	const [tag,setTag] = useState('');
	const [issue,setIssue] = useState('');
	const [severity,setSeverity] = useState('1');
	const mapRef = useRef(null);	
	const annotoriousRef = useRef(null);
	const [markersData,setMarkersData] = useState([]);
	const [data,setData] = useRecoilState(dataState);
	const [addToData,setAddToData] = useState('');
	const [refresh,setReferesh] = useRecoilState(refreshData);
	const [closeHeader,setCloseHeader] = useState(true);


	  useEffect(() => {
	  	setCurrentImage('');
	    const initAnnotorious = async () => {
	      const imageElement = document.getElementById('image');
	      const imageContainer = document.getElementById('image-container')
	      // Initialize Annotorious
	      anno = new Annotorious({
	        image: imageElement,
	        // drawOnSingleClick:true,
	        widgets: [
	          'COMMENT',
	          'TAG',
	        ]
	      });
	      console.log(anno)
	      anno.disableEditor = !anno.disableEditor;
	      anno.setAuthInfo({
	        id: 'http://recogito.example.com/rainer',
	        displayName: 'Thejashari'
	      });
	      // AnnotoriousTFSuggestions(anno);
	      SelectorPack(anno);
	      TiltedBox(anno);
	      const toolbar = Toolbar(anno,document.getElementById('toolbar-container'),{
	        'drawingTools': ['polygon', 'rect', 'circle','pointer']
	      });

	      AnnotoriousHover(anno);
	      anno.setDrawingTool('annotorious-tilted-box');

	      anno.on('changeSelectionTarget', function(target) {
	        // when the shape of a newly created selection
	      });
	      anno.on('cancelSelection', function(selection) {
	        // do something
	      });
	      anno.on('selectAnnotation', function(annotation) {
	        console.log('selected', annotation);
	      });
	      anno.on('createAnnotation', function(a) {
	        console.log('created', a);
	        setAddToData(a);
	        
	      });
	      anno.on('updateAnnotation', function(annotation, previous) {
	        console.log('updated', previous, 'with', annotation);
	      });
	      anno.on('deleteAnnotation', function(annotation) {
	        console.log('deleted', annotation);
	      });
	      anno.on('mouseEnterAnnotation', function(annotation, event) {
	        console.log('mouseEnter', annotation);
	      });
	      anno.on('mouseLeaveAnnotation', function(annotation, event) {
	        console.log('mouseLeave', annotation);
	      });
	      anno.on('createSelection', async function(selection) {
				  getDetailsAndSave(selection);
				  

				  // Or: anno.updateSelected(selection, true);
				});

	      annotoriousRef.current = anno;

	      
	    };
	    if(currentTab === 'analyse'){
	    	initAnnotorious();
	    }

	    // // Clean up
	    // return () => {
	    //   if (annotoriousRef?.current) {
	    //     annotoriousRef?.current?.destroy();
	    //   }
	    // };
	  }, [currentTab]);


	  const updateAnnotationInImage = async(annotations) => {
	  	const {data} = await axios.post(updateAnnotations,{
	  		id:currentImage?._id,
	  		annotations
	  	})
	  	if(data.status){
	  		setReferesh(true);
	  	}else{
	  		alert("Cant update the annotations");
	  	}
	  }

	  useEffect(()=>{
	  	if(addToData){
		  	console.log(currentImage._id)
		  	if(annoData?.[currentImage._id]){
		    	annoData[currentImage._id] = [...annoData[currentImage._id],addToData];
		  	}else{
		    	annoData[currentImage._id] = [addToData];
		  	}
		    setAddToData('');
		    updateAnnotationInImage(annoData[currentImage?._id])
	  	}
	  },[addToData])

	  useEffect(()=>{
	    const imageContainer = document.getElementById('image-container')

	  	if(zoomEnable){
	  		zoomInstance = panzoom(imageContainer,{
				  maxZoom: 10,
				  minZoom: 1
				});
	  	}else{
	  		if(zoomInstance){
	  			zoomInstance.dispose()
	  		}
	  	}
	  },[zoomEnable])

	const getDetailsAndSave = async(selection) => {
		setCurrentSelection(selection);
	}	

	const saveSelection = async(selection,tag,issue,severity) => {
		selection.body = [{
	    type: 'TextualBody',
	    severity,
	    purpose: issue,
	    value: tag
	  }];

	  // Make sure to wait before saving!
	  await anno.updateSelected(selection);
	  anno.saveSelected();
	  setCurrentSelection('');
	}

	useEffect(()=>{
		if(currentImage){
			anno.clearAnnotations();
			// console.log(annoData?.[currentImage],annoData[currentImage]);
			if(currentImage?.annotations){
				currentImage?.annotations?.forEach((image)=>{
					anno.addAnnotation(image);
				})
			}
		}
	},[currentImage])
	

	return (
	<>
		<div className={`fixed h-full w-full ${currentSelection ? 'top-0' : 'top-[100%]'} overflow-hidden 
		flex items-center justify-center p-14 bg-black/50 z-50`}>
			<div className="flex flex-col bg-gray-50 border-[1px] w-[300px] border-gray-400 rounded-lg">
				<div className="w-full flex items-center justify-between gap-14 px-3 py-2 shadow-md border-b-[1px] border-gray-700">
					<p className="text-md font-semibold text-gray-900">Details</p>
					<div onClick={()=>{
						anno.cancelSelected(currentSelection);
						setCurrentSelection('');
					}} className="rounded-full flex items-center justify-center p-1 hover:bg-gray-200 
					transition-all duration-200 ease-in-out">
						<RxCross2 className="h-5 w-5 text-gray-900"/>
					</div>
				</div>
				<div className="p-2 flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<p className="text-md font-semibold text-gray-900">Tag <span className="text-red-500">*</span></p>
						<div className="px-2 py-1 rounded-lg bg-white border-[1px] border-gray-300 focus-within:border-blue-500">
							<input type="text" className="outline-none bg-transparent text-sm 
							placeholder:text-gray-500 text-gray-900 w-full" placeholder="Enter tag"
							value={tag} onChange={(e)=>setTag(e.target.value)} />
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-md font-semibold text-gray-900">Issue <span className="text-red-500">*</span></p>
						<div className="px-2 py-1 rounded-lg bg-white border-[1px] border-gray-300 focus-within:border-blue-500">
							<textarea type="text" className="outline-none bg-transparent text-sm resize-none h-[50px] 
							placeholder:text-gray-500 text-gray-900 w-full" placeholder="Enter issue details"
							value={issue} onChange={(e)=>setIssue(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-md font-semibold text-gray-900">Severity Level</p>
						<div className="px-2 py-1 rounded-lg bg-white border-[1px] border-gray-300 focus-within:border-blue-500">
							<select className="outline-none bg-transparent text-sm 
							placeholder:text-gray-500 text-gray-900 w-full"
							value={severity} onChange={(e)=>setSeverity(e.target.value)}
							>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
						</div>
					</div>

				</div>



				<div className="w-full flex items-center justify-end gap-2 px-3 py-2 shadow-md border-t-[1px] border-gray-400">
					<button 
					onClick={()=>{
						anno.cancelSelected(currentSelection);
						setCurrentSelection('');
					}}
					className="bg-transparent text-black px-5 py-2 text-md hover:bg-gray-100 transition-all 
					duration-200 ease-in-out font-normal">
						Cancel
					</button>
					<button 
					onClick={()=>{saveSelection(currentSelection,tag,issue,severity)}}
					className="bg-blue-500 text-white px-5 py-2 rounded-md text-md font-normal hover:bg-blue-600">
						Save
					</button>
				</div>
			</div>

		</div>
		<div className={`fixed ${closeHeader ? '-top-[100%]' : 'top-0'} transition-all duration-200 
		ease-in-out w-full px-5 flex items-center justify-between py-3 bg-[#292929] z-30`}>
			<div className="flex items-center gap-3" >
				<div className="px-3 border-r-[1px] border-gray-600">
					<h1 className="text-md font-semibold text-gray-200">{currentProject?.name}</h1>
				</div>
				<div className="flex items-center gap-2">
					<div 
					onClick={()=>setCurrentTab('details')}
					className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
					ease-in-out ${currentTab === 'details' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
						Details
					</div>
					<div 
					onClick={()=>setCurrentTab('sites')}
					className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
					ease-in-out ${currentTab === 'sites' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
						Sites
					</div>
					<div 
					onClick={()=>setCurrentTab('analyse')}
					className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
					ease-in-out ${currentTab === 'analyse' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
						Analyse
					</div>
					{
						!currentUser?.clientIndustry?.includes("Drone Service Provider") || currentProject?.dataCollection.toLowerCase() === 'not required' &&
						<>
							<div 
							onClick={()=>setCurrentTab('upload')}
							className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
							ease-in-out ${currentTab === 'upload' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
								Upload
							</div>
							<div 
							onClick={()=>setCurrentTab('tag')}
							className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
							ease-in-out ${currentTab === 'tag' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
								Tag Images
							</div>
						</>
					}
					<div 
					onClick={()=>{setCurrentTab('processedData');setCloseHeader(true)}}
					className={`px-3 py-2 text-gray-100 hover:bg-gray-700  transition-all text-sm duration-200 
					ease-in-out ${currentTab === 'processedData' ? 'border-blue-500 border-b-[1.4px] pb-[6.6px]' : 'pb-2 border-transparent'} cursor-pointer rounded-lg`}>
						Deliverables
					</div>
				</div>
			</div>
			<div className="gap-3">
				
				<MdPerson 
				onClick={()=>setOpenProfileOptions(!openProfileOptions)}
				className="h-8 w-8 text-gray-300 cursor-pointer"/>
			</div>
		</div>
		{
			currentTab === 'analyse' ? 
			<AnalyseTab currentTab={currentTab}
				openMap={openMap} currentImage={currentImage} zoomEnable={zoomEnable} 
				MdOutlineZoomIn={MdOutlineZoomIn}	MdOutlineChevronLeft={MdOutlineChevronLeft} 
				setOpenImageSelector={setOpenImageSelector} openImageSelector={openImageSelector}
				IoIosArrowUp={IoIosArrowUp} data={data} setCurrentImage={setCurrentImage}
				setMarkersData={setMarkersData} markersData={markersData} setZoomEnable={setZoomEnable}
				mapRef={mapRef} MapContainer={MapContainer} LayersControl={LayersControl} setOpenMap={setOpenMap}
				TileLayer={TileLayer} Marker={Marker} Popup={Popup} MyComponent={MyComponent} currentProject={currentProject}
			/>
			:
			currentTab === 'tag'?
			<ImageTagTab currentProject={currentProject} data={data}
			setCurrentProject={setCurrentProject} currentTab={currentTab}
			setCurrentTab={setCurrentTab}
			/>
			:
			currentTab === 'upload'?
			<UploadTab project={currentProject} setProject={setCurrentProject}
			setCurrentTab={setCurrentTab} setCloseHeader={setCloseHeader}
			/>
			:
			currentTab === 'details'?
			<DetailsTab currentProject={currentProject} setCurrentProject={setCurrentProject}

			/>
			:
			currentTab === 'sites' ?
			<SiteTab currentProject={currentProject} setCurrentProject={setCurrentProject} 
			closeHeader={closeHeader} setCloseHeader={setCloseHeader} />
			:
			currentTab === 'processedData' ?
			<ProcessedDataViewer currentProject={currentProject} setCurrentProject={setCurrentProject}
			currentTab={currentTab} setCurrentTab={setCurrentTab} setCloseHeader={setCloseHeader}
			MdPerson={MdPerson} setOpenProfileOptions={setOpenProfileOptions}
			openProfileOptions={openProfileOptions} currentUser={currentUser} />
			:
			''
		}



		<div className={`fixed ${openProfileOptions ? 'right-3' : '-right-[100%]'} top-[70px] flex rounded-lg overflow-hidden 
		flex-col bg-gray-900 transition-all duration-200 ease-in-out `}>
			<div className="px-3 py-2 border-b-[1px] hover:bg-gray-800 transition-all duration-200 ease-in-out border-gray-500">
				<h1 className="text-sm font-semibold text-gray-200">Hi! {currentUser?.name}</h1>
			</div>
			<div className="px-3 py-2 group border-gray-500 hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
				<h1 className="text-sm font-semibold text-gray-200 group-hover:text-red-400 flex items-center gap-1"> 
					<HiOutlineLogout className="h-4 w-4"/>
					Log out
				</h1>
			</div>
		</div>
	</>

	)
}