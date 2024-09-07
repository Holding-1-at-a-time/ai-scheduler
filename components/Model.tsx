import { useLoader } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Primitive } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Model() {
    const gltf = useLoader(GLTFLoader, 'public/2021-BMW-M3/scene.gltf.glb');
    return (
        <group ref={(ref) => ref && ref.rotateY(Math.PI / 4)}>
            <Primitive scale={0.01} object={gltf.scene} />
            <OrbitControls ref={(ref) => ref && ref.update()} args={[camera, gl.domElement]} />
        </group>
    );
}