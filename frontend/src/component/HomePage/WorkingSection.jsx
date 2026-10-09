import { Link } from "react-router-dom";

export default function WorkingSection() {

    const benefits = [
        {
            icon: "✨",
            title: "AI-POWERED",
            description: "Get intelligent assistance to improve your resume and interview preparation.",
            highlight: "Smarter preparation"
        },
        {
            icon: "🎯",
            title: "PERSONALIZED",
            description: "Get career guidance based on your skills, interests and target role.",
            highlight: "Built around you"
        },
        {
            icon: "⚡",
            title: "ALL-IN-ONE",
            description: "Resume building, AI interviews and industry insights in one platform.",
            highlight: "Everything in one place"
        },
        {
            icon: "📊",
            title: "DATA-DRIVEN",
            description: "Understand industry demand, salary ranges and trending technologies.",
            highlight: "Make informed decisions"
        },
    ]

    return (
        <section className="px-10 max-w-[1200px] w-11/12 mx-auto text-white py-16">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-[30px] font-semibold">
                    <span className="text-purple-800">✦</span> WHY CAREERX?
                </h2>
                <p className="text-[18px] text-slate-400">
                    Everything you need to become placement-ready.
                </p>
                <div className="w-full h-1 bg-richblack-300"></div>
                <div className="flex gap-10 mt-5 ">
                    {
                        benefits.map((benefit, index) => (
                            <div key={index} className="relative flex items-center flex-col gap-3 w-[250px] text-center
                                  bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                                
                                ">

                                <h3>
                                    <span>{benefit.icon}</span>
                                    {benefit.title}
                                </h3>
                                <p>{benefit.description}</p>
                                <p>
                                    {benefit.highlight}
                                </p>
                                <div
                                    className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                        w-4/5 h-[2px]
                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                                />
                            </div>
                        ))}
                </div>
                <div className="w-full h-1 mt-4 bg-richblack-300"></div>

                <h2 className="text-[30px] font-semibold">
                    READY TO UPGRADE YOUR CAREER?
                </h2>
                <p className="text-[18px] text-slate-400">
                    Build. Practice. Understand. Get placement-ready.
                </p>
                <Link to="/login" className="px-10 rounded-lg hover:scale-95 text- py-3
                mt-3 bg-richblack-800  hover:text-white  w-[400px] text-center
             mx-auto  text-purple-700 text-lg font-semibold
             hover:bg-purple-900 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-1000">
                    ✨ Get Started
                </Link>
            </div>
        </section>
    );
}
