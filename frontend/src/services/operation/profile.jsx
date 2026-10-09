import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { accountEndpoints } from "../apis";
const { UPDATE_USER_INFO_API, UPDATE_PROFILE_PICTURE_API } = accountEndpoints;


const authHeader = (token) => ({ Authorization: `Bearer ${token}` });
const toError = (error) =>
    new Error(error?.response?.data?.message || error?.message || "Something went wrong");

export const updateAdditionalDetails = async (data, token, setUser) => {
    try {
        const { about, gender, contactNumber, dateOfBirth } = data;

        if (!about || !gender || !contactNumber || !dateOfBirth) {
            throw new Error("All fields are required");
        }
        if (!/^\d{7,15}$/.test(String(contactNumber))) {
            throw new Error("Contact number must contain digits only");
        }

        const response = await apiConnector("POST", UPDATE_USER_INFO_API,
            { about, gender, contactNumber, dateOfBirth },
            authHeader(token)
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (setUser) setUser(response.data.userDetails);

        toast.success("updated successfully")
        return response.data.userDetails;
    } catch (error) {
        console.log("error in updateAdditionalDetails", error);
        throw toError(error);
    }
};

/**
 * Upload / change the user's profile picture.
 * @param {File}     imageFile  - The selected image file
 * @param {string}   firstName  - User's first name (required by the backend)
 * @param {string}   lastName   - User's last name  (required by the backend)
 * @param {string}   token      - JWT auth token
 * @param {Function} setUser    - Context setter to update the user in memory
 */
export const updateProfilePicture = async (imageFile, firstName, lastName, token, setUser) => {
    const toastId = toast.loading("Uploading photo…");
    try {
        if (!imageFile) throw new Error("No image file provided");

        const formData = new FormData();
        formData.append("imageFile", imageFile);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);

        const response = await apiConnector(
            "POST",
            UPDATE_PROFILE_PICTURE_API,
            formData,
            {
                Authorization: `Bearer ${token}`,
                // Do NOT set Content-Type; the browser sets it with the correct boundary
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);

        toast.success("Profile picture updated!", { id: toastId });
        return updatedUser;
    } catch (error) {
        console.error("error in updateProfilePicture", error);
        toast.error(error?.response?.data?.message || error.message || "Upload failed", { id: toastId });
        return null;
    }
};
