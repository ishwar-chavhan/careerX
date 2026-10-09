const BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.REACT_APP_BASE_URL || "";

export const authEndpoint = {
        SENDOTP_API: `${BASE_URL}/auth/OtpSend`,
        SIGNUP_API: `${BASE_URL}/auth/signUp`,
        LOGIN_API: `${BASE_URL}/auth/login`,
        RESETPASSTOKEN_API: `${BASE_URL}/auth/resetPasswordToken`,
        RESETPASSWORD_API: `${BASE_URL}/auth/resetPassword`,
        CHANGEPASSWORD_API: `${BASE_URL}/auth/changePassword`
};


export const industrialEndpoint = {
        INDUSTRY_TRENDS: `${BASE_URL}/industry/industrialData`,
        // SIGNUP_API: `${BASE_URL}/auth/signUp`,
}

export const interviewEndpoint = {
        GENERATE_QUESTION_API: BASE_URL + "/interview/generateInterviewQuestion",
        GET_QUESTION_API: BASE_URL + "/interview/getInterviewQuestion",
        GET_FEEDBACK_API: BASE_URL + "/interview/getAIsFeedBack",
        GET_HISTORY_API: BASE_URL + "/interview/getInterviewHistory",
        GET_RESULT_API: BASE_URL + "/interview/getInterviewResult",
};


export const resumeEndpoints = {
  CREATE_RESUME_API: BASE_URL + "/resume/create",
  GET_MY_RESUMES_API: BASE_URL + "/resume/my-resumes",
  GET_RESUME_BY_ID_API: BASE_URL + "/resume",            // + "/:resumeId"
  UPDATE_RESUME_API: BASE_URL + "/resume/update",        // + "/:resumeId"
  DELETE_RESUME_API: BASE_URL + "/resume/delete",        // + "/:resumeId"
  AI_IMPROVE_POINTS_API: BASE_URL + "/resume/ai-improve-description",
};
 

export const accountEndpoints = {
  UPDATE_USER_INFO_API: BASE_URL + "/auth/updateUserInfo",           // POST  additional details
  UPDATE_PROFILE_PICTURE_API: BASE_URL + "/auth/updateProfilePicture", // POST  profile picture
};
 