import { authEndpoint } from "../apis";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";
const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSWORD_API,
    RESETPASSTOKEN_API,
    CHANGEPASSWORD_API
} = authEndpoint;


export async function sendotp(email, navigate) {
    const toastId = toast.loading("...loading");
    try {

        const response = await apiConnector("POST", SENDOTP_API, { email });

        console.log("SENDOTP API RESPONSE............", response);
        console.log(response.data.success);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("OTP Sent Successfully");
        navigate("/Otp-verify");

    } catch (error) {
        console.log("SENDOTP api error.......", error);
        // toast.error("could not send otp");
            toast.error(getErrorMessage(error, "could not send otp"));
    } finally {
        toast.dismiss(toastId);
    }
}


export async function login(email, password, navigate, setUser, setToken) {
    const toastId = toast.loading("...loading");
    try {
        const response = await apiConnector("POST", LOGIN_API, {
            email,
            password,
        });

        console.log("login api response.....", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("Login Successfully");

        const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

        localStorage.setItem("image", JSON.stringify(userImage));
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update context state
        if (setUser) setUser(response.data.user);
        if (setToken) setToken(response.data.token);

        navigate("/");
    } catch (error) {
        console.log("login api error.....", error);
        // toast.error("Login failed");
            toast.error(getErrorMessage(error, "Login failed"));
    } finally {
        toast.dismiss(toastId);
    }
}

export async function signUp(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {

    const toastId = toast.loading("...loading");
    try {
        const response = await apiConnector("POST", SIGNUP_API, {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
        })

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("signup successfully");
        navigate("/login");

    } catch (error) {
        console.log(error);
        // toast.error("Sign up failed");
            toast.error(getErrorMessage(error, "Sign up failed"));
    } finally {
        toast.dismiss(toastId);
    }
}

export const changePassword = async (data, token) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = data;
 
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            throw new Error("All fields are required");
        }
        if (newPassword !== confirmNewPassword) {
            throw new Error("New password and confirm password do not match");
        }
 
        const response = await apiConnector("POST", CHANGEPASSWORD_API,
            { oldPassword, newPassword, confirmNewPassword },
            { Authorization: `Bearer ${token}` }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
          toast.success("password changed successfully");
        return true;
    } catch (error) {
        console.log("error in changePassword", error);
           toast.error(getErrorMessage(error, "error in changePassword"));
        throw new Error(error);
    }
};

export const resetToken = async (data , token)=>{
    try {
        const response = await apiConnector("POST", RESETPASSTOKEN_API,
            data,
            { Authorization: `Bearer ${token}` }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("email sent successfully");
        return true;
    } catch (error) {
        console.log("error in resetToken", error);
        toast.error(getErrorMessage(error, ""));
        throw error;
    }
}


export const ResetPasswordNow=  async (data )=>{
    try {

        const { password, confirmPassword ,token} = data;
 
        if (!password ||  !confirmPassword) {
            throw new Error("All fields are required");
        }
        if (password !== confirmPassword) {
            throw new Error("New password and confirm password do not match");
        }
 

                const response = await apiConnector("POST", RESETPASSWORD_API,
          {password, confirmPassword , token }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("password reset successfully");

        return true;
    } catch (error) {
        console.log("error in resetToken", error);
            toast.error(getErrorMessage(error, "reset password failed"));
        throw error;
    }
}
