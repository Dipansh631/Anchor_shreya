"use client";

import { motion } from "framer-motion";

const REVIEWS = [
    {
        text: "Shreya elevated our annual gala to a completely different level. Her energy is infectious, and her professionalism is unmatched.",
        author: "David R.",
        role: "Global Events Director",
    },
    {
        text: "An absolute star on stage. She managed a diverse international crowd with such elegance. We'll definitely book her again.",
        author: "Sarah L.",
        role: "Luxury Brand Manager",
    },
    {
        text: "Over 3 days of intense tech exhibitions, she kept the audience engaged and energized. A true professional.",
        author: "Omar K.",
        role: "Tech Summit Organizer",
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-4 overflow-hidden relative border-y border-white/5 pointer-events-auto">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading mb-4 text-glow text-white">Words of Praise</h2>
                    <div className="h-[2px] w-16 bg-gold mx-auto" />
                </div>

                <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar lg:justify-center">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="min-w-[300px] max-w-[400px] flex-none bg-white/5 backdrop-blur-md p-10 rounded-lg relative snap-center border border-white/10 hover:border-gold/20 transition-colors"
                        >
                            <div className="font-heading text-6xl text-gold/10 absolute top-4 left-6 leading-none">"</div>
                            <p className="italic text-lg text-white mb-8 relative z-10 font-heading">
                                "{review.text}"
                            </p>
                            <div>
                                <h4 className="text-gold font-semibold">{review.author}</h4>
                                <p className="text-sm text-brand-muted">{review.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
