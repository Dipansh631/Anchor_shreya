"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { SITE_DATA } from "@/lib/constants";

function Counter({ target, isTextTarget, textValue }: { target: number, isTextTarget?: boolean, textValue?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && !isTextTarget) {
            let current = 0;
            const step = target / 60; // 60 frames roughly
            const minStep = step > 0 ? step : 1;

            const timer = setInterval(() => {
                current += minStep;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.ceil(current));
                }
            }, 20);

            return () => clearInterval(timer);
        }
    }, [isInView, target, isTextTarget]);

    return (
        <span ref={ref}>
            {isTextTarget ? textValue : count}
        </span>
    );
}

export default function Stats() {
    return (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-transparent via-white/5 to-transparent border-y border-white/5 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                {SITE_DATA.stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:-translate-y-1 transition-transform"
                    >
                        <div className="text-3xl md:text-5xl font-heading text-gold mb-2 inline-flex">
                            <Counter
                                target={stat.target}
                                isTextTarget={stat.isTextTarget}
                                textValue={stat.label}
                            />
                            {stat.suffix && <span>{stat.suffix}</span>}
                        </div>
                        <p className="text-sm md:text-base text-brand-muted uppercase tracking-wider">
                            {stat.isTextTarget ? stat.subLabel : stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
