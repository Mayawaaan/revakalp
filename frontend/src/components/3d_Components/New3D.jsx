import React, { useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { Environment, ContactShadows, useGLTF } from '@react-three/drei'
import mannequinUrl from '../../assets/lengha.glb'
import Pod from './Pod'

// Brand palette: primary rose #c9487c, pink-900 #9c2756, blush highlights
const THEME_PALETTE = [
  { color: '#e8a076ff', roughness: 0.55, metalness: 0.05 }, // skin / body – warm blush
  { color: '#c9487c', roughness: 0.85, metalness: 0.18 }, // main outfit – brand rose
  { color: '#e8a0b4', roughness: 0.85, metalness: 0.82 }, // dupatta – soft rose-pink
  { color: '#9c2756', roughness: 0.50, metalness: 0.06 }, // deep accent – pink-900
  { color: '#f399b6ff', roughness: 0.40, metalness: 0.10 }, // blush highlight
]

const Mannequin = ({ position = [0, 0, 0], speed = 1.2, ...props }) => {
  const { scene } = useGLTF(mannequinUrl)
  const clonedScene = useMemo(() => scene.clone(), [scene])
  const groupRef = useRef()

  useEffect(() => {
    let meshIdx = 0
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const theme = THEME_PALETTE[meshIdx % THEME_PALETTE.length]
        meshIdx++
        child.material = new THREE.MeshPhysicalMaterial({
          color: theme.color,
          roughness: theme.roughness,
          metalness: theme.metalness,
          side: THREE.DoubleSide,     // dupatta renders from both faces
          envMapIntensity: 1.4,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [clonedScene])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      groupRef.current.position.y = position[1] + Math.sin(t * speed) * 0.12
      groupRef.current.rotation.y = t * 0.4
    }
  })

  return (
    <group ref={groupRef} position={position} {...props}>
      <primitive object={clonedScene} />
    </group>
  )
}

const WindDust = ({ count = 200 }) => {
  const dustRef = useRef([])

  const dustProps = useRef(Array.from({ length: count }).map(() => ({
    x: (Math.random() - 0.5) * 6,
    y: Math.random() * 6,
    z: (Math.random() - 0.5) * 4,
    speed: 0.006 + Math.random() * 0.018,
    driftX: (Math.random() - 0.5) * 0.012,
    driftZ: (Math.random() - 0.5) * 0.012,
    scale: 0.8 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
  })))

  useFrame((state) => {
    const time = state.clock.elapsedTime
    dustRef.current.forEach((mesh, i) => {
      if (mesh) {
        const p = dustProps.current[i]
        p.y += p.speed
        if (p.y > 5) {
          p.y = -0.5
          p.x = (Math.random() - 0.5) * 6
          p.z = (Math.random() - 0.5) * 4
        }
        p.x += p.driftX + Math.sin(time * 1.8 + p.phase) * -0.035
        p.z += p.driftZ + Math.cos(time * 1.4 + p.phase) * 0.025
        mesh.position.set(p.x, p.y, p.z)

        let opacity = 0.65
        if (p.y < 0.5) opacity = (p.y + 0.5) * 0.65
        else if (p.y > 3.5) opacity = Math.max(0, 0.65 * (1 - (p.y - 3.5) / 1.5))
        mesh.material.opacity = opacity
      }
    })
  })

  return (
    <group position={[0, -1.5, 0]}>
      {dustProps.current.map((p, i) => (
        <mesh key={i} ref={(el) => (dustRef.current[i] = el)} scale={p.scale}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#c9487c" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

const Scene = () => (
  <>
    {/* ── Lighting ── */}
    <ambientLight intensity={1.2} color="#fff0f5" />
    <directionalLight position={[4, 8, 4]} intensity={2.2} castShadow color="#ffffff" />
    {/* Front fill – illuminates dupatta facing the camera */}
    <directionalLight position={[0, 2, 8]} intensity={1.6} color="#ffffff" />
    <pointLight position={[-4, 3, 2]} intensity={0.8} color="#f7c5d5" />
    <pointLight position={[3, 5, -3]} intensity={0.5} color="#fce4ec" />
    <pointLight position={[0, 1, 5]}  intensity={1.0} color="#ffe8f0" />

    {/* ── Studio environment ── */}
    <Environment preset="studio" background={false} />

    {/* ── Contact shadow ── */}
    <ContactShadows position={[0, -2.5, 0]} opacity={0.25} scale={12} blur={3} far={4} color="#c9487c" />

    {/* ── Pod – brand rose theme ── */}
    <Pod
      position={[0, -1.5, 0]}
      scale={1.3}
      color="#9c2756"       /* deep pink-900 base   */
      accentColor="#fce4ec" /* blush glass top       */
      glowColor="#c9487c"   /* brand rose LED ring   */
    />

    {/* ── Mannequin ── */}
    <Mannequin position={[0, -1.25, 0]} rotation={[-0.01, 0, 0]} scale={2} />

    {/* ── Dust particles ── */}
    <WindDust />
  </>
)

const New3D = () => (
  <Canvas
    shadows
    camera={{ fov: 42, position: [0, 1.5, 9] }}
    style={{ background: 'transparent', width: '100%', height: '100%' }}
  >
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  </Canvas>
)

export default New3D
