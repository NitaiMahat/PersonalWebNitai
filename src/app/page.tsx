"use client";

import { useState } from "react";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import GalaxyBackground from "@/components/GalaxyBackground";
import ForegroundParticles from "@/components/ForegroundParticles";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="relative">
      <CustomCursor />
      <Intro onDone={() => setIntroDone(true)} />

      <section className="relative min-h-screen">
        <GalaxyBackground />
        <Hero start={introDone} />
        {/* sparse particles floating in front of the figure for depth */}
        <ForegroundParticles />
      </section>

      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
