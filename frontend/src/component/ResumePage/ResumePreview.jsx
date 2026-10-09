// src/components/resume/ResumePreview.jsx
// Draws the resume exactly like an A4 page. Everything is sized in `em`, and the base font
// size scales with the width of the box it sits in (container query units), so the same
// component works as a full preview, a small thumbnail, and the print copy.
import { Fragment } from "react";

const PAGE_W = 794; // A4 width in px at 96dpi
const BASE_PX = 12.5; // body text size on a real page
const MARGIN_EM = 45.35 / BASE_PX; // 12mm page margin, in em
const ACCENT = "#2f4f9d"; // section heading colour (blue, like your sample). Change here if you want.

/* ---------- helpers ---------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-03" -> "Mar 2026"
const formatMonth = (v) => {
  if (!v) return "";
  const [y, m] = v.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};

const monthRange = (it) =>
  [formatMonth(it.startDate), it.current ? "Present" : formatMonth(it.endDate)]
    .filter(Boolean)
    .join(" – ");

const yearRange = (it) => [it.startYear, it.endYear].filter(Boolean).join(" – ");

const withProtocol = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

// skip rows the user added but left empty
const filled = (it) =>
  Object.values(it).some(
    (v) => (typeof v === "string" && v.trim()) || (Array.isArray(v) && v.length)
  );

// **bold** inside a bullet point becomes bold text (no raw HTML, so it's safe)
export function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/* ---------- small building blocks ---------- */
function Row({ left, right, align = "flex-start" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: align, gap: "1em" }}>
      <div>{left}</div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>{right}</div>
    </div>
  );
}

function Bullets({ points = [] }) {
  if (!points.length) return null;
  return (
    <ul style={{ margin: "0.3em 0 0", paddingLeft: "1.6em", listStyle: "disc" }}>
      {points.map((p, i) => (
        <li key={i} style={{ marginTop: i ? "0.3em" : 0, fontSize: "0.95em" }}>
          <Rich text={p} />
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: "1.1em" }}>
      <h2
        style={{
          margin: 0,
          fontSize: "1.1em",
          fontWeight: 400,
          fontVariant: "small-caps",
          letterSpacing: "0.03em",
          color: ACCENT,
          borderBottom: "1px solid #111",
          paddingBottom: "0.15em",
        }}
      >
        {title}
      </h2>
      <div style={{ marginTop: "0.55em" }}>{children}</div>
    </section>
  );
}

const entryStyle = (i) => ({ marginTop: i ? "0.75em" : 0, breakInside: "avoid" });

/* ---------- the resume ---------- */
export default function ResumePreview({ resume = {}, compact = false }) {
  const c = resume.contact || {};
  const skills = (resume.skills || []).filter(filled);
  const experience = (resume.experience || []).filter(filled);
  const projects = (resume.projects || []).filter(filled);
  const education = (resume.education || []).filter(filled);

  const links = [
    ["LinkedIn", c.linkedin],
    ["GitHub", c.github],
    ["LeetCode", c.leetcode],
    ["Portfolio", c.portfolio],
  ].filter(([, url]) => url && url.trim());

  const linkStyle = { color: ACCENT, textDecoration: "underline" };

  return (
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <div
        className="rb-paper"
        style={{
          position: "relative",
          boxSizing: "border-box",
          background: "#fff",
          color: "#111",
          fontFamily: 'Cambria, "Times New Roman", Georgia, serif',
          fontSize: `calc(100cqw * ${BASE_PX / PAGE_W})`,
          lineHeight: 1.35,
          padding: `${MARGIN_EM}em`,
          minHeight: "calc(100cqw * 297 / 210)",
        }}
      >
        {/* header */}
        <header>
          <Row
            align="flex-end"
            left={
              <div
                style={{
                  fontSize: "2.1em",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: c.fullName ? "#111" : "#c8c8c8",
                }}
              >
                {c.fullName || "Your name"}
              </div>
            }
            right={c.location ? <span>Location: {c.location}</span> : null}
          />
          <div style={{ marginTop: "0.35em" }}>
            <Row
              left={links.map(([label, url], i) => (
                <Fragment key={label}>
                  {i > 0 && " | "}
                  <a href={withProtocol(url)} target="_blank" rel="noreferrer" style={linkStyle}>
                    {label}
                  </a>
                </Fragment>
              ))}
              right={
                <>
                  {c.email && (
                    <>
                      Email:{" "}
                      <a href={`mailto:${c.email}`} style={linkStyle}>
                        {c.email}
                      </a>
                    </>
                  )}
                  {c.email && c.phone && " | "}
                  {c.phone && <>Mobile: {c.phone}</>}
                </>
              }
            />
          </div>
        </header>

        {skills.length > 0 && (
          <Section title="Technical Skills">
            {skills.map((g, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "9em 1fr", marginTop: i ? "0.3em" : 0 }}
              >
                <strong>{g.category}</strong>
                <span>: {g.items}</span>
              </div>
            ))}
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Work Experience">
            {experience.map((it, i) => (
              <div key={i} style={entryStyle(i)}>
                <Row left={<strong>{it.company}</strong>} right={it.location} />
                <Row left={<em>{it.role}</em>} right={<em>{monthRange(it)}</em>} />
                <Bullets points={it.points} />
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((it, i) => (
              <div key={i} style={entryStyle(i)}>
                <strong style={{ textDecoration: "underline" }}>{it.name}</strong>
                <Bullets points={it.points} />
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((it, i) => (
              <div key={i} style={entryStyle(i)}>
                <Row left={<strong>{it.institution}</strong>} right={it.location} />
                <Row left={<em>{it.degree}</em>} right={<em>{yearRange(it)}</em>} />
              </div>
            ))}
          </Section>
        )}

        {/* dashed guide where page 2 starts (screen only) */}
        {!compact && (
          <div
            className="rb-guide"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "calc(100cqw * 297 / 210)",
              borderTop: "1px dashed #9ca3af",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: "0.5em",
                top: "0.2em",
                fontSize: "0.7em",
                color: "#6b7280",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Page 2 starts here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
