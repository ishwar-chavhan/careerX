import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import navbarX from "../../assets/navX.png"
import UserMenu from "../AuthPages/userMune";
import { AuthContext } from "../../context/authContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(AuthContext);

    return (
        <nav className="flex w-11/12 max-w-[1200px] mx-auto pt-2">
            <div className="flex justify-between w-full">
                <div className="text-white flex items-center justify-center" onClick={() => navigate("/")}>
                    <p className="text-2xl font-semibold">Career</p>
                    <img src={navbarX} width={70} className="-ml-4 mt-1" />
                </div>
                <div className="text-white flex items-center justify-center gap-8">
                    <Link to="/resume-builder" className={`transition-all  hover:text-neutral-500   duration-200 ${location.pathname.startsWith("/resume-builder")
                            ? "text-neutral-500 text-[20px] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                            : "text-white text-[16px] hover:text-[18px]"
                        }`}>
                        Resume Builder
                    </Link>
                    <Link to="/industrial-trends" className={`transition-all  hover:text-red-500  duration-200 ${location.pathname.startsWith("/industrial-trends")
                            ? "text-red-500 text-[20px] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                            : "text-white text-[16px] hover:text-[18px]"
                        }`} >
                        Industrial Trends
                    </Link>
                    <Link to="/ai-interview" className={`transition-all  hover:text-purple-500  duration-200 ${location.pathname.startsWith("/ai-interview")
                            ? "text-purple-500 text-[20px] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                            : "text-white text-[16px] hover:text-[18px]"
                        }`}>
                        AI Interview
                    </Link>
                </div>
                <div className="text-white flex items-center gap-6 justify-center">
                    {
                        token === null && (
                            <Link to="/login" className="px-4 py-2  hover:border border-richblack-300 bg-richblack-800 rounded-lg text-center ">
                                Login
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signUp" className="px-4 py-2  hover:border border-richblack-300 bg-richblack-800 rounded-lg text-center ">
                                SignUp
                            </Link>
                        )
                    }
                    {
                        token !== null && (
                            <UserMenu />
                        )
                    }
                </div>
            </div>
        </nav>
    );
}
