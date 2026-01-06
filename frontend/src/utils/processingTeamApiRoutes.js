export const host = process.env.NEXT_PUBLIC_HOST;


export const registerProcessingTeam = `${host}/api/processingTeam/registerProcessingTeam`;
export const loginProcessingTeam = `${host}/api/processingTeam/loginProcessingTeam`;
export const checkForProcessingTeamExist = `${host}/api/processingTeam/checkForProcessingTeamExist`;
export const updateProcessingTeamStatus = `${host}/api/processingTeam/updateProcessingTeamStatus`;
export const getProcessingTeamByIds = `${host}/api/processingTeam/getProcessingTeamByIds`;
export const updateAssignedProjectsInProcessingTeam = `${host}/api/processingTeam/updateAssignedProjectsInProcessingTeam`;
export const getAllProcessingTeam = `${host}/api/processingTeam/getAllProcessingTeam`;
