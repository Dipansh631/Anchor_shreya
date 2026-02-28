"use client";

import { motion } from "framer-motion";

const IMAGES = [
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1510511459019-5efa7ae11e5f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1478147424040-ba760ac2ce1c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600",
];

export default function Gallery() {
    return (
        <section id="gallery" className="py-24 px-4 pointer-events-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-heading mb-4 text-glow text-white">Candid Moments</h2>
                <div className="h-[2px] w-16 bg-gold mx-auto mb-6" />
            </div>

            <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {IMAGES.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group relative rounded-lg overflow-hidden break-inside-avoid cursor-pointer"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt="Candid Stage Moment"
                            className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 group-hover:bg-gold/20 transition-all duration-300" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
