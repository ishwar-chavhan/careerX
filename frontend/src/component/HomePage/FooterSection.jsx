import { BriefcaseBusiness, CodeXml, Mail } from "lucide-react";

export default function FooterSection() {
  const links = [
    { label: "GitHub", href: "https://github.com/ishwar-chavhan", Icon: CodeXml },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ishwarchavhan/", Icon: BriefcaseBusiness },
    { label: "Email", href: "mailto:ishwarchavhan30feb@gmail.com", Icon: Mail },
  ];

  return (
    <footer className="bg-richblack-800 text-white border-t border-purple-500/30">
      <div className="w-11/12 max-w-[1200px] mx-auto py-12 flex flex-col items-center text-center gap-3">

        {/* Logo */}
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <span className="text-purple-500">✦</span> CareerX
        </h2>

        {/* One main tagline, one softer line */}
        <p className="text-lg text-slate-200">
          Build. Practice. Understand. Get placement-ready.
        </p>
        <p className="text-sm text-slate-400">
          Your AI-powered career companion.
        </p>

        {/* Contact */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <h3 className="text-xs uppercase tracking-widest text-slate-500">
            Contact
          </h3>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {links.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-base text-slate-300 hover:text-purple-400 transition-colors duration-200"
              >
                <Icon size={18} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 CareerX · Built by{" "}
        <a
          href="https://github.com/ishwar-chavhan"
          className="text-slate-300 hover:text-purple-400 transition-colors"
        >
          Ishwar
        </a>
      </div>
    </footer>
  );
}