import React, { useRef, Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { Environment, ContactShadows, useGLTF, PresentationControls } from '@react-three/drei'
import mannequinUrl from '../../assets/lengha.glb'
import Pod from './Pod'
import { buildGLSLMaterials } from './glslMaterials'


const Mannequin = ({ position = [0, 0, 0], speed = 1.2, ...props }) => {
  const { scene } = useGLTF(mannequinUrl)
  const clonedScene = useMemo(() => scene.clone(), [scene])
  const groupRef = useRef()
  const updateTimeRef = useRef(null)

  // Track mouse speed to intensify cloth physics
  const lastPointer = useRef(new THREE.Vector2())
  const interactionSpeed = useRef(0)

  useEffect(() => {
    const { materials, updateTime } = buildGLSLMaterials()
    updateTimeRef.current = updateTime

    let meshIdx = 0
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        console.log(`[Lehenga mesh ${meshIdx}] name: "${child.name}"`)
        child.material = materials[meshIdx % materials.length]
        child.castShadow = true
        child.receiveShadow = true
        meshIdx++
      }
    })

    return () => {
      materials.forEach(mat => mat.dispose())
      updateTimeRef.current = null
    }
  }, [clonedScene])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime

      // Slow, sweeping levitation (always in the air)
      const floatSpeed = speed * 0.4
      groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * 0.15

      // Automatic -90 to +90 degree sweep over time
      const autoRotY = Math.sin(t * 0.4) * (Math.PI / 2)
      groupRef.current.rotation.y = autoRotY

      // Track pointer velocity
      const dx = state.pointer.x - lastPointer.current.x
      const dy = state.pointer.y - lastPointer.current.y
      const speedRaw = Math.sqrt(dx * dx + dy * dy)
      lastPointer.current.copy(state.pointer)

      // Smooth the velocity. If fast, spike up. If slow, decay down.
      if (speedRaw > 0.001) {
        interactionSpeed.current = THREE.MathUtils.lerp(interactionSpeed.current, speedRaw * 60.0, 0.1)
      } else {
        interactionSpeed.current = THREE.MathUtils.lerp(interactionSpeed.current, 0, 0.03)
      }

      // Cap interaction to avoid exploding physics
      const currentInteraction = Math.min(interactionSpeed.current, 2.5)

      // Drive all GLSL shader uniforms (time and interaction speed)
      if (updateTimeRef.current) updateTimeRef.current(t, currentInteraction)
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
    x: (Math.random() - 0.5) * 20,
    y: Math.random() * 6,
    z: (Math.random() - 0.5) * 10,
    speed: 0.002 + Math.random() * 0.008, // Much slower and calmer
    driftX: (Math.random() - 0.5) * 0.008,
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
          p.x = (Math.random() - 0.5) * 20
          p.z = (Math.random() - 0.5) * 10
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
          <meshBasicMaterial color="#fce7f3" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

const CameraRig = () => {
  const { camera, size } = useThree()
  useEffect(() => {
    // Shift the frustum offset so the center of the 3D world appears on the right side of the screen
    camera.setViewOffset(size.width, size.height, -size.width * 0.25, 0, size.width, size.height)
    camera.updateProjectionMatrix()
    return () => camera.clearViewOffset()
  }, [camera, size])
  return null
}

const ParallaxWrapper = ({ children, hovered }) => {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      // Parallax Effect from mouse (adds slight tilt and pan to the ENTIRE assembly)
      // Dramatically increased scale for stronger interaction
      // When hovered is false, targets become 0 so it smoothly returns to normal
      const parallaxRotY = hovered ? state.pointer.x * 0.8 : 0
      const parallaxRotX = hovered ? -(state.pointer.y * 0.3) : 0

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, parallaxRotY, 0.08)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, parallaxRotX, 0.08)
    }
  })
  return <group ref={groupRef}>{children}</group>
}

const Scene = ({ hovered }) => (
  <>
    <CameraRig />
    {/* ── Lighting: cool silver-blue studio for sapphire silk ── */}
    <ambientLight intensity={1.0} color="#e8eeff" />
    {/* Key light – cool daylight from top-right */}
    <directionalLight position={[4, 8, 4]} intensity={2.4} castShadow color="#ffd1df" />
    {/* Front fill – illuminates dupatta facing camera, pure white */}
    <directionalLight position={[0, 2, 8]} intensity={1.8} color="#ffffff" />
    {/* Left silver rim light – gives metallic sheen on zari */}
    <directionalLight position={[-5, 4, -2]} intensity={1.2} color="#ffb6c1" />
    {/* Blue-violet under-fill for silk depth */}
    <pointLight position={[-3, 1, 3]} intensity={1.0} color="#ff69b4" />
    {/* Silver top specular */}
    <pointLight position={[0, 6, 0]} intensity={0.7} color="#ffe4e1" />
    {/* Warm ground bounce to break monotony */}
    <pointLight position={[2, -1, 4]} intensity={0.4} color="#ffe8d0" />

    {/* ── Studio environment ── */}
    <Environment preset="studio" background={false} />

    {/* ── Static Designer Podium ── */}
    <group position={[0, 0, 0]}>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.30} scale={12} blur={3} far={4} color="#9c2756" />
      <Pod
        position={[0, -1.65, 0]}
        scale={1.3}
        color="#9c2756"
        accentColor="#ffe4e1"
        glowColor="#c9487c"
      />
    </group>

    {/* ── Interactive 3D Model (Centered in world, rendered on right via CameraRig) ── */}
    <PresentationControls
      global={true}
      cursor={true}
      snap={true}
      rotation={[0, 0, 0]}
      polar={[-0.25, 0.25]}
      azimuth={[-Math.PI, Math.PI]}
      config={{ mass: 1, tension: 170, friction: 15 }}
    >
      <ParallaxWrapper hovered={hovered}>
        <group position={[0, 0, 0]}>
          <Mannequin position={[0, -0.2, 0]} rotation={[-0.01, 0, 0]} scale={2} />
        </group>
      </ParallaxWrapper>
    </PresentationControls>

    {/* ── Dust particles: silver sparkles ── */}
    <WindDust />
  </>
)

const New3D = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <Canvas
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      shadows
      camera={{ fov: 42, position: [0, 1.5, 9] }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene hovered={hovered} />
      </Suspense>
    </Canvas>
  )
}

export default New3D
