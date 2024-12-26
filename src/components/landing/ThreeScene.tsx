import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

function Box() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export const ThreeScene = () => {
  return (
    <div className="h-[400px] w-full bg-black">
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 4], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};