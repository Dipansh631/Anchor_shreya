"use client";

import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center, Sky, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DynamicClouds({ isMobile }: { isMobile: boolean }) {
    const cloudGroup = useRef<THREE.Group>(null);

    // Dynamic weather themes for clouds aligning exactly with SkyManager
    const cloudPhases = [
        { color: new THREE.Color("#FFE0C2"), opacity: 0.8 }, // Morning
        { color: new THREE.Color("#ffffff"), opacity: 1.0 }, // Noon
        { color: new THREE.Color("#FF7A59"), opacity: 0.9 }, // Evening
        { color: new THREE.Color("#1A2035"), opacity: 0.1 }, // Night (mostly hidden)
    ];

    useFrame((state, delta) => {
        if (cloudGroup.current) {
            // Very slow, continuous cinematic right-to-left wind drift
            cloudGroup.current.position.x -= delta * 0.8;

            // Endless looping carousel so clouds always populate the sky
            if (cloudGroup.current.position.x < -60) {
                cloudGroup.current.position.x = 60;
            }

            // Calculate exact global scroll progress from 0.0 (top) to 1.0 (bottom)
            const scrollY = window.scrollY;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

            // 4 phases spreading perfectly across the 0-1 scroll length
            // Multiply by 3 so we interpolate between index 0->1, 1->2, 2->3
            const mappedProgress = THREE.MathUtils.clamp(progress * 3, 0, 2.999);
            const phaseIndex = Math.floor(mappedProgress);
            const nextPhaseIndex = phaseIndex + 1;
            const lerpFactor = mappedProgress % 1;

            const current = cloudPhases[phaseIndex];
            const next = cloudPhases[nextPhaseIndex];

            // Lerp all cloud materials natively without expensive React state re-renders
            cloudGroup.current.traverse((child: any) => {
                if (child.material) {
                    if (child.material.color) {
                        child.material.color.lerpColors(current.color, next.color, lerpFactor);
                    }
                    if (child.material.opacity !== undefined) {
                        child.material.transparent = true;
                        child.material.opacity = THREE.MathUtils.lerp(current.opacity, next.opacity, lerpFactor);
                    }
                }
            });
        }
    });

    return (
        <group ref={cloudGroup} position={[isMobile ? 5 : 10, 0, -10]}>
            {/* High-altitude ceiling clouds (specifically positioned so you see them when looking straight UP from the bottom of the page!) */}
            <Cloud position={[-10, 25, 10]} scale={isMobile ? 2 : 4} speed={0.1} />
            <Cloud position={[10, 35, 5]} scale={isMobile ? 2.5 : 6} speed={0.15} />
            <Cloud position={[30, 28, -5]} scale={isMobile ? 2 : 5} speed={0.1} />

            {/* Huge majestic background cloud structure */}
            <Cloud position={[-15, 12, -25]} scale={isMobile ? 2 : 5} speed={0.1} />
            <Cloud position={[10, 16, -15]} scale={isMobile ? 1.5 : 4} speed={0.2} />
            <Cloud position={[35, 15, -30]} scale={isMobile ? 2.5 : 6} speed={0.15} />

            {/* Lower passing clouds cutting behind the building */}
            <Cloud position={[-5, 4, -10]} scale={isMobile ? 1 : 2} speed={0.3} />
            <Cloud position={[25, 2, -8]} scale={isMobile ? 1.2 : 2.2} speed={0.25} />
            <Cloud position={[-30, 6, -12]} scale={isMobile ? 1.5 : 3} speed={0.2} />
        </group>
    );
}

function BurjKhalifa({ isMobile }: { isMobile: boolean }) {
    const { scene } = useGLTF("/assets/free__burj_khalifa_dubai.glb");
    const ref = useRef<THREE.Group>(null);

    const time = useRef(0);
    useFrame((state, delta) => {
        if (ref.current) {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

            time.current += delta;

            // 1. Removed spinning entirely: model remains fixed on the Y axis

            // 2. Continuous float + Scroll-driven Y shift (Model physically ascends as you scroll down)
            const floatY = Math.sin(time.current) * 0.2;

            // The model moves UP the screen as you scroll DOWN the page. 
            // We increase the range so the "moving up/down" is more noticeable.
            const targetY = THREE.MathUtils.lerp(-3.0, 3.0, progress);

            // Using frame-rate independent dampening for ultra-smooth buttery tracking
            ref.current.position.y = THREE.MathUtils.damp(
                ref.current.position.y,
                targetY + floatY,
                3, // lambda/stiffness (lower is smoother/heavier)
                delta
            );
        }
    });

    return (
        // Mobile uses offset because canvas is full width behind text.
        // Desktop uses X=0 (perfectly centered) because the canvas is now an Apple-style fixed right-pane!
        <group ref={ref} position={[isMobile ? 3.5 : 0, 0, 0]}>
            <Center scale={isMobile ? 0.2 : 0.4}>
                <primitive object={scene} />
            </Center>
        </group>
    );
}

