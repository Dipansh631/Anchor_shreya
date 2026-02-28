"use client";

import { Play } from "lucide-react";

export default function Showreel() {
    const cards = [
        { title: "Corporate Excellence", desc: "Global Tech Summit 2025", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800" },
        { title: "Luxury Galas", desc: "Awards Night Dubai", image: "https://images.unsplash.com/photo-1511578314322-379e947e1eb6?auto=format&fit=crop&q=80&w=800" },
        { title: "High-Energy Festivals", desc: "International Exhibitions", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" },
    ];

    return (
        <section id="showreel" className="py-24 px-4 pointer-events-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-heading mb-4 text-glow text-white">Showreel</h2>
                <div className="h-[2px] w-16 bg-gold mx-auto mb-6" />
                <p className="text-brand-muted text-lg">A glimpse into the stage presence and energy.</p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-3 max-w-7xl mx-auto hide-scrollbar">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="group relative min-w-[300px] h-[450px] md:h-[500px] rounded-lg overflow-hidden shrink-0 snap-center cursor-pointer transition-transform duration-700 hover:scale-105"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${card.image}')` }}
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent p-8 flex flex-col justify-end
                            transition-all duration-300 group-hover:from-black group-hover:via-black/60 group-hover:to-black/10">

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              bg-white/10 backdrop-blur-md rounded-full p-4
                              opacity-80 scale-90 transition-all duration-300 
                              group-hover:opacity-100 group-hover:scale-110 group-hover:text-gold">
                                <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-heading mb-2 text-white">{card.title}</h3>
                                <p className="text-brand-muted text-sm tracking-wider">{card.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
