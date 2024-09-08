'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Car3D() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true })

        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        containerRef.current.appendChild(renderer.domElement)

        const light = new THREE.PointLight(0xffffff, 1, 100)
        light.position.set(0, 0, 10)
        scene.add(light)

        const loader = new GLTFLoader()
        loader.load('public/2021-BMW-M3/scene.gltf', (gltf: { scene: THREE.Object3D }) => {
            scene.add(gltf.scene)
            gltf.scene.scale.set(0.5, 0.5, 0.5)
            gltf.scene.position.set(0, -1, 0)
        }, undefined, (error: any) => {
            console.error('An error occurred loading the 3D model:', error)
        })

        camera.position.z = 5

        const animate = () => {
            requestAnimationFrame(animate)
            if (scene.children.length > 1) {
                scene.children[1].rotation.y += 0.01
            }
            renderer.render(scene, camera)
        }

        animate()

        const handleResize = () => {
            if (!containerRef.current) return
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize);
            container?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="w-full h-64" />
}