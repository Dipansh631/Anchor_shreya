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
        // Move forward
        state.camera.position.z += (35 - state.camera.position.z) * 0.003;
        // Parallax
        state.camera.position.y = 5 + Math.sin(time.current * 0.5) * 1.5;
        state.camera.lookAt(0, 10, -30);
    });
    return null;
};

export default function Intro3D({ onComplete }: { onComplete: () => void }) {
    const [stage, setStage] = useState(0);
    const isMobile = useDevice();

    useEffect(() => {
        // Stage timings
        const timers = [
            setTimeout(() => setStage(1), 1200), // Text 1 fades in
            setTimeout(() => setStage(2), 3200), // Text 1 fades out
            setTimeout(() => setStage(3), 4000), // Text 2 fades in
            setTimeout(() => onComplete(), 6500) // End intro
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[10000] bg-[#020202] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_2s_ease-in-out_300ms_forwards]">
                <Canvas camera={{ position: [0, 5, 60], fov: 50 }} gl={{ alpha: true }}>
                    <fogExp2 attach="fog" args={["#020202", 0.015]} />

                    <Skyline isMobile={isMobile} />
                    <Particles isMobile={isMobile} />
                    <Spotlights isMobile={isMobile} />
                    <CameraRig />

                    <mesh rotation-x={-Math.PI / 2} position-y={-5}>
                        <planeGeometry args={[200, 200]} />
                        <meshStandardMaterial color="#020202" roughness={0.1} metalness={0.9} />
                    </mesh>

                    <ambientLight color="#050510" intensity={1.5} />
                    <pointLight color="#D4AF37" position={[0, 5, 10]} intensity={5} distance={50} />
                </Canvas>
            </div>

            <div className="absolute z-[10001] text-center pointer-events-none w-full">
                <AnimatePresence mode="wait">
                    {stage === 1 && (
                        <motion.div
                            key="text1"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="text-white text-3xl md:text-5xl lg:text-6xl font-heading tracking-widest whitespace-nowrap"
                        >
                            Ladies &amp; Gentlemen...
                        </motion.div>
                    )}
                    {stage === 3 && (
                        <motion.div
                            key="text2"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="text-gold text-4xl md:text-6xl lg:text-7xl font-heading tracking-widest whitespace-nowrap"
                        >
                            Shreya Maheshwari
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 text-white/40 hover:text-gold text-sm uppercase tracking-[2px] z-[10002] transition-colors"
            >
                Tap to Skip
            </button>

            <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
        </motion.div>
    );
}
