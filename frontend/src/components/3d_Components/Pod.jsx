import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Futuristic pod made of layered geometry
const Pod = ({ position = [0, 0, 0], scale = 1, color = '#2b2b2b', accentColor = '#f2f2f2', glowColor = '#00eaff' }) => {
    const groupRef = useRef();

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* ── Bottom Cylinder (Metallic Base) ── */}
            <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
                <cylinderGeometry args={[1, 1, 0.6, 64]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    clearcoat={0.5}
                    clearcoatRoughness={0.2}
                />
            </mesh>

            {/* ── LED Ring ── */}
            <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.98, 0.98, 0.05, 64]} />
                <meshStandardMaterial 
                    color={glowColor} 
                    emissive={glowColor} 
                    emissiveIntensity={2.5} 
                />
            </mesh>

            {/* ── Top Cylinder (Glossy Glass Top) ── */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.96, 0.96, 0.42, 64]} />
                <meshPhysicalMaterial
                    color={accentColor}
                    metalness={0.0}
                    roughness={0.05}
                    transmission={0.4}
                    thickness={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
            
            {/* ── Inner Core (Visible through glass) ── */}
            <mesh position={[0, 0.25, 0]}>
                 <cylinderGeometry args={[0.5, 0.5, 0.4, 64]} />
                 <meshStandardMaterial color={color} metalness={0.9} roughness={0.4} />
            </mesh>
        </group>
    );
};
export default Pod;