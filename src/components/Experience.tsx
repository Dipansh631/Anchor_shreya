export default function Experience() {
    return (
        <section id="experience" className="py-24 px-4 overflow-hidden relative pointer-events-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-heading mb-4 text-glow text-white">Global Footprint</h2>
                <div className="h-[2px] w-16 bg-gold mx-auto" />
            </div>

            <div className="max-w-5xl mx-auto min-h-[400px] rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center p-8 md:p-16 relative shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                {/* Placeholder for actual 3D globe or dot map, using stylish abstract typography for now */}
                <div className="text-lg md:text-2xl text-brand-muted max-w-2xl text-center italic font-heading leading-relaxed">
                    "Delivering world-class hosting experiences spanning over <span className="text-gold not-italic">40 countries</span>, with a premium operational base in <span className="text-gold not-italic">Dubai, UAE</span>."
                </div>
            </div>
        </section>
    );
}
