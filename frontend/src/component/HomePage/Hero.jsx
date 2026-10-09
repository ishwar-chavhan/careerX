import { Link } from "react-router-dom";
import laptop from "../../assets/laptop.png"

export default function Hero() {
    return (
        <section className="text-white w-11/12 max-w-[1200px] mx-auto mt-10">
            <div className="flex justify-center gap-8 w-[90%] mx-auto">
                <div className="space-y-4 flex flex-col items-start">
                    <p className="text-[36px] font-semibold">
                        AI-POWERED CAREER
                    </p>
                    <p className="text-[18px]">
                        Your Career,  <br />
                        <span className="ml-18 text-[#38BDF8]">
                            Upgraded by AI.
                        </span>
                    </p>
                    <p className="w-[75%] text-[18px]">
                        Build a better resume. Practice real interviews.
                        Understand the job market.
                        CareerX gives you the AI tools to become placement-ready.
                    </p>
                    <div className="px-10 rounded-lg hover:scale-95 text- py-2 bg-purple-900 shadow-[0_0_50px_rgba(139,92,246,0.6)] 
                    hover:shadow-[0_0_50px_rgba(200,92,246,0.6)]
                    ">
                        <Link to="/login">
                            Get Started
                        </Link>
                    </div>
                </div>
                <img
                    src={laptop}
                    width={400}
                    className="hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-700
                shadow-[0_0_80px_rgba(59,130,246,0.15)]
                "
                />


            </div>

            <div className="relative w-full h-[2px] mt-24 mb-10">
                <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_20px_#8B5CF6]" />
            </div>


        </section>
    );
}
