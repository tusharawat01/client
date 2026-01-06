"use client"

import { atom } from 'recoil';

export const currentUserState = atom({
	key:"currentUserState",
	default:''
})

export const currentTabState = atom({
	key:"currentTabState",
	default:'Dashboard'
})

export const sideBarExtendState = atom({
	key:"sideBarExtendState",
	default:true
})

export const openSideBarMobileState = atom({
	key:"openSideBarMobileState",
	default:false
})

export const currentChatState = atom({
	key:"currentChatState",
	default:""
})

export const chatsState = atom({
	key:"chatsState",
	default:[]
})

export const bottomHideState = atom({
	key:"bottomHideState",
	default:false
})

export const tempDataState = atom({
	key:"tempDataState",
	default:''
})

export const userRefetchTriggerState = atom({
	key:"userRefetchTriggerState",
	default:false
})

export const messagesRefetchTriggerState = atom({
	key:"messagesRefetchTriggerState",
	default:false
})

export const arrivalMessageState = atom({
	key:"arrivalMessageState",
	default:''
})

export const currentKmlState = atom({
	key:"currentKmlState",
	default:''
})
 
export const inCallState = atom({
	key:"inCallState",
	default:false
})

export const currentCallerState = atom({
	key:"currentCallerState",
	default:''
})

export const callerIdState = atom({
	key:"callerIdState",
	default:''
})

export const inGroupCallState = atom({
	key:"inGroupCallState",
	default:false
})

export const callNowState = atom({
	key:"callNowState",
	default:false
})

export const currentPeerState = atom({
	key:"currentPeerState",
	default:''
})

export const alertTheUserForIncomingCallState = atom({
	key:'alertTheUserForIncomingCallState',
	default:''
})

export const remotePeerIdState = atom({
	key:"remotePeerIdState",
	default:''
})

export const acceptedState = atom({
	key:"acceptedState",
	default:false
})

export const currentRoomIdState = atom({
	key:"currentRoomIdState",
	default:''
})

export const currentGroupPeerState = atom({
	key:"currentGroupPeerState",
	default:''
})

export const groupCallerState = atom({
	key:"groupCallerState",
	default:''
})

export const currentProjectState = atom({
	key:"currentProjectState",
	default:''
})

export const dataState = atom({
	key:"dataState",
	default:[]
})

export const refreshData = atom({
	key:"refreshData",
	default:false
})

export const currentMainTabState = atom({
	key:"currentMainTabState",
	default:'projectInfo'
})