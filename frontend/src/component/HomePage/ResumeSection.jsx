import { Link } from "react-router-dom";

export default function ResumeSection() {
    const steps = [
        {
            number: "1",
            icon: "👤",
            title: "YOUR INFO",
            description: "Add your education, skills & experience.",
            highlight: "Simple & guided"
        },
        {
            number: "2",
            icon: "✨",
            title: "AI BOOST",
            description: "AI improves your experience & project descriptions.",
            highlight: "AI-powered writing"
        },
        {
            number: "3",
            icon: "📄",
            title: "YOUR RESUME",
            description: "Preview your resume and download it.",
            highlight: "Professional & ATS-friendly"
        }
    ];
    return (
        <section id="resume" className="px-10 max-w-[1200px] w-11/12 mx-auto text-white py-16 ">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-[30px] font-semibold">
                    <span className="text-purple-800">✦</span> AI RESUME BUILDER
                </h2>
                <p className="text-[18px] text-slate-400">
                    Build a Resume That Gets Noticed
                </p>

                <div className="w-full h-1 bg-richblack-300"></div>
                <p className="w-[60%] text-[18px] text-center">
                    Create a professional, ATS-friendly resume with the help of AI.
                    Just provide your details and let AI improve your content.
                </p>
                <Link to="resume-builder" className="px-10 rounded-lg hover:scale-95 text- py-2
                mt-3 bg-richblack-800  hover:text-white 
             mx-auto  text-purple-700 text-lg font-semibold
             hover:bg-purple-900 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-1000">
                    📄 Build My Resume
                </Link>
                <div className="flex gap-30 mt-5 ">
                    {
                        steps.map((ele, index) => (
                            <div key={index} className="relative flex items-center flex-col gap-3 w-[250px] text-center
                                  bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                                
                                ">
                                <h2>
                                    {ele.number}
                                </h2>
                                <p>
                                    <span>
                                        {ele.icon}
                                    </span>
                                    {
                                        ele.title
                                    }
                                </p>
                                <p>
                                    {
                                        ele.description
                                    }
                                </p>
                                <p>
                                    {
                                        ele.highlight
                                    }
                                </p>

                                <div
                                    className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                                        w-4/5 h-[2px]
                                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="relative w-full h-[2px] mt-24 ">
                <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_20px_#8B5CF6]" />
            </div>
        </section>
    );
}
