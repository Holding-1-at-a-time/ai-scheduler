import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Rest of the code

export default function Model() {
    const gltf = useLoader(GLTFLoader, 'public/2021-BMW-M3/scene.gltf.glb')
    return <primitiveObject scale={0.01}>{gltf.scene}</primitiveObject>
}