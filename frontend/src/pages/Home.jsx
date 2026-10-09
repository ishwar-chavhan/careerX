import Navbar from "../component/HomePage/Navbar";
import Hero from "../component/HomePage/Hero";
import InterviewSection from "../component/HomePage/InterviewSection";
import ResumeSection from "../component/HomePage/ResumeSection";
import TrendSection from "../component/HomePage/TrendSection";
import WorkingSection from "../component/HomePage/WorkingSection";
import FooterSection from "../component/HomePage/FooterSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ResumeSection />
      <InterviewSection />
      <TrendSection />
      <WorkingSection />
      <FooterSection />

    </div>
  );
}
