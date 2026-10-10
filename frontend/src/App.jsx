// import './App.css'
import Home from "./pages/Home";
import Navbar from './component/HomePage/Navbar';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/signUp";
import OtpVerify from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import IndustrySelect from "./component/industrialTrends/industrySelect";
import IndustryInsights from "./component/industrialTrends/industryInsights";
import InterviewResult from "./component/InterviewPage/InterviewResult";
import InterviewExam from "./component/InterviewPage/InterviewExam";
import InterviewHistory from "./component/InterviewPage/InterviewHistory";
import InterviewSelect from "./component/InterviewPage/InterviewSelect";
import ResumeList from "./component/ResumePage/ReumeList";
import ResumeEditor from "./component/ResumePage/ResumeEditor";
// import ResumePreview from "./component/ResumePage/ResumePreview";
import PrivateRoute from "./component/AuthPages/PrivateRoute";
import PublicRoute from "./component/AuthPages/PublicRoute";
function App() {
  return (
    <div className="overflow-x-hidden bg-[radial-gradient(circle_at_50%_0%,#020b18_0%,#000814_60%,#00060f_100%)] h-screen w-screen">
      <div className="border-b border-richblack-300 pb-2">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />



      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/Otp-verify" element={<OtpVerify />} />
        {/* <Route path="/reset-password" element={<OtpVerify />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>


     
      <Route element={<PrivateRoute />}>
      <Route path="/industrial-trends" element={<IndustrySelect />} />
      <Route path="/industrial-trends/:industry" element={<IndustryInsights />} />
      <Route path="/ai-interview" element={<InterviewSelect />} />
      <Route path="/ai-interview/:count" element={<InterviewExam />} />
      <Route path="/ai-interview/history" element={<InterviewHistory />} />
      <Route path="/ai-interview/result/:count" element={<InterviewResult />} />
      <Route path="/resume-builder" element={<ResumeList />} />
      <Route path="/resume-builder/new" element={<ResumeEditor />} />
      <Route path="/resume-builder/:id" element={<ResumeEditor />} />
      </Route>
    </Routes>
    </div >
  )
}

export default App
