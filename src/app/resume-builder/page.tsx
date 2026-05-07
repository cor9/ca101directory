import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume 101 — Industry Standard Youth Actor Resume Builder",
  description: "Create industry-standard youth actor resumes easily with our specialized builder.",
};

export default function ResumeBuilderPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="/resume-builder/index.html"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Resume 101 Builder"
      />
    </div>
  );
}
