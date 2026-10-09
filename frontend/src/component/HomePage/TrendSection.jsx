import { Link } from "react-router-dom";

export default function TrendSection() {
    const trends = [
        { name: "React / Next.js", score: 18, demand: 90 },
        { name: "Node.js / Express", score: 16, demand: 80 },
        { name: "Docker / Kubernetes", score: 13, demand: 60 },
        { name: "TypeScript", score: 15, demand: 70 },
    ];

    return (
        <section id="trends" className="px-10 max-w-[1200px] w-11/12 mx-auto text-white py-16">
            <div className="flex flex-col  gap-4">
                <h2 className="text-center text-[30px] font-semibold">
                    <span className="text-purple-800">✦</span> INDUSTRIAL INSIGHT
                </h2>
                <p className="text-[18px] text-center text-slate-400">
                    Know Where Your Industry Is Going
                </p>

                <div className="w-full h-1 bg-richblack-300"></div>

                <p className="text-center text-[18px]">
                    Explore market demand, salaries, trending technologies and skills
                    shaping your future career.
                </p>
                <fieldset className="border mt-5  border-purple-500/30 rounded-xl p-6">
                    <legend className="px-3 text-purple-400 text-sm font-medium">
                        SOFTWARE / IT INDUSTRY
                    </legend>
                    <div className="flex justify-evenly  ">
                        <div className="text-center relative
                   space-y-2
                    bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                   " >
                            <p className="text-[20px]">
                                <span>
                                    💰
                                </span>
                                Expected Salary
                            </p>
                            <p className="text-richblack-100">
                                ₹6–15 LPA
                            </p>
                            <div
                                className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                        w-4/5 h-[2px]
                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                            />
                        </div>
                        <div className="relative text-center space-y-2
                    bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                   ">
                            <p className="text-[20px]">
                                <span>📈</span>
                                Industrial Growth
                            </p>
                            <p className="text-richblack-100">
                                High
                            </p>
                            <div
                                className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                        w-4/5 h-[2px]
                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                            />
                        </div>
                        <div className="relative text-center space-y-2
                    bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                   ">
                            <p className="text-[20px]">
                                <span>
                                    💼
                                </span>
                                Demand Level
                            </p>
                            <p className="text-richblack-100">
                                High
                            </p>
                            <div
                                className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                        w-4/5 h-[2px]
                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                            />
                        </div>

                    </div>
                    <div className="flex mt-7 gap-5">
                        <fieldset className="border border-purple-500/30 rounded-xl p-6 w-full">
                            <legend className="px-3 text-purple-400 text-sm font-medium">
                                <span>🎯</span> TOP SKILLS
                            </legend>

                            <ul className="list-disc pl-5  space-y-2 marker:text-[#8B5CF6]" >
                                <li>AI / Machine Learning</li>
                                <li> Cloud Computing </li>
                                <li>Generative AI</li>
                                <li>Cybersecurity</li>
                            </ul>
                        </fieldset>
                        <fieldset className="border border-purple-500/30 rounded-xl p-6 w-full">
                            <legend className="px-3 text-purple-400 text-sm font-medium">
                                <span>🔥</span> TRENDING TECHNOLOGIES
                            </legend>

                            <ul className="list-disc pl-5  space-y-2 marker:text-[#8B5CF6]">
                                <li>React</li>
                                <li> Python </li>
                                <li>AWS</li>
                                <li>Data Structures </li>
                            </ul>
                        </fieldset>

                    </div>

                </fieldset>

                <Link to="/industrial-trends" className="text-center p-3 bg-richblack-800 w-[30%] hover:scale-95 
            mx-auto rounded-lg hover:bg-purple-900 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all
             duration-1000  hover:text-white text-purple-700 text-lg font-semibold" >
                    ✨ Explore Industry
                </Link>
            </div>

            <div className="relative w-full h-[2px] mt-24 ">
                <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_20px_#8B5CF6]" />
            </div>
        </section>
    );
}
