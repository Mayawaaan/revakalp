import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createBrushedMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add vertical streaks for brushed metal look
    for (let i = 0; i < 15000; i++) {
        const x = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(x, 0, Math.random() * 3, 512); 
    }
    
    // Add some fine granular noise
    for (let i = 0; i < 20000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(x, y, 1, 1);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const podVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const podFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simple 2D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv * vec2(4.0, 1.0);
    
    // Create elegant flowing waves using noise
    float n1 = snoise(uv * 3.0 + vec2(uTime * 0.15, uTime * 0.3));
    float n2 = snoise(uv * 6.0 - vec2(uTime * 0.3, uTime * 0.1));
    float wave = sin(uv.y * 8.0 + n1 * 4.0 + n2 * 2.0);
    
    // Smooth the wave into sharp glowing bands
    float pattern = smoothstep(0.7, 1.0, wave);
    
    // Combine base color and glowing pattern
    vec3 finalColor = mix(uColor * 0.5, uGlowColor, pattern * 1.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Futuristic pod made of layered geometry
const Pod = ({ position = [0, 0, 0], scale = 1, color = '#2b2b2b', accentColor = '#f2f2f2', glowColor = '#00eaff' }) => {
    const groupRef = useRef();
    const shaderMatRef = useRef();
    const metalMap = useMemo(() => createBrushedMetalTexture(), []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uGlowColor: { value: new THREE.Color(glowColor) }
    }), [color, glowColor]);

    useFrame((state) => {
        if (shaderMatRef.current) {
            shaderMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* ── Bottom Cylinder (Metallic Base) ── */}
            <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
                <cylinderGeometry args={[1, 1, 0.6, 64]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.5}
                    roughnessMap={metalMap}
                    clearcoat={0.3}
                    clearcoatRoughness={0.4}
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
                 <shaderMaterial 
                     ref={shaderMatRef}
                     vertexShader={podVertexShader}
                     fragmentShader={podFragmentShader}
                     uniforms={uniforms}
                 />
            </mesh>
        </group>
    );
};
export default Pod;