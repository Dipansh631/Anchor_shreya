"use client";

import { Mail, Phone, MessageSquare } from "lucide-react";
import { SITE_DATA } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
    const [btnText, setBtnText] = useState("Send Inquiry");

    // Show content immediately when in view
    const [sectionReady, setSectionReady] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    useEffect(() => {
        if (isInView) {
            setSectionReady(true);
        }
    }, [isInView]);

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();
        setBtnText("Sending Inquiry...");
        setTimeout(() => {
            setBtnText("Inquiry Sent!");
            setTimeout(() => setBtnText("Send Inquiry"), 3000);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <section id="contact" ref={containerRef} className="py-24 px-4 pointer-events-auto relative min-h-[80vh] flex flex-col items-center justify-center">

            <div className={`max-w-6xl mx-auto w-full bg-transparent p-8 md:p-16 transition-all duration-1000 transform ${sectionReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="grid md:grid-cols-2 gap-12 md:gap-24">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-heading mb-6 text-gradient-gold leading-tight">Book for your<br />next event</h2>
                        <p className="text-brand-muted mb-12 max-w-md">
                            Elevate your corporate summit, luxury exhibition, or global gala with an international voice.
                        </p>

                        <div className="space-y-6 mb-12">
                            <a href={`mailto:${SITE_DATA.contact.email}`} className="flex items-center gap-4 text-brand-muted hover:text-gold transition-colors text-lg">
                                <Mail className="w-6 h-6" /> {SITE_DATA.contact.email}
                            </a>
                            <a href={`tel:${SITE_DATA.contact.phone.replace(/[\s-]/g, '')}`} className="flex items-center gap-4 text-brand-muted hover:text-gold transition-colors text-lg">
                                <Phone className="w-6 h-6" /> {SITE_DATA.contact.phone}
                            </a>
                        </div>

                        <a href={SITE_DATA.contact.whatsappUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-8 py-4 rounded-lg font-medium transition-transform hover:-translate-y-1">
                            <MessageSquare className="w-5 h-5" /> Chat on WhatsApp
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <form onSubmit={handleForm} className="space-y-6">
                            <div>
                                <input type="text" required placeholder="Your Name"
                                    className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-gold transition-colors" />
                            </div>
                            <div>
                                <input type="email" required placeholder="Email Address"
                                    className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-gold transition-colors" />
                            </div>
                            <div>
                                <select required defaultValue=""
                                    className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-md p-4 text-brand-muted focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                                    <option value="" disabled>Select Event Type</option>
                                    <option value="corporate">Corporate Event / Summit</option>
                                    <option value="gala">Awards / Gala Night</option>
                                    <option value="exhibition">Exhibition / Trade Show</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <textarea required rows={4} placeholder="Event Details & Dates"
                                    className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-gold transition-colors resize-none" />
                            </div>

                            <button type="submit"
                                className={`w-full py-4 rounded-md font-medium transition-all ${btnText === 'Inquiry Sent!'
                                    ? 'bg-[#25D366] text-white'
                                    : 'bg-gold text-brand-bg hover:bg-brand-hover hover:-translate-y-1 shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                                    }`}>
                                {btnText}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Sub-Footer Revealed Post-Loading */}
            <footer className={`mt-24 w-full max-w-6xl mx-auto border-t border-white/5 pt-12 text-center transition-all duration-1000 transform delay-300 ${sectionReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="font-heading text-xl text-white mb-2">{SITE_DATA.name}</div>
                <p className="text-brand-muted text-sm mb-6">{SITE_DATA.title} • Dubai, UAE</p>
                <div className="flex justify-center gap-6 mb-8 text-sm">
                    {SITE_DATA.socials.map((s, i) => (
                        <a key={i} href={s.url} className="text-brand-muted hover:text-gold transition-colors">{s.name}</a>
                    ))}
                </div>
                <p className="text-white/20 text-xs text-center">&copy; {new Date().getFullYear()} {SITE_DATA.name}. All rights reserved.</p>
            </footer>

        </section>
    );
}