function CameraRig({ isMobile }: { isMobile: boolean }) {
    const { camera } = useThree();
    const lookAtY = useRef(0);
    const lookAtX = useRef(0);

    useEffect(() => {
        // Camera starts at 0 initially but moves dynamically
        camera.position.x = 0;
        // Pushing the camera further back horizontally shows more of the building
        camera.position.z = isMobile ? 20 : 18;
    }, [camera, isMobile]);

    useFrame((state, delta) => {
        const scrollY = window.scrollY;
        // Total document height minus viewport = max scrollable pixels
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Since the building is now animating itself, we just apply a very subtle camera tilt/pan 
        // to emphasize the scrolling feeling without losing sight of the small model
        const startY = isMobile ? 0.5 : 1.0;
        const endY = isMobile ? -0.5 : -1.0;

        let targetY;
        let targetLookY;
        let targetCameraX;

        // Model is centered in its 50% split pane on Desktop now
        const modelX = isMobile ? 3.5 : 0;

        // Dynamically find when the Contact section enters the screen!
        const contactEl = document.getElementById("contact");
        let fallTriggerProgress = 0.95; // Default fallback

        if (contactEl && maxScroll > 0) {
            const absoluteTop = contactEl.getBoundingClientRect().top + window.scrollY;
            const triggerScrollY = absoluteTop - window.innerHeight;
            fallTriggerProgress = Math.max(0, triggerScrollY / maxScroll);
        }

        // Camera scroll tilting logic (slight rotation tilt as you scroll)
        const baseTilt = THREE.MathUtils.lerp(0, 0.05, progress);
        camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, baseTilt, 3, delta);

        // When the user hits the Contact area
        if (progress > fallTriggerProgress && fallTriggerProgress < 1) {
            // Initiate a dramatic "falling" sequence past the base of the building!
            // Map the remaining progress (e.g. 0.82 -> 1.0) tightly to the huge drop
            const fallingProgress = Math.min(1, (progress - fallTriggerProgress) / (1 - fallTriggerProgress));
            targetY = THREE.MathUtils.lerp(endY, endY - 15.0, fallingProgress);

            // As we fall past the base, aggressively tilt the camera upwards!
            targetLookY = THREE.MathUtils.lerp(endY, 20.0, fallingProgress);

            // Shift camera perfectly over to the model to prevent perspective tilt 
            targetCameraX = THREE.MathUtils.lerp(0, modelX, fallingProgress);
        } else {
            // Normal smooth cinematic scroll mapping for the rest of the site
            const normalProgress = fallTriggerProgress > 0 ? Math.min(1, progress / fallTriggerProgress) : 0;
            targetY = THREE.MathUtils.lerp(startY, endY, normalProgress);
            targetLookY = targetY;
            targetCameraX = 0;
        }

        // Using frame-rate independent dampening for ultra smooth camera movement
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCameraX, 3, delta);

        // Dampen and track the pitch center to ensure buttery smooth tilting mechanics
        lookAtY.current = THREE.MathUtils.damp(lookAtY.current, targetLookY, 3, delta);
        lookAtX.current = THREE.MathUtils.damp(lookAtX.current, targetCameraX, 3, delta);

        camera.lookAt(lookAtX.current, lookAtY.current, 0);
    });

    return null;
}

