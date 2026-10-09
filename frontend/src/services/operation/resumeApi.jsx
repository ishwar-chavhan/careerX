// src/services/operation/resumeAPI.js
// Same style as your other operation files: apiConnector(method, url, body, headers)
// and the token passed in as the last argument.
//
// Check these two import lines against your project:
//   - apiConnector file name/case  ("../apiConnector" or "../apiconnector")
//   - resumeEndpoints must be added to apis.js first (see resumeEndpoints.snippet.js)
import { apiConnector } from "../apiConnector";
import { resumeEndpoints } from "../apis";

const {
    CREATE_RESUME_API,
    GET_MY_RESUMES_API,
    GET_RESUME_BY_ID_API,
    UPDATE_RESUME_API,
    DELETE_RESUME_API,
    AI_IMPROVE_POINTS_API,
} = resumeEndpoints;

const authHeader = (token) => ( { Authorization: `Bearer ${token}` });

// axios puts the backend message in error.response.data.message.
// The pages show this message, so we throw it instead of hiding the error.
const toError = (error) =>
    new Error(error?.response?.data?.message || error?.message || "Something went wrong");

// all resumes of the logged in user (full documents, newest edited first)
export const getMyResumes = async (token) => {
    try {
        const response = await apiConnector("GET", GET_MY_RESUMES_API, null, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.log("error in getMyResumes", error);
        throw toError(error);
    }
};

export const getResumeById = async (resumeId, token) => {
    try {
        const response = await apiConnector("GET", `${GET_RESUME_BY_ID_API}/${resumeId}`, null, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.log("error in getResumeById", error);
        throw toError(error);
    }
};

// data = { title, contact, skills, experience, projects, education }
export const createResume = async (data, token) => {
    try {
        const response = await apiConnector("POST", CREATE_RESUME_API, data, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.data; // the created resume (has _id)
    } catch (error) {
        console.log("error in createResume", error);
        throw toError(error);
    }
};

export const updateResume = async (resumeId, data, token) => {
    try {
        const response = await apiConnector("PUT", `${UPDATE_RESUME_API}/${resumeId}`, data, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.log("error in updateResume", error);
        throw toError(error);
    }
};

export const deleteResume = async (resumeId, token) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_RESUME_API}/${resumeId}`, null, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return true;
    } catch (error) {
        console.log("error in deleteResume", error);
        throw toError(error);
    }
};

// data = { type: "workExperience" | "project", title, organization, startDate, endDate, points }
// returns an array of improved bullet points (strings, **bold** markers inside)
export const improveResumePoints = async (data, token) => {
    try {
        const response = await apiConnector("POST", AI_IMPROVE_POINTS_API, data, authHeader(token));
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.data.points;
    } catch (error) {
        console.log("error in improveResumePoints", error);
        throw toError(error);
    }
};