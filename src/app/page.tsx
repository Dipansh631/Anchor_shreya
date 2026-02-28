"use client";

import { useState, useEffect, useRef } from "react";
import Intro3D from "@/components/Intro3D";
import Background3D from "@/components/Background3D";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Showreel from "@/components/Showreel";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { SITE_DATA } from "@/lib/constants";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const isDroppingRef = useRef(false);

  useEffect(() => {
    const handleDrop = () => {
      setHideContent(true);
      isDroppingRef.current = true;

      const startY = window.scrollY;
      const targetY = document.documentElement.scrollHeight - window.innerHeight;
      const duration = 2500; // 2.5 seconds of falling!
      let startTime: number | null = null;

      const step = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);

        // Heavy cinematic Ease-In-Out-Quart for realistic momentum
        const easeProgress = progress < 0.5
          ? 8 * progress * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;

        window.scrollTo(0, startY + (targetY - startY) * easeProgress);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Finished dropping. Unblock scroll tracking after a small grace period
          setTimeout(() => {
            isDroppingRef.current = false;
          }, 100);
        }
      };

      window.requestAnimationFrame(step);
    };

    const handleScroll = () => {
      if (isDroppingRef.current) return; // Ignore automated scrolls

      // If content is hidden and the user starts scrolling back UP, show it again!
      // We check if they scroll sufficiently away from the absolute bottom.
      const targetY = document.documentElement.scrollHeight - window.innerHeight;
      if (hideContent && window.scrollY < targetY - 100) {
        setHideContent(false);
      }
    };

    window.addEventListener("cinematicDrop", handleDrop);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("cinematicDrop", handleDrop);
      window.removeEventListener("scroll", handleScroll);
    }
  }, [hideContent]);

  // Clean scroll lock from body if refreshed in middle of dev
  useEffect(() => {
    if (introFinished) {
      document.body.style.overflow = "auto";
      window.scrollTo(0, 0); // Start cleanly when intro ends
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => { document.body.style.overflow = "auto"; };
  }, [introFinished]);

  return (
    <>
      {/* 3D Entry Animation Container */}
      {!introFinished && (
        <Intro3D onComplete={() => setIntroFinished(true)} />
      )}

      <main className={`transition-opacity duration-1000 ${introFinished ? "opacity-100" : "opacity-0"}`}>
        {/* fixed Navbar */}
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-transparent backdrop-blur-md border-b border-white/5 pointer-events-auto">
          <div className="font-heading text-2xl font-bold text-gold tracking-widest">SM</div>
          <div className="hidden md:flex gap-8 text-brand-muted text-sm uppercase tracking-wider font-medium">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#showreel" className="hover:text-white transition-colors">Showreel</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          </div>
          <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("cinematicDrop")); }} className="hidden md:block border border-gold text-gold px-6 py-2 rounded text-sm hover:bg-gold hover:text-brand-bg transition-colors">
            Book Now
          </a>
        </nav>

        <div className={`relative flex flex-col md:flex-row w-full transition-opacity duration-1000 ${hideContent ? "opacity-0 pointer-events-none" : "opacity-100"}`}>

          {/* LEFT SIDE: Scrollable Content */}
          <div className="w-full md:w-[55%] lg:w-[50%] z-10 pointer-events-auto flex flex-col pt-24">
            <Hero />
            <Stats />
            <About />
            <Showreel />
            <Experience />
            <Gallery />
            <Testimonials />
            <Contact />
          </div>

          {/* RIGHT SIDE: Sticky Cinematic Canvas */}
          {/* On mobile: pinned to top (-z-10) and full width. On desktop: takes remaining right side sticky */}
          <div className="fixed inset-0 md:static w-full md:w-[45%] lg:w-[50%] h-screen md:sticky md:top-0 md:self-start -z-10 md:z-0 pointer-events-none">
            <Background3D />
          </div>
        </div>
      </main>
    </>
  );
}