// Animated Weather System parsing Morning -> Noon -> Evening -> Night -> Repeat
function SkyManager() {
    const skyRef = useRef<any>(null);
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const dirLight1Ref = useRef<THREE.DirectionalLight>(null);
    const dirLight2Ref = useRef<THREE.DirectionalLight>(null);
    const starsRef = useRef<any>(null);
    const moonRef = useRef<THREE.Mesh>(null);

    // Weather Themes Configuration
    const phases = [
        {   // 0s-7.5s: Morning
            sun: new THREE.Vector3(12, 2, 10),
            ambient: new THREE.Color("#FFD1B3"),
            dir1: new THREE.Color("#FFE0C2"),
            dir2: new THREE.Color("#E5A97C"),
            rayleigh: 1.5,
            turbidity: 4,
            mie: 0.005,
            stars: 0.2, // fading out
            moonY: -15, // dropping out of view
            moonOpacity: 0
        },
        {   // 7.5s-15s: Noon (Bright overhead, crisp sun)
            sun: new THREE.Vector3(0, 20, -5),
            ambient: new THREE.Color("#ffffff"),
            dir1: new THREE.Color("#ffffff"),
            dir2: new THREE.Color("#D4AF37"),
            rayleigh: 0.2,
            turbidity: 1,
            mie: 0.002, // Small crisp sun
            stars: 0,
            moonY: -15,
            moonOpacity: 0
        },
        {   // 15s-22.5s: Evening (Golden Hour, Huge Red Sun)
            sun: new THREE.Vector3(-25, 1, -15),
            ambient: new THREE.Color("#E58A5C"),
            dir1: new THREE.Color("#FF4500"),
            dir2: new THREE.Color("#8B2500"),
            rayleigh: 6,
            turbidity: 12,
            mie: 0.08, // Huge blazing sun disc
            stars: 0.4, // starting to appear
            moonY: -15,
            moonOpacity: 0
        },
        {   // 22.5s-30s: Night (Deep Dark, Stars, Bright Moon)
            sun: new THREE.Vector3(0, -15, 0), // Sun disabled
            ambient: new THREE.Color("#0A0E29"),
            dir1: new THREE.Color("#5C7BB8"), // Cold moonlight
            dir2: new THREE.Color("#1A2035"),
            rayleigh: 0.1,
            turbidity: 0.1,
            mie: 0.001,
            stars: 1, // Full stars!
            moonY: 15, // Moon rises
            moonOpacity: 1
        },
    ];

    useFrame((state, delta) => {
        // Tie lighting and atmosphere natively to the scroll depth of the Apple-style content panel
        const scrollY = window.scrollY;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        const mappedProgress = THREE.MathUtils.clamp(progress * 3, 0, 2.999);
        const phaseIndex = Math.floor(mappedProgress);
        const nextPhaseIndex = phaseIndex + 1;
        const lerpFactor = mappedProgress % 1;

        const current = phases[phaseIndex];
        const next = phases[nextPhaseIndex];

        // Smoothly interpolate all values
        if (skyRef.current?.material?.uniforms?.sunPosition) {
            const currentSun = skyRef.current.material.uniforms.sunPosition.value;
            currentSun.lerpVectors(current.sun, next.sun, lerpFactor);
        }

        if (skyRef.current?.material?.uniforms?.rayleigh) {
            skyRef.current.material.uniforms.rayleigh.value = THREE.MathUtils.lerp(current.rayleigh, next.rayleigh, lerpFactor);
            skyRef.current.material.uniforms.turbidity.value = THREE.MathUtils.lerp(current.turbidity, next.turbidity, lerpFactor);
            skyRef.current.material.uniforms.mieCoefficient.value = THREE.MathUtils.lerp(current.mie, next.mie, lerpFactor);
        }

        if (ambientLightRef.current) ambientLightRef.current.color.lerpColors(current.ambient, next.ambient, lerpFactor);
        if (dirLight1Ref.current) dirLight1Ref.current.color.lerpColors(current.dir1, next.dir1, lerpFactor);
        if (dirLight2Ref.current) dirLight2Ref.current.color.lerpColors(current.dir2, next.dir2, lerpFactor);

        // Update Stars
        if (starsRef.current?.material) {
            starsRef.current.material.transparent = true;
            starsRef.current.material.opacity = THREE.MathUtils.lerp(current.stars, next.stars, lerpFactor);
        }

        // Update Moon
        if (moonRef.current) {
            moonRef.current.position.y = THREE.MathUtils.lerp(current.moonY, next.moonY, lerpFactor);
            const mat = moonRef.current.material as THREE.MeshBasicMaterial;
            if (mat) {
                mat.transparent = true;
                mat.opacity = THREE.MathUtils.lerp(current.moonOpacity, next.moonOpacity, lerpFactor);
            }
        }
    });

    return (
        <>
            <Sky ref={skyRef} distance={450000} inclination={0} azimuth={0.25} />

            <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <mesh ref={moonRef} position={[-15, -15, -30]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial color="#E8F0FF" transparent opacity={0} fog={false} toneMapped={false} />
            </mesh>

            <ambientLight ref={ambientLightRef} intensity={2} />
            <directionalLight ref={dirLight1Ref} intensity={4} position={[10, 20, 10]} />
            <directionalLight ref={dirLight2Ref} intensity={2} position={[-10, 0, -10]} />
        </>
    );
}

// Procedural physics particle system for evening/night fireworks
function FireworkBurst({ delayOffset }: { delayOffset: number }) {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 800; // 800 sparks per firework!

    const [positions, velocities, colors] = useMemo(() => {
        const p = new Float32Array(particleCount * 3);
        const v = new Float32Array(particleCount * 3);
        const c = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            p[i * 3 + 1] = -1000; // Hide way below screen initially
        }
        return [p, v, c];
    }, [particleCount]);

    const timeSinceBurst = useRef(delayOffset);
    const center = useRef(new THREE.Vector3(0, -100, 0));

    useFrame((state, delta) => {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        if (!pointsRef.current) return;
        const mat = pointsRef.current.material as THREE.PointsMaterial;

        // Start shooting fireworks roughly at evening -> night (0.7 progress and beyond)
        if (progress > 0.7) {
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.05);
            timeSinceBurst.current += delta;

            if (timeSinceBurst.current > 3.0) {
                // Time for a new explosion!
                timeSinceBurst.current = 0;

                // Firecracker location in the high ceiling cloud area
                center.current.set(
                    (Math.random() - 0.5) * 50, // Between -25 and +25 X spread
                    15 + Math.random() * 20,    // High up
                    -10 - Math.random() * 15    // Mid-background
                );

                const colorPalette = [
                    new THREE.Color("#FF4500"), // Red/Orange
                    new THREE.Color("#00FF88"), // Mint Green
                    new THREE.Color("#00BFFF"), // Sky Blue
                    new THREE.Color("#FFD700"), // Golden
                    new THREE.Color("#FF1493")  // Hot Pink
                ];

                const burstColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                const secondaryColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

                const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
                const colArray = pointsRef.current.geometry.attributes.color.array as Float32Array;

                // Eject 800 particles spherically
                for (let i = 0; i < particleCount; i++) {
                    posArray[i * 3 + 0] = center.current.x;
                    posArray[i * 3 + 1] = center.current.y;
                    posArray[i * 3 + 2] = center.current.z;

                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    const speed = Math.random() * 25 + 5; // Explosion velocity

                    velocities[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed;
                    velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
                    velocities[i * 3 + 2] = Math.cos(phi) * speed;

                    // Mixed colors in the same shell
                    const c = Math.random() > 0.4 ? burstColor : secondaryColor;
                    colArray[i * 3 + 0] = c.r;
                    colArray[i * 3 + 1] = c.g;
                    colArray[i * 3 + 2] = c.b;
                }
                pointsRef.current.geometry.attributes.color.needsUpdate = true;
            }

            // Animate flying particles frame-by-frame
            const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
            const colArray = pointsRef.current.geometry.attributes.color.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                // Explosion drag & resistance
                velocities[i * 3 + 0] *= 0.95;
                velocities[i * 3 + 1] -= 5.0 * delta; // Gravity pull downwards
                velocities[i * 3 + 1] *= 0.95;
                velocities[i * 3 + 2] *= 0.95;

                posArray[i * 3 + 0] += velocities[i * 3 + 0] * delta;
                posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
                posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

                // Color gradually fades to exact black over 1.5 seconds.
                // When color reaches black (0,0,0), AdditiveBlending automatically makes it fully invisible! 
                colArray[i * 3 + 0] *= 0.96;
                colArray[i * 3 + 1] *= 0.96;
                colArray[i * 3 + 2] *= 0.96;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.geometry.attributes.color.needsUpdate = true;

        } else {
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            {/* Additive Blending merges light beams. Depth write disabled so transparency passes perfectly through */}
            <pointsMaterial size={0.6} vertexColors transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

function FireworksManager() {
    return (
        <group>
            {/* 3 staggered overlapping bursts */}
            <FireworkBurst delayOffset={0} />
            <FireworkBurst delayOffset={1.0} />
            <FireworkBurst delayOffset={2.0} />
        </group>
    );
}

export default function Background3D() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-[#050507]/20 to-[#050507]/80 z-10" />

            <Canvas camera={{ fov: 45 }} gl={{ alpha: true }}>
                <SkyManager />

                {/* Realistic metallic reflections */}
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <BurjKhalifa isMobile={!!isMobile} />
                    <DynamicClouds isMobile={!!isMobile} />
                </Suspense>

                <CameraRig isMobile={!!isMobile} />
                <FireworksManager />

                {/* Soft atmospheric depth matching the bright sky */}
                <fog attach="fog" args={["#87CEEB", 20, 100]} />
            </Canvas>
        </div>
    );
}

useGLTF.preload("/assets/free__burj_khalifa_dubai.glb");
