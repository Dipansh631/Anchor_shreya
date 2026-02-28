"use client";

import { motion } from "framer-motion";
import { fadeInVariant, staggerContainer } from "@/animations/transitions";
import { SITE_DATA } from "@/lib/constants";

export default function Hero() {
    return (
        <section id="hero" className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
            {/* Background cinematic radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,32,40,0.4)_0%,rgba(5,5,7,0)_70%)] -z-10" />

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="text-center md:text-left max-w-4xl z-10 pointer-events-auto w-full md:mr-auto lg:pl-24"
            >
                <motion.p variants={fadeInVariant} className="text-gold uppercase tracking-[3px] text-sm mb-8">
                    {SITE_DATA.title}
                </motion.p>

                <motion.h1 variants={fadeInVariant} className="text-5xl md:text-7xl lg:text-8xl leading-none mb-6 font-semibold">
                    <span className="text-gradient-gold">Shreya</span><br />
                    <span className="text-glow">Maheshwari</span>
                </motion.h1>

                <motion.p variants={fadeInVariant} className="text-brand-muted text-base md:text-lg mb-12 max-w-xl md:mx-0 mx-auto">
                    {SITE_DATA.subtitle}
                </motion.p>

                <motion.div variants={fadeInVariant} className="flex gap-4 justify-center md:justify-start flex-wrap">
                    <a href="#showreel" className="bg-gold text-brand-bg px-8 py-3 rounded text-sm md:text-base font-medium shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:bg-brand-hover hover:-translate-y-0.5 transition-all duration-300">
                        Watch Showreel
                    </a>
                    <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("cinematicDrop")); }} className="bg-transparent border border-white/20 text-white px-8 py-3 rounded text-sm md:text-base font-medium hover:border-gold hover:text-gold hover:-translate-y-0.5 transition-all duration-300">
                        Book Now
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
