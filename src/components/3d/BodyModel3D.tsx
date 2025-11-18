'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface BodyPart {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  label: string;
}

function BodyPartMesh({
  position,
  scale,
  color,
  label,
  onClick,
  isSelected,
}: BodyPart & { onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isSelected ? '#ef4444' : hovered ? '#60a5fa' : color}
        emissive={isSelected ? '#ef4444' : hovered ? '#60a5fa' : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0}
        metalness={0.3}
        roughness={0.7}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function HumanBody({ onBodyPartClick, selectedPart }: {
  onBodyPartClick: (part: string, position: [number, number, number]) => void;
  selectedPart: string | null;
}) {
  const bodyParts: (BodyPart & { id: string })[] = [
    // Head
    { id: 'head', position: [0, 4, 0], scale: [0.8, 0.8, 0.8], color: '#fde68a', label: 'Head' },
    // Neck
    { id: 'neck', position: [0, 3.3, 0], scale: [0.4, 0.4, 0.4], color: '#fde68a', label: 'Neck' },
    // Torso
    { id: 'chest', position: [0, 2.5, 0], scale: [1.2, 1.2, 0.8], color: '#93c5fd', label: 'Chest' },
    { id: 'abdomen', position: [0, 1.3, 0], scale: [1.1, 1, 0.7], color: '#93c5fd', label: 'Abdomen' },
    // Arms
    { id: 'left-shoulder', position: [-0.9, 2.7, 0], scale: [0.5, 0.5, 0.5], color: '#93c5fd', label: 'Left Shoulder' },
    { id: 'left-upper-arm', position: [-1.3, 1.9, 0], scale: [0.35, 0.8, 0.35], color: '#fde68a', label: 'Left Upper Arm' },
    { id: 'left-forearm', position: [-1.3, 0.8, 0], scale: [0.3, 0.7, 0.3], color: '#fde68a', label: 'Left Forearm' },
    { id: 'left-hand', position: [-1.3, 0.1, 0], scale: [0.25, 0.4, 0.2], color: '#fde68a', label: 'Left Hand' },

    { id: 'right-shoulder', position: [0.9, 2.7, 0], scale: [0.5, 0.5, 0.5], color: '#93c5fd', label: 'Right Shoulder' },
    { id: 'right-upper-arm', position: [1.3, 1.9, 0], scale: [0.35, 0.8, 0.35], color: '#fde68a', label: 'Right Upper Arm' },
    { id: 'right-forearm', position: [1.3, 0.8, 0], scale: [0.3, 0.7, 0.3], color: '#fde68a', label: 'Right Forearm' },
    { id: 'right-hand', position: [1.3, 0.1, 0], scale: [0.25, 0.4, 0.2], color: '#fde68a', label: 'Right Hand' },

    // Legs
    { id: 'left-thigh', position: [-0.4, -0.2, 0], scale: [0.45, 1.2, 0.45], color: '#93c5fd', label: 'Left Thigh' },
    { id: 'left-knee', position: [-0.4, -1.5, 0], scale: [0.4, 0.3, 0.4], color: '#fde68a', label: 'Left Knee' },
    { id: 'left-shin', position: [-0.4, -2.5, 0], scale: [0.35, 1, 0.35], color: '#fde68a', label: 'Left Shin' },
    { id: 'left-foot', position: [-0.4, -3.3, 0.15], scale: [0.3, 0.3, 0.5], color: '#fde68a', label: 'Left Foot' },

    { id: 'right-thigh', position: [0.4, -0.2, 0], scale: [0.45, 1.2, 0.45], color: '#93c5fd', label: 'Right Thigh' },
    { id: 'right-knee', position: [0.4, -1.5, 0], scale: [0.4, 0.3, 0.4], color: '#fde68a', label: 'Right Knee' },
    { id: 'right-shin', position: [0.4, -2.5, 0], scale: [0.35, 1, 0.35], color: '#fde68a', label: 'Right Shin' },
    { id: 'right-foot', position: [0.4, -3.3, 0.15], scale: [0.3, 0.3, 0.5], color: '#fde68a', label: 'Right Foot' },
  ];

  return (
    <group>
      {bodyParts.map((part) => (
        <BodyPartMesh
          key={part.id}
          {...part}
          onClick={() => onBodyPartClick(part.id, part.position)}
          isSelected={selectedPart === part.id}
        />
      ))}

      {/* Grid floor */}
      <gridHelper args={[10, 10, '#888888', '#cccccc']} position={[0, -4, 0]} />
    </group>
  );
}

function Scene({ onBodyPartClick, selectedPart }: {
  onBodyPartClick: (part: string, position: [number, number, number]) => void;
  selectedPart: string | null;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />

      <HumanBody onBodyPartClick={onBodyPartClick} selectedPart={selectedPart} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

interface BodyModel3DProps {
  onSelect: (bodyPart: string, position: [number, number, number]) => void;
}

export default function BodyModel3D({ onSelect }: BodyModel3DProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handleBodyPartClick = (part: string, position: [number, number, number]) => {
    setSelectedPart(part);
    onSelect(part, position);
  };

  return (
    <div className="w-full h-[500px] relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gradient-to-b from-blue-50 to-purple-50">
      <Canvas camera={{ position: [0, 1, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene onBodyPartClick={handleBodyPartClick} selectedPart={selectedPart} />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <motion.div
        className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>🖱️ Click on body parts to select</p>
        <p>🔄 Drag to rotate • Scroll to zoom</p>
      </motion.div>

      {selectedPart && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          ✓ Selected: {selectedPart.replace(/-/g, ' ').toUpperCase()}
        </motion.div>
      )}
    </div>
  );
}
