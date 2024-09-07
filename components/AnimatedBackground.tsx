'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
    
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true })
    
        renderer.setSize(window.innerWidth, window.innerHeight)
        containerRef.current.appendChild(renderer.domElement)
    
        const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
        const material = new THREE.MeshBasicMaterial({ color: 0x0AE98, wireframe: true })
        const torus = new THREE.Mesh(geometry, material)
    
        scene.add(torus)
        camera.position.z = 30
    
        const animate = () => {
            requestAnimationFrame(animate)
            torus.rotation.x += 0.01
            torus.rotation.y += 0.005
            renderer.render(scene, camera)
        }
    
        animate()
    
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
    
        const containerElement = containerRef.current; // Copy the ref value to a variable
    
        window.addEventListener('resize', handleResize)
    
        return () => {
            window.removeEventListener('resize', handleResize)
            containerElement?.removeChild(renderer.domElement) // Use the copied variable
        }
    }, [])
}