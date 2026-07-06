import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";
import ProjectExperience from "@/components/ProjectExperience";

export const metadata: Metadata = {
  title: "Projects | Nitai Mahat",
  description: "Project atlas for Nitai Mahat featuring full-stack, ML, Java, and desktop builds.",
};

export default function ProjectsPage() {
  return (
    <>
      <CustomCursor />
      <ProjectExperience />
    </>
  );
}
