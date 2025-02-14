'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Model = dynamic(() => import('@/components/Model'), { ssr: false })

export function CarModel3D() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    const hemisphereLightProps = { args: [0xffffff, 0x000000, 0.5] };
    
    return (
        <div className="w-full h-64">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight color={[0xffffff, 0.5]} />
                <hemisphereLight {...hemisphereLightProps} />
                <spotLight ref={[10, 10, 10]} />
                <pointLight ref={[-10, -10, -10]} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    )
}