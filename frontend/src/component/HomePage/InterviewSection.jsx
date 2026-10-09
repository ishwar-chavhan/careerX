import { Link } from "react-router-dom";

export default function InterviewSection() {
    const interviewSteps = [
        {
            number: "01",
            icon: "🎯",
            title: "CHOOSE YOUR FIELD",
            description: "Select the role you want to practice.",
            highlight: "Personalized interview"
        },
        {
            number: "02",
            icon: "💬",
            title: "ANSWER QUESTIONS",
            description: "Answer realistic technical interview questions.",
            highlight: "Realistic questions"
        },
        {
            number: "03",
            icon: "✨",
            title: "GET AI FEEDBACK",
            description: "Get a score and detailed feedback from AI.",
            highlight: "Instant evaluation"
        }
    ];



    return (
        <section id="interview" className="px-10 max-w-[1200px] w-11/12 mx-auto text-white py-16">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-[30px] font-semibold">
                    <span className="text-purple-800">✦</span>AI MOCK INTERVIEW
                </h2>
                <p className="text-[18px] text-slate-400">
                    Practice Like It's the Real Thing.
                </p>

                <div className="w-full h-1 bg-richblack-300"></div>

                <div className="">
                    <h2 className="text-center text-[24px] font-semibold">
                        Prepare yourself with realistic technical interviews powered by AI.
                    </h2>
                    <div className="flex gap-10  justify-between  mt-14">
                        <div className=" relative flex flex-col w-[40%] gap-3 items-center
                              bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                    ">
                            <h2 className="text-[22px] font-semibold">
                                AI INTERVIEWER
                            </h2>
                            <p className="text-[18px] ">
                                <span className="mr-1 text-purple-800">◉</span>
                                AI
                            </p>
                            <fieldset className="border border-purple-500/30 rounded-xl p-6 w-full">
                                <legend className="px-3 text-purple-400 text-sm font-medium">
                                    Question 03 / 09
                                </legend>

                                <p className="text-white text-lg">
                                    Explain the difference between let, var and const in JavaScript.
                                </p>
                            </fieldset>
                            <fieldset className="border border-purple-500/30 rounded-xl p-6 w-full">
                                <legend className="px-3 text-purple-400 text-sm font-medium">
                                    Answer
                                </legend>

                                <p className="text-white text-lg">
                                    Type your answer...
                                </p>
                            </fieldset>
                            <button className="px-10 rounded-lg hover:scale-95 text- py-2
                       mt-3 bg-purple-900 shadow-[0_0_50px_rgba(139,92,246,0.6)] ">
                                Submit
                            </button>

                            <div
                                className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                                        w-4/5 h-[2px]
                                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                            />
                        </div>


                        <div className="relative flex flex-col gap-3 items-center
                              bg-[#0B1224]
                                border border-[#8B5CF6]/20
                                rounded-2xl
                                p-8
                                transition-all duration-300
                                hover:border-[#8B5CF6]/50
                                hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                     ">
                            <h2 className="text-[22px] font-semibold">
                                YOUR PERFORMANCE
                            </h2>
                            <p className="text-[18px] ">
                                8.5 / 10
                            </p>
                            <div className="w-full">
                                <div className="flex justify-evenly">
                                    <p>
                                        Technical
                                    </p>
                                    <p>
                                        9/10
                                    </p>
                                </div>
                                <div className="flex justify-evenly">
                                    <p>
                                        Accuracy
                                    </p>
                                    <p>
                                        8/10
                                    </p>
                                </div>
                                <div className="flex justify-evenly">
                                    <p>
                                        Relevance
                                    </p>
                                    <p>
                                        9/10
                                    </p>
                                </div>
                            </div>

                            <fieldset className="border border-purple-500/30 rounded-xl p-6">
                                <legend className="px-3 text-purple-400 text-sm font-medium">
                                    AI FEEDBACK
                                </legend>

                                <p className="text-white text-lg">
                                    Good explanation, You could improve...
                                </p>
                            </fieldset>
                            <div
                                className="absolute -bottom-[2px] left-1/2 -translate-x-1/2
                        w-4/5 h-[2px]
                        bg-gradient-to-r from-transparent via-red-500 to-transparent
                        shadow-[0_0_15px_3px_rgba(239,68,68,0.45)]"
                            />

                        </div>



                    </div>
                </div>

                <Link to="/ai-interview" className="text-center mt-10 p-3 bg-richblack-800 w-[30%] hover:scale-95 hover:text-white 
             mx-auto rounded-lg text-purple-700 text-lg font-semibold
             hover:bg-purple-900 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-1000" >
                    👤 Start Mock Interview
                </Link>
            </div>

            <div className="relative w-full h-[2px] mt-24 mb-10">
                <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_20px_#8B5CF6]" />
            </div>
        </section>
    );
}
