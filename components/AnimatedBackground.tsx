'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const torusRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    
    useEffect(() => {
        const handleResize = () => {
            if (!cameraRef.current) return

            cameraRef.current.aspect = window.innerWidth / window.innerHeight
            cameraRef.current.updateProjectionMatrix()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useFrame(() => {
        if (!torusRef.current) return

        torusRef.current.rotation.x += 0.01
        torusRef.current.rotation.y += 0.005
    })

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            <Canvas>
                <ambientLight />
                <pointLight position={{ x: 10, y: 10, z: 10 }} />
                <mesh ref={torusRef}>
                    <torusGeometry args={[10, 3, 16, 100]} />
                    <meshBasicMaterial color={0x0AE98} wireframe />
                </mesh>
                <perspectiveCamera ref={cameraRef} position={[0, 0, 30]} />
            </Canvas>
        </div>
    );
};