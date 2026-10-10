import { industrialEndpoint } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { getErrorMessage } from "../../utils/errorMessage";
const {
    INDUSTRY_TRENDS
} = industrialEndpoint;

export const fetchIndustryInsight = async (industry, token) => {
    const toastId = toast.loading("...loading");
    let result;
    try {
        const response = await apiConnector("POST", INDUSTRY_TRENDS, { industry },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error("something is wrong in industrial trend controller");
        }

        result = response.data.data;
    } catch (error) {
        console.log("Industry fetch error:", error);
         toast.error(getErrorMessage(error, "Industry fetch error"));
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}