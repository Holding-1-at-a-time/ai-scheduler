import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model() {
    const gltf = useLoader(GLTFLoader, 'public/2021-BMW-M3/scene.gltf.glb')
    return <primitive scale={0.01}>{gltf.scene}</primitive>
}