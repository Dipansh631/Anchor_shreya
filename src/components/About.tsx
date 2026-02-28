"use client";

import { motion } from "framer-motion";
import { fadeInVariant, staggerContainer } from "@/animations/transitions";

const TIMELINE = [
    {
        title: "The Beginning",
        desc: "Stepped onto the stage with a passion for storytelling and connecting with audiences. Rapidly became a sought-after voice.",
    },
    {
        title: "International Arenas",
        desc: "Expanded across continents, hosting major corporate summits, award nights, and luxury brand launches.",
    },
    {
        title: "1000+ Milestone",
        desc: "Surpassed 1000 live shows, cementing a reputation for unmatched energy, grace, and professionalism on stage.",
    },
    {
        title: "Dubai & Beyond",
        desc: "Currently based in Dubai, creating unforgettable experiences for the world's most prestigious events and exhibitions.",
    }
];

export default function About() {
    return (
        <section id="about" className="py-24 px-4 relative max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-heading mb-4 text-glow text-white">The Journey</h2>
                <div className="h-[2px] w-16 bg-gold mx-auto" />
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative max-w-3xl mx-auto"
            >
                {/* Vertical line desktop */}
                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gold/20 md:-translate-x-1/2" />

                {TIMELINE.map((item, i) => {
                    const isEven = i % 2 === 0;
                    return (
                        <motion.div
                            key={i}
                            variants={fadeInVariant}
                            className={`relative flex items-center justify-between md:justify-normal w-full mb-8 ${isEven ? "md:flex-row-reverse" : ""}`}
                        >
                            {/* Desktop gap */}
                            <div className="hidden md:block w-1/2" />

                            {/* Dot */}
                            <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-gold transform -translate-x-1/2 z-10 
                              shadow-[0_0_10px_rgba(212,175,55,0.8)]" />

                            {/* Content Card */}
                            <div className="w-[calc(100%-40px)] md:w-[45%] bg-white/5 backdrop-blur-md p-6 rounded-lg ml-[40px] md:ml-0 shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
                              hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300
                              border-l-2 md:border-l-0 border-gold
                              md:[&:nth-child(even)]:border-r-2 md:[&:nth-child(even)]:border-gold md:[&:nth-child(odd)]:border-l-2 md:[&:nth-child(odd)]:border-gold"
                            >
                                <h3 className="text-xl md:text-2xl font-heading text-gold mb-2">{item.title}</h3>
                                <p className="text-brand-muted text-sm md:text-base">{item.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
