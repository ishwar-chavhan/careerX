import toast from "react-hot-toast";
import { interviewEndpoint } from "../apis";
import { apiConnector } from "../apiConnector";

const { GENERATE_QUESTION_API, GET_QUESTION_API, GET_FEEDBACK_API, GET_HISTORY_API, GET_RESULT_API } = interviewEndpoint;

// POST /generateInterviewQuestion  -> { _id, field, interviewCount, questions: [9 strings] }
export const generateInterviewQuestions = async (field, count, token) => {
    const toastId = toast.loading("Preparing your interview...");
    let result = null;
    try {
        const response = await apiConnector("POST", GENERATE_QUESTION_API, { field, count }, { Authorization: `Bearer ${token}` });
        if (!response.data.success) throw new Error(response.data.message);
        result = response.data.data;
    } catch (error) {
        console.log("GENERATE_QUESTION_API ERROR....", error);
        toast.error(error.response?.data?.message || error.message || "Could not generate questions");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// POST /getInterviewQuestion -> used on page refresh to reload the same questions
export const getInterviewQuestions = async (count, token) => {
    let result = null;
    try {
        const response = await apiConnector("POST", GET_QUESTION_API, { count }, { Authorization: `Bearer ${token}` });
        if (!response.data.success) throw new Error(response.data.message);
        const list = response.data.questions;
        result = list[list.length - 1]; // latest one if there are duplicates
    } catch (error) {
        console.log("GET_QUESTION_API ERROR....", error);
        toast.error(error.response?.data?.message || "Could not load questions");
    }
    return result;
};

// POST /getAIsFeedBack -> { feedback: { feedback, score } }  (one call per answered question)
export const getAIsFeedback = async (count, question, answer, token) => {
    try {
        const response = await apiConnector("POST", GET_FEEDBACK_API, { count, question, answer }, { Authorization: `Bearer ${token}` });
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.feedback;
    } catch (error) {
        console.log("GET_FEEDBACK_API ERROR....", error);
        return null;
    }
};

// POST /getInterviewHistory -> [{ count, field, date, totalQuestions, answered, totalScore }]  (newest first, max 7)
export const getInterviewHistory = async (token) => {
    try {
        const response = await apiConnector("POST", GET_HISTORY_API, {}, { Authorization: `Bearer ${token}` });
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.history;
    } catch (error) {
        console.log("GET_HISTORY_API ERROR....", error);
        toast.error(error.response?.data?.message || "Could not load interview history");
        return [];
    }
};

// POST /getInterviewResult -> { count, field, date, results: [{ question, answer, feedback, score } | { question, skipped }] }
export const getInterviewResult = async (count, token) => {
    try {
        const response = await apiConnector("POST", GET_RESULT_API, { count }, { Authorization: `Bearer ${token}` });
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.result;
    } catch (error) {
        console.log("GET_RESULT_API ERROR....", error);
        toast.error(error.response?.data?.message || "Could not load result");
        return null;
    }
};