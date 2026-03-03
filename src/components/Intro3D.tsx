"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Custom hook to handle window resize/mobile detect
function useDevice() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    return isMobile;
}

const Skyline = ({ isMobile }: { isMobile: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const buildingCount = isMobile ? 30 : 60;

    return (
        <group ref={groupRef}>
            {Array.from({ length: buildingCount }).map((_, i) => {
                const width = Math.random() * 4 + 2;
                const depth = Math.random() * 4 + 2;
                const height = Math.random() * 25 + 10;
                const scaleY = Math.random() > 0.9 ? height * 2.5 : height;

                return (
                    <mesh
                        key={i}
                        position={[
                            (Math.random() - 0.5) * 100,
                            scaleY / 2 - 5,
                            -10 - Math.random() * 40
                        ]}
                    >
                        <boxGeometry args={[width, scaleY, depth]} />
                        <meshStandardMaterial
                            color="#050507"
                            roughness={0.8}
                            metalness={0.2}
                            emissive="#111111"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

const Particles = ({ isMobile }: { isMobile: boolean }) => {
    const ref = useRef<THREE.Points>(null);
    const particleCount = isMobile ? 150 : 350;

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = Math.random() * 40 - 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }

    useFrame(() => {
        if (!ref.current) return;
        const array = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
            array[i * 3 + 1] += 0.015;
            if (array[i * 3 + 1] > 40) {
                array[i * 3 + 1] = -5;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#D4AF37"
                size={isMobile ? 0.2 : 0.3}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const Spotlights = ({ isMobile }: { isMobile: boolean }) => {
    const beamCount = isMobile ? 2 : 4;
    const beams = useRef(
        Array.from({ length: beamCount }).map(() => ({
            angle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.015,
            tilt: 0.2 + Math.random() * 0.4,
            x: (Math.random() - 0.5) * 50,
            z: -20 + Math.random() * 20
        }))
    );

    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((mesh, index) => {
            const b = beams.current[index];
            b.angle += b.speed;
            mesh.rotation.z = Math.sin(b.angle) * b.tilt;
            mesh.rotation.x = Math.max(0, Math.cos(b.angle) * b.tilt);
        });
    });

    return (
        <group ref={groupRef}>
            {beams.current.map((beam, i) => (
                <mesh key={i} position={[beam.x, -5, beam.z]}>
                    <cylinderGeometry args={[0.5, 12, 60, 16, 1, true]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.04}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

const CameraRig = () => {
    const time = useRef(0);
    useFrame((state, delta) => {
        time.current += delta;
        // Move forward slightly
        state.camera.position.z += (35 - state.camera.position.z) * 0.003;
        state.camera.lookAt(0, 10, -30);
    });
    return null;
};

const VideoBackground = () => {
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = document.createElement('video');
        video.src = "/videos/front-screen.mp4";
        video.crossOrigin = "Anonymous";
        video.loop = true;
        video.muted = false; // Try audio by default
        video.playsInline = true;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                // Browser definitively blocked unmuted autoplay.
                if (e.name === 'NotAllowedError') {
                    video.muted = true; // Fallback to muted so the video shows!
                    video.play().catch(err => console.error("Muted playback failed:", err));

                    // Secretly restore audio the moment they interact in ANY way
                    const silentUnmute = () => {
                        if (video.muted) {
                            video.muted = false;
                            video.play().catch(() => { }); // Resync play to be safe
                        }
                        const events = ['click', 'scroll', 'mousemove', 'touchstart', 'keydown', 'pointerdown'];
                        events.forEach(evt => window.removeEventListener(evt, silentUnmute));
                    };

                    const events = ['click', 'scroll', 'mousemove', 'touchstart', 'keydown', 'pointerdown'];
                    events.forEach(evt => window.addEventListener(evt, silentUnmute, { once: true }));
                }
            });
        }

        setVideoElement(video);

        const handleStopAudio = () => {
            if (video) {
                video.muted = true;
            }
        };

        window.addEventListener('stopIntroAudio', handleStopAudio);

        return () => {
            window.removeEventListener('stopIntroAudio', handleStopAudio);
            video.pause();
            video.removeAttribute('src');
            video.load();
        };
    }, []);

    if (!videoElement) return null;

    return (
        <mesh position={[0, 10, -50]} scale={[160, 90, 1]}>
            <planeGeometry />
            <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false}>
                <videoTexture attach="map" args={[videoElement]} />
            </meshBasicMaterial>
        </mesh>
    );
};

export default function Intro3D({ onComplete }: { onComplete: () => void }) {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        // Start showing text sequences on video load
        setStage(1); // Set base stage to show the video

        const timers = [
            setTimeout(() => setStage(2), 500),   // "Hi, this is Shreya Maheshwari"
            setTimeout(() => setStage(3), 5500),  // 1000+ Shows Hosted
            setTimeout(() => setStage(4), 10500), // 40+ International Events
            setTimeout(() => setStage(5), 15500), // 300+ Luxury & Corporate
            setTimeout(() => setStage(6), 20500), // Location Display
            setTimeout(() => setStage(7), 25500), // Enter Experience Button
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    const handleComplete = () => {
        window.dispatchEvent(new Event('stopIntroAudio'));
        onComplete();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[10000] bg-[#020202] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_2s_ease-in-out_300ms_forwards]">
                <Canvas camera={{ position: [0, 5, 20], fov: 60 }} gl={{ alpha: true }}>
                    <VideoBackground />
                    <CameraRig />

                    <ambientLight color="#ffffff" intensity={0} />
                </Canvas>
            </div>

            <div className="absolute z-[10001] pointer-events-none w-full h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {stage >= 1 && (
                        <div className="absolute inset-x-0 bottom-32 flex flex-col items-center justify-center pointer-events-none">
                            <AnimatePresence>
                                {stage === 2 && (
                                    <motion.div
                                        key="text2"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] text-4xl md:text-5xl lg:text-7xl font-heading tracking-widest text-center px-4 leading-tight"
                                    >
                                        Hi, this is<br />SHREYA <span className="text-gold">MAHESHWARI</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                <div className="absolute flex flex-col items-center justify-center w-full px-4 mt-8">
                                    {stage === 3 && (
                                        <motion.div
                                            key="stat1"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 1 }}
                                            className="absolute flex flex-col items-center backdrop-blur-md bg-black/40 p-8 rounded-xl border border-white/10 w-64 text-center"
                                        >
                                            <span className="text-gold text-5xl md:text-6xl font-bold mb-2">1000+</span>
                                            <span className="text-white/80 text-sm md:text-base uppercase tracking-widest">Shows Hosted</span>
                                        </motion.div>
                                    )}
                                    {stage === 4 && (
                                        <motion.div
                                            key="stat2"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 1 }}
                                            className="absolute flex flex-col items-center backdrop-blur-md bg-black/40 p-8 rounded-xl border border-white/10 w-64 text-center"
                                        >
                                            <span className="text-gold text-5xl md:text-6xl font-bold mb-2">40+</span>
                                            <span className="text-white/80 text-sm md:text-base uppercase tracking-widest">Int'l Events</span>
                                        </motion.div>
                                    )}
                                    {stage === 5 && (
                                        <motion.div
                                            key="stat3"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 1 }}
                                            className="absolute flex flex-col items-center backdrop-blur-md bg-black/40 p-8 rounded-xl border border-white/10 w-64 text-center"
                                        >
                                            <span className="text-gold text-5xl md:text-6xl font-bold mb-2">300+</span>
                                            <span className="text-white/80 text-sm md:text-base uppercase tracking-widest">Luxury Events</span>
                                        </motion.div>
                                    )}
                                </div>
                            </AnimatePresence>

                            <AnimatePresence>
                                {stage === 6 && (
                                    <motion.div
                                        key="location"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 1 }}
                                        className="absolute mt-8 text-center w-full px-4"
                                    >
                                        <p className="text-white/90 text-lg md:text-2xl tracking-[0.2em] font-light drop-shadow-md pb-4">
                                            Dubai Based, Global Reach
                                        </p>
                                        <p className="text-white/60 text-sm md:text-base tracking-wider max-w-lg mx-auto leading-relaxed">
                                            Specializing in Dubai & India. Available globally for premium stage engagements.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {stage >= 7 && (
                                    <motion.button
                                        key="enterBtn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1 }}
                                        onClick={handleComplete}
                                        className="absolute mt-8 px-10 py-4 bg-transparent border border-gold text-gold rounded pointer-events-auto uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-black transition-all duration-300 text-base shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                                    >
                                        Enter Experience
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {stage < 7 && (
                <button
                    onClick={handleComplete}
                    className="absolute bottom-8 right-8 text-white/40 hover:text-gold text-sm uppercase tracking-[2px] z-[10002] transition-colors pointer-events-auto"
                >
                    Skip Intro
                </button>
            )}

            <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
        </motion.div>
    );
}
